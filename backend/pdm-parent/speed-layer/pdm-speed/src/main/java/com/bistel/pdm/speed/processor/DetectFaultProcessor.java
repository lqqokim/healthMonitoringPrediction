package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Windowed;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * fault detection
 */
public class DetectFaultProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectFaultProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final static String SEPARATOR = ",";

    private int windowSize = 6;
    private int outCount = 3;

    private WindowStore<String, Double> kvParamValueStore;
    private KeyValueStore<String, Long> kvIntervalStore;
    private KeyValueStore<String, Integer> kvAlarmCountStore;
    private KeyValueStore<String, Integer> kvWarningCountStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvParamValueStore = (WindowStore) context().getStateStore("fd-value-store");
        kvIntervalStore = (KeyValueStore) context().getStateStore("fd-summary-interval");
        kvAlarmCountStore = (KeyValueStore) context().getStateStore("fd-alarm-count");
        kvWarningCountStore = (KeyValueStore) context().getStateStore("fd-warning-count");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // time, p1, p2, p3, p4, ... pn, status:time, prev:time
        String[] recordColumns = recordValue.split(SEPARATOR);

        List<ParameterMasterDataSet> paramData =
                MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

        if (paramData == null) {
            log.debug("[{}] - There are no registered the parameter.", partitionKey);
            return;
        }

        try {
            String statusCodeAndTime = recordColumns[recordColumns.length - 2];
            String[] nowStatusCodeAndTime = statusCodeAndTime.split(":");

            String prevStatusAndTime = recordColumns[recordColumns.length - 1];
            String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");

            // idle -> run
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("I")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                kvIntervalStore.put(partitionKey, Long.parseLong(nowStatusCodeAndTime[1]));
            }

            // processing
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")) {
                // check OOS
                for (ParameterMasterDataSet paramMaster : paramData) {
                    if (paramMaster.getParamParseIndex() <= 0) continue;

                    String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

                    ParameterHealthDataSet healthData =
                            MasterDataCache.getInstance().getParamHealthFD01(paramMaster.getParameterRawId());

                    if (healthData == null) {
                        log.debug("[{}] - No health info. for parameter : {}.", partitionKey, paramMaster.getParameterName());
                        continue;
                    }

                    checkOutOfSpec(paramKey, partitionKey, recordColumns, paramMaster, healthData, streamByteRecord);
                }
            }

            // run -> idle
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                Long startTime = Long.parseLong(nowStatusCodeAndTime[1]);
                if (kvIntervalStore.get(partitionKey) != null) {
                    startTime = kvIntervalStore.get(partitionKey);
                }
                Long endTime = Long.parseLong(prevStatusCodeAndTime[1]);

                log.debug("[{}] - processing interval from {} to {}.", partitionKey, startTime, endTime);

                HashMap<String, List<Double>> paramValueList = new HashMap<>();

                KeyValueIterator<Windowed<String>, Double> storeIterator = kvParamValueStore.fetchAll(startTime, endTime);
                while (storeIterator.hasNext()) {
                    KeyValue<Windowed<String>, Double> kv = storeIterator.next();

                    if (!paramValueList.containsKey(kv.key.key())) {
                        ArrayList<Double> arrValue = new ArrayList<>();
                        arrValue.add(kv.value);
                        paramValueList.put(kv.key.key(), arrValue);
                    } else {
                        List<Double> arrValue = paramValueList.get(kv.key.key());
                        arrValue.add(kv.value);
                    }
                }

                for (ParameterMasterDataSet paramMaster : paramData) {
                    if (paramMaster.getParamParseIndex() <= 0) continue;

                    String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

                    ParameterHealthDataSet fd02HealthInfo =
                            MasterDataCache.getInstance().getParamHealthFD02(paramMaster.getParameterRawId());

                    if (fd02HealthInfo == null) {
                        log.debug("[{}] - No health info. for parameter : {}.", partitionKey, paramMaster.getParameterName());
                        continue;
                    }

                    List<Double> doubleValueList = paramValueList.get(paramKey);
                    log.debug("[{}] - window data size : {}", paramKey, doubleValueList.size());

                    // check spc rule
                    this.evaluateRule(partitionKey, paramKey, doubleValueList, endTime, paramMaster, fd02HealthInfo);

                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            context().commit();
        }
    }

    private boolean existAlarm(String paramKey) {
        return kvAlarmCountStore.get(paramKey) != null && kvAlarmCountStore.get(paramKey) > 0;
    }

    private boolean existWarning(String paramKey) {
        return kvWarningCountStore.get(paramKey) != null && kvWarningCountStore.get(paramKey) > 0;
    }

    private void checkOutOfSpec(String paramKey, String partitionKey, String[] recordColumns,
                                ParameterMasterDataSet param, ParameterHealthDataSet healthData, byte[] streamByteRecord) {

        Double paramValue = Double.parseDouble(recordColumns[param.getParamParseIndex()]);
        kvParamValueStore.put(paramKey, paramValue, parseStringToTimestamp(recordColumns[0]));

        log.debug("[{}] : check the out of spec. - {}", paramKey, paramValue);
        if ((param.getUpperAlarmSpec() != null && paramValue >= param.getUpperAlarmSpec())
                || (param.getLowerAlarmSpec() != null && paramValue <= param.getLowerAlarmSpec())) {
            // Alarm
            if (kvAlarmCountStore.get(paramKey) == null) {
                kvAlarmCountStore.put(paramKey, 1);
            } else {
                int cnt = kvAlarmCountStore.get(paramKey);
                kvAlarmCountStore.put(paramKey, cnt + 1);
            }

            // time, param_rawid, health_rawid, vlaue, A/W, uas, uws, tgt, las, lws, fault_class
            String sb = parseStringToTimestamp(recordColumns[0]) + "," +
                    param.getParameterRawId() + "," +
                    healthData.getParamHealthRawId() + ',' +
                    paramValue + "," +
                    "256" + "," +
                    param.getUpperAlarmSpec() + "," +
                    param.getUpperWarningSpec() + "," +
                    param.getTarget() + "," +
                    param.getLowerAlarmSpec() + "," +
                    param.getLowerWarningSpec() + "," + "Unbalance";

            // to do : fault classifications

            context().forward(partitionKey, sb.getBytes(), "output-fault");
            log.debug("[{}] - ALARM (UAL:{}, LAL:{}) - {}", paramKey,
                    param.getUpperAlarmSpec(), param.getLowerAlarmSpec(), paramValue);

            //send mail
                /*
                    - Equipment ID: EQP01
                    - Time: 2018.07.06 15:00:01
                    - Alarm/Warning: Alarm
                    - Parameter Name: Vibration
                    - Parameter Value: 0.51
                    - Parameter Spec: 0.40
                    - Fault Classification : Unbalance
                 */
//            String mailText = "" + "\n" +
//                    "- Equipment ID : " + paramKey + "\n" +
//                    "- Time : " + recordColumns[0] + "\n" +
//                    "- Alarm/Warning : Alarm" + "\n" +
//                    "- Parameter Name : " + param.getParameterName() + "\n" +
//                    "- Parameter Value : " + paramValue + "\n" +
//                    "- Parameter Spec : " + param.getUpperAlarmSpec() + "\n" +
//                    "- Fault Classification : Unbalance";
//
//            log.debug("[{}] - send mail");
//            context().forward(partitionKey, mailText.getBytes(), "sendmail");

//            log.debug("[{}] - collecting the raw data.");
//            //context().forward(partitionKey, streamByteRecord, "output-raw");

        } else if ((param.getUpperWarningSpec() != null && paramValue >= param.getUpperWarningSpec())
                || (param.getLowerWarningSpec() != null && paramValue <= param.getLowerWarningSpec())) {
            //warning
            if (kvWarningCountStore.get(paramKey) == null) {
                kvWarningCountStore.put(paramKey, 1);
            } else {
                int cnt = kvWarningCountStore.get(paramKey);
                kvWarningCountStore.put(paramKey, cnt + 1);
            }

            // time, param_rawid, health_rawid, vlaue, A/W, uas, uws, tgt, las, lws, fault_class
            String sb = parseStringToTimestamp(recordColumns[0]) + "," +
                    param.getParameterRawId() + "," +
                    healthData.getParamHealthRawId() + ',' +
                    paramValue + "," +
                    "128" + "," +
                    param.getUpperAlarmSpec() + "," +
                    param.getUpperWarningSpec() + "," +
                    param.getTarget() + "," +
                    param.getLowerAlarmSpec() + "," +
                    param.getLowerWarningSpec() + "," + "N/A";

//                    String mailText = "" + "\n" +
//                            "- Equipment ID : " + paramKey + "\n" +
//                            "- Time : " + recordColumns[0] + "\n" +
//                            "- Alarm/Warning : Warning" + "\n" +
//                            "- Parameter Name : " + param.getParameterName() + "\n" +
//                            "- Parameter Value : " + paramValue + "\n" +
//                            "- Parameter Spec : " + param.getUpperAlarmSpec() + "\n" +
//                            "- Fault Classification : Unbalance";
//
//                    context().forward(partitionKey, mailText.getBytes(), "sendmail");

            context().forward(partitionKey, sb.getBytes(), "output-fault");

            log.debug("[{}] - WARNING (UWL:{}, LWL:{}) - {}", paramKey,
                    param.getUpperWarningSpec(), param.getLowerWarningSpec(), paramValue);

        }
    }

    private void evaluateRule(String partitionKey, String paramKey, List<Double> paramValues, Long ruleTime,
                              ParameterMasterDataSet paramMaster, ParameterHealthDataSet fd02HealthInfo) {

        List<Double> slidingWindow = new ArrayList<>(windowSize);

        if (existAlarm(paramKey)) {
            // alarm
            int totalAlarmCount = 0;
            for (int i = 0; i < paramValues.size(); i++) {
                Double paramValue = paramValues.get(i);

                if (slidingWindow.size() == windowSize) {
                    //check alarm
                    int alarmCount = 0;
                    for (Double dValue : slidingWindow) {
                        if ((paramMaster.getUpperAlarmSpec() != null && dValue >= paramMaster.getUpperAlarmSpec())
                                || (paramMaster.getLowerAlarmSpec() != null && dValue <= paramMaster.getLowerAlarmSpec())) {

                            alarmCount++;
                        }
                    }

                    log.debug("[{}] - window : {} ", paramKey, slidingWindow.toArray());

                    if (alarmCount > outCount) {
                        totalAlarmCount++;
                    }
                    // remove last one
                    slidingWindow.remove(0);
                }
                // add new value
                slidingWindow.add(paramValue);
            }

            if(totalAlarmCount > 0){
                // is alarm
                // time, param_rawid, health_rawid, vlaue, A/W, uas, uws, tgt, las, lws, fault_class
                String sb = ruleTime + "," +
                        paramMaster.getParameterRawId() + "," +
                        fd02HealthInfo.getParamHealthRawId() + ',' +
                        totalAlarmCount + "," +
                        "256" + "," +
                        paramMaster.getUpperAlarmSpec() + "," +
                        paramMaster.getUpperWarningSpec() + "," +
                        paramMaster.getTarget() + "," +
                        paramMaster.getLowerAlarmSpec() + "," +
                        paramMaster.getLowerWarningSpec() + "," + "N/A";

                // to do : fault classifications

                context().forward(partitionKey, sb.getBytes(), "output-fault");

                log.debug("[{}] - ALARM by Rule - {} counts.", paramKey, totalAlarmCount);
            }

        } else if (existWarning(paramKey)) {
            // warning
            int totalWarningCount = 0;
            for (int i = 0; i < paramValues.size(); i++) {
                Double paramValue = paramValues.get(i);

                if (slidingWindow.size() == windowSize) {
                    //check warning
                    int warningCount = 0;
                    for (Double dValue : slidingWindow) {
                        if ((paramMaster.getUpperWarningSpec() != null && dValue >= paramMaster.getUpperWarningSpec())
                                || (paramMaster.getLowerWarningSpec() != null && dValue <= paramMaster.getLowerWarningSpec())) {

                            warningCount++;
                        }
                    }

                    if (warningCount > outCount) {
                        totalWarningCount++;
                    }
                    // remove last one
                    slidingWindow.remove(0);
                }
                // add new value
                slidingWindow.add(paramValue);
            }

            if(totalWarningCount > 0){
                // is alarm
                // time, param_rawid, health_rawid, vlaue, A/W, uas, uws, tgt, las, lws, fault_class
                String sb = ruleTime + "," +
                        paramMaster.getParameterRawId() + "," +
                        fd02HealthInfo.getParamHealthRawId() + ',' +
                        totalWarningCount + "," +
                        "128" + "," +
                        paramMaster.getUpperAlarmSpec() + "," +
                        paramMaster.getUpperWarningSpec() + "," +
                        paramMaster.getTarget() + "," +
                        paramMaster.getLowerAlarmSpec() + "," +
                        paramMaster.getLowerWarningSpec() + "," + "N/A";

                // to do : fault classifications

                context().forward(partitionKey, sb.getBytes(), "output-fault");
                log.debug("[{}] - WARNING by Rule - {} counts.", paramKey, totalWarningCount);
            }

        } else {
            log.debug("{} is normal.", paramKey);
        }
    }

    private static Long parseStringToTimestamp(String item) {
        Long time = 0L;

        try {
            Date parsedDate = dateFormat.parse(item);
            Timestamp timestamp = new Timestamp(parsedDate.getTime());
            time = timestamp.getTime();
        } catch (Exception e) {
            log.error(e.getMessage() + " : " + item, e);
        }

        return time;
    }
}
