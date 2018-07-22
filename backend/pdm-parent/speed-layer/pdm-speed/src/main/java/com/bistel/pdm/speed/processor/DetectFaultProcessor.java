package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
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

    private WindowStore<String, String> kvParamValueStore;
    private KeyValueStore<String, Long> kvIntervalStore;
    private KeyValueStore<String, Integer> kvAlarmCountStore;
    private KeyValueStore<String, Integer> kvWarningCountStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvParamValueStore = (WindowStore) context().getStateStore("speed-param-value");
        kvIntervalStore = (KeyValueStore) context().getStateStore("speed-process-interval");
        kvAlarmCountStore = (KeyValueStore) context().getStateStore("speed-alarm-count");
        kvWarningCountStore = (KeyValueStore) context().getStateStore("speed-warning-count");
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

            if (kvIntervalStore.get(partitionKey) == null) {
                kvIntervalStore.put(partitionKey, Long.parseLong(nowStatusCodeAndTime[1]));
            }

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

                    Double paramValue = Double.parseDouble(recordColumns[paramMaster.getParamParseIndex()]);

                    Long time = parseStringToTimestamp(recordColumns[0]);
                    kvParamValueStore.put(paramKey, time + "," + paramValue, time);

                    if (healthData != null) {
                        checkOutOfSpec(paramKey, partitionKey, recordColumns, paramMaster, healthData, paramValue);
                    }
                }
            }

            // run -> idle
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                Long startTime = kvIntervalStore.get(partitionKey);
                Long endTime = Long.parseLong(prevStatusCodeAndTime[1]);

                log.debug("[{}] - processing interval from {} to {}.", partitionKey, startTime, endTime);

                HashMap<String, List<String>> paramValueList = new HashMap<>();

                KeyValueIterator<Windowed<String>, String> storeIterator = kvParamValueStore.fetchAll(startTime, endTime);
                while (storeIterator.hasNext()) {
                    KeyValue<Windowed<String>, String> kv = storeIterator.next();

                    //log.debug("[{}] - fetch : {}", kv.key.key(), kv.value);

                    if (!paramValueList.containsKey(kv.key.key())) {
                        ArrayList<String> arrValue = new ArrayList<>();
                        arrValue.add(kv.value);
                        paramValueList.put(kv.key.key(), arrValue);
                    } else {
                        List<String> arrValue = paramValueList.get(kv.key.key());
                        arrValue.add(kv.value);
                    }
                }

                for (ParameterMasterDataSet paramMaster : paramData) {
                    if (paramMaster.getParamParseIndex() <= 0) continue;

                    String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

                    ParameterHealthDataSet fd02HealthInfo =
                            MasterDataCache.getInstance().getParamHealthFD02(paramMaster.getParameterRawId());

                    if (fd02HealthInfo != null) {
                        List<String> doubleValueList = paramValueList.get(paramKey);
                        if (doubleValueList == null) {
                            log.debug("[{}] - Unable to check spec...", paramKey);
                            continue;
                        }
                        //log.debug("[{}] - window data size : {}", paramKey, doubleValueList.size());

                        for(Pair<String, Integer> option :
                                MasterDataCache.getInstance().getParamHealthFD02Options(paramMaster.getParameterRawId())){

                            if(option.getFirst().equalsIgnoreCase("M")){
                                this.windowSize = option.getSecond();
                            } else {
                                this.outCount = option.getSecond();
                            }
                        }

                        // check spc rule
                        this.evaluateRule(partitionKey, paramKey, doubleValueList, endTime, paramMaster, fd02HealthInfo);

                    } else {
                        log.trace("[{}] - No health info. parameter : {}.", partitionKey, paramMaster.getParameterName());
                    }
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
                                ParameterMasterDataSet param, ParameterHealthDataSet healthData,
                                Double paramValue) {

        log.debug("[{}] : check the out of individual spec. - {}", paramKey, paramValue);
        if ((param.getUpperAlarmSpec() != null && paramValue >= param.getUpperAlarmSpec())
                || (param.getLowerAlarmSpec() != null && paramValue <= param.getLowerAlarmSpec())) {
            // Alarm
            if (kvAlarmCountStore.get(paramKey) == null) {
                kvAlarmCountStore.put(paramKey, 1);
            } else {
                int cnt = kvAlarmCountStore.get(paramKey);
                kvAlarmCountStore.put(paramKey, cnt + 1);
            }

            // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
            String sb = parseStringToTimestamp(recordColumns[0]) + "," +
                    param.getParameterRawId() + "," +
                    healthData.getParamHealthRawId() + ',' +
                    paramValue + "," +
                    "256" + "," +
                    param.getUpperAlarmSpec() + "," +
                    param.getUpperWarningSpec() + "," +
                    "Unbalance";

            // fault classifications
            if (param.getParameterType().equalsIgnoreCase("Acceleration") ||
                    param.getParameterType().equalsIgnoreCase("Velocity") ||
                    param.getParameterType().equalsIgnoreCase("Enveloping")) {

                log.debug("[{}] - fault classification : ", paramKey);

            }

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

            // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
            String sb = parseStringToTimestamp(recordColumns[0]) + "," +
                    param.getParameterRawId() + "," +
                    healthData.getParamHealthRawId() + ',' +
                    paramValue + "," +
                    "128" + "," +
                    param.getUpperAlarmSpec() + "," +
                    param.getUpperWarningSpec() + "," +
                    "N/A";

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

    private void evaluateRule(String partitionKey, String paramKey, List<String> paramValues, Long ruleTime,
                              ParameterMasterDataSet paramMaster, ParameterHealthDataSet fd02HealthInfo) {

        ArrayList<Double> specOutValue = new ArrayList<>();
        List<Double> slidingWindow = new ArrayList<>(windowSize);

        if (existAlarm(paramKey)) {
            // alarm
            int totalAlarmCount = 0;
            for (int i = 0; i < paramValues.size(); i++) {
                String[] strValue = paramValues.get(i).split(",");
                //Long timeValue = Long.parseLong(strValue[0]);
                Double paramValue = Double.parseDouble(strValue[1]);

                if (slidingWindow.size() == windowSize) {
                    //check alarm
                    int alarmCount = 0;
                    for (Double dValue : slidingWindow) {
                        if ((paramMaster.getUpperAlarmSpec() != null && dValue >= paramMaster.getUpperAlarmSpec())
                                || (paramMaster.getLowerAlarmSpec() != null && dValue <= paramMaster.getLowerAlarmSpec())) {

                            alarmCount++;
                            specOutValue.add(dValue);
                        }
                    }

                    //log.debug("[{}] - window : {} ", paramKey, slidingWindow.toArray());

                    if (alarmCount > outCount) {
                        totalAlarmCount++;
                        slidingWindow.clear();
                    } else {
                        // remove last one
                        slidingWindow.remove(0);
                    }
                }
                // add new value
                slidingWindow.add(paramValue);
            }

            if (totalAlarmCount > 0) {
                // is alarm
                // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
                String sb = ruleTime + "," +
                        paramMaster.getParameterRawId() + "," +
                        fd02HealthInfo.getParamHealthRawId() + ',' +
                        totalAlarmCount + "," +
                        "256" + "," +
                        paramMaster.getUpperAlarmSpec() + "," +
                        paramMaster.getUpperWarningSpec() + "," +
                        "N/A";

                // fault classifications
                if (paramMaster.getParameterType().equalsIgnoreCase("Acceleration") ||
                        paramMaster.getParameterType().equalsIgnoreCase("Velocity") ||
                        paramMaster.getParameterType().equalsIgnoreCase("Enveloping")) {

                    log.debug("[{}] - fault classification : ", paramKey);

                }

                context().forward(partitionKey, sb.getBytes(), "output-fault");
                log.debug("[{}] - ALARM by Rule - detected {} cases.", paramKey, totalAlarmCount);

                // ==========================================================================================
                // Logic 2 health with alarm
                DescriptiveStatistics stats = new DescriptiveStatistics();
                for (Double val : specOutValue) {
                    stats.addValue(val);
                }

                Double index = (stats.getMean() / paramMaster.getUpperAlarmSpec());

                String statusCode = "N";

                if (totalAlarmCount >= 1) {
                    statusCode = "A";
                } else if (totalAlarmCount < 1) {
                    statusCode = "W";
                }

                String newMsg = ruleTime + ","
                        + paramMaster.getEquipmentRawId() + ","
                        + paramMaster.getParameterRawId() + ","
                        + fd02HealthInfo.getParamHealthRawId() + ','
                        + statusCode + ","
                        + totalAlarmCount + ","
                        + index; //+ "," + fd02HealthInfo.getHealthLogicRawId();

                context().forward(partitionKey, newMsg.getBytes(), "route-health");
                context().forward(partitionKey, newMsg.getBytes(), "output-health");

                log.debug("[{}] - logic 2 health with alarm : {}", paramKey, newMsg);
            } else {
                // ==========================================================================================
                // Logic 2 health without alarm - If no alarm goes off, calculate the average of the intervals.

                DescriptiveStatistics stats = new DescriptiveStatistics();

                for (int i = 0; i < paramValues.size(); i++) {
                    String[] strValue = paramValues.get(i).split(",");
                    Double paramValue = Double.parseDouble(strValue[1]);

                    stats.addValue(paramValue);
                }

                Double index = (stats.getMean() / paramMaster.getUpperAlarmSpec());

                String statusCode = "N";

                if (totalAlarmCount >= 1) {
                    statusCode = "A";
                } else if (totalAlarmCount < 1) {
                    statusCode = "W";
                }

                String newMsg = ruleTime + ","
                        + paramMaster.getEquipmentRawId() + ","
                        + paramMaster.getParameterRawId() + ","
                        + fd02HealthInfo.getParamHealthRawId() + ','
                        + statusCode + ","
                        + paramValues.size() + ","
                        + index; // + "," + fd02HealthInfo.getHealthLogicRawId();

                context().forward(partitionKey, newMsg.getBytes(), "route-health");
                context().forward(partitionKey, newMsg.getBytes(), "output-health");

                log.debug("[{}] - logic 2 health without alarm : {}", paramKey, newMsg);
            }

        } else if (existWarning(paramKey)) {
            // warning
            int totalWarningCount = 0;
            for (int i = 0; i < paramValues.size(); i++) {
                String[] strValue = paramValues.get(i).split(",");
                Double paramValue = Double.parseDouble(strValue[1]);

                if (slidingWindow.size() == windowSize) {
                    //check warning
                    int warningCount = 0;
                    for (Double dValue : slidingWindow) {
                        if ((paramMaster.getUpperWarningSpec() != null && dValue >= paramMaster.getUpperWarningSpec())
                                || (paramMaster.getLowerWarningSpec() != null && dValue <= paramMaster.getLowerWarningSpec())) {

                            warningCount++;
                            specOutValue.add(dValue);
                        }
                    }

                    if (warningCount > outCount) {
                        totalWarningCount++;
                        slidingWindow.clear();
                    } else {
                        // remove last one
                        slidingWindow.remove(0);
                    }
                }
                // add new value
                slidingWindow.add(paramValue);
            }

            if (totalWarningCount > 0) {
                // is alarm
                // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
                String sb = ruleTime + "," +
                        paramMaster.getParameterRawId() + "," +
                        fd02HealthInfo.getParamHealthRawId() + ',' +
                        totalWarningCount + "," +
                        "128" + "," +
                        paramMaster.getUpperAlarmSpec() + "," +
                        paramMaster.getUpperWarningSpec() + "," +
                        "N/A";

                // to do : fault classifications

                context().forward(partitionKey, sb.getBytes(), "output-fault");
                log.debug("[{}] - WARNING by Rule - detected {} cases.", paramKey, totalWarningCount);

                // to do : logic 2 for warning
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
