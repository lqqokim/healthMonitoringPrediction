package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.speed.Function.OutOfSpecFunction;
import com.bistel.pdm.speed.Function.SPCRuleFunction;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.apache.kafka.streams.state.WindowStoreIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

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
    private KeyValueStore<String, Long> kvTimeInIntervalStore;
    private KeyValueStore<String, Integer> kvAlarmCountStore;
    private KeyValueStore<String, Integer> kvWarningCountStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvParamValueStore = (WindowStore) context().getStateStore("speed-param-value");
        kvTimeInIntervalStore = (KeyValueStore) context().getStateStore("speed-process-interval");
        kvAlarmCountStore = (KeyValueStore) context().getStateStore("speed-alarm-count");
        kvWarningCountStore = (KeyValueStore) context().getStateStore("speed-warning-count");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // time, P1, P2, P3, P4, ... Pn, now status:time, prev status:time, refresh flag
        String[] recordColumns = recordValue.split(SEPARATOR, -1);

        try {
            List<ParameterMasterDataSet> paramList = MasterCache.Parameter.get(partitionKey);
            if (paramList == null) return;

            String statusCodeAndTime = recordColumns[recordColumns.length - 3];
            String[] nowStatusCodeAndTime = statusCodeAndTime.split(":");

            String prevStatusAndTime = recordColumns[recordColumns.length - 2];
            String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");

            if (kvTimeInIntervalStore.get(partitionKey) == null) {
                kvTimeInIntervalStore.put(partitionKey, Long.parseLong(nowStatusCodeAndTime[1]));
            }

            // idle -> run
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("I")
                    && nowStatusCodeAndTime[0].equalsIgnoreCase("R")) {

                kvTimeInIntervalStore.put(partitionKey, Long.parseLong(nowStatusCodeAndTime[1]));
            }

            // processing
            if (nowStatusCodeAndTime[0].equalsIgnoreCase("R")) {
                // check OOS
                for (ParameterMasterDataSet paramInfo : paramList) {
                    if (paramInfo.getParamParseIndex() <= 0) continue;

                    Double paramValue = Double.parseDouble(recordColumns[paramInfo.getParamParseIndex()]);
                    String paramKey = partitionKey + ":" + paramInfo.getParameterRawId();
                    Long time = parseStringToTimestamp(recordColumns[0]);
                    kvParamValueStore.put(paramKey, time + "," + paramValue, time);

                    ParameterHealthDataSet fd01Health = getParamHealth(paramInfo.getParameterRawId(), "FD_OOS");
                    if (fd01Health != null && fd01Health.getApplyLogicYN().equalsIgnoreCase("Y")) {

                        if (OutOfSpecFunction.evaluateAlarm(paramInfo, paramValue)) {
                            // Alarm
                            if (kvAlarmCountStore.get(paramKey) == null) {
                                kvAlarmCountStore.put(paramKey, 1);
                            } else {
                                int cnt = kvAlarmCountStore.get(paramKey);
                                kvAlarmCountStore.put(paramKey, cnt + 1);
                            }

                            String msg = OutOfSpecFunction.makeOutOfAlarmMsg(recordColumns[0], paramInfo, fd01Health, paramValue);
                            context().forward(partitionKey, msg.getBytes(), "output-fault");

                            log.debug("[{}] - alarm spec : {}, value : {}", paramKey, paramInfo.getUpperAlarmSpec(), paramValue);


                        } else if (OutOfSpecFunction.evaluateWarning(paramInfo, paramValue)) {
                            //warning
                            if (kvWarningCountStore.get(paramKey) == null) {
                                kvWarningCountStore.put(paramKey, 1);
                            } else {
                                int cnt = kvWarningCountStore.get(paramKey);
                                kvWarningCountStore.put(paramKey, cnt + 1);
                            }

                            String msg = OutOfSpecFunction.makeOutOfWarningMsg(recordColumns[0], paramInfo, fd01Health, paramValue);
                            context().forward(partitionKey, msg.getBytes(), "output-fault");

                            log.debug("[{}] - warning spec : {}, value : {}", paramKey, paramInfo.getUpperWarningSpec(), paramValue);

                        }
                    } else {
                        //log.debug("[{}] - No health because skip the logic 1.", paramKey);
                    }
                }
            }

            // run -> idle
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                    && nowStatusCodeAndTime[0].equalsIgnoreCase("I")) {

                Long startTime = kvTimeInIntervalStore.get(partitionKey);
                Long endTime = Long.parseLong(prevStatusCodeAndTime[1]);

//                String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
//                String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(endTime));
//                log.debug("[{}] - processing interval from {} to {}.", partitionKey, sts, ets);

                for (ParameterMasterDataSet paramInfo : paramList) {
                    if (paramInfo.getParamParseIndex() <= 0) continue;

                    String paramKey = partitionKey + ":" + paramInfo.getParameterRawId();

                    ParameterHealthDataSet fd02Health = getParamHealth(paramInfo.getParameterRawId(), "FD_RULE_1");
                    if (fd02Health != null && fd02Health.getApplyLogicYN().equalsIgnoreCase("Y")
                            && paramInfo.getUpperAlarmSpec() != null) {

                        for (Pair<String, Integer> option : getParamHealthFD02Options(paramInfo.getParameterRawId())) {

                            if (option != null) {
                                if (option.getFirst().equalsIgnoreCase("M")) {
                                    this.windowSize = option.getSecond();
                                } else {
                                    this.outCount = option.getSecond();
                                }
                            } else {
                                log.debug("[{}] - option does not exist.", paramKey);
                            }
                        }

                        List<Double> doubleValueList = new ArrayList<>();
                        WindowStoreIterator<String> storeIterator = kvParamValueStore.fetch(paramKey, startTime, endTime);
                        while (storeIterator.hasNext()) {
                            KeyValue<Long, String> kv = storeIterator.next();
                            String[] strValue = kv.value.split(",");
                            Double paramValue = Double.parseDouble(strValue[1]);
                            doubleValueList.add(paramValue);
                        }
                        storeIterator.close();


                        if (existAlarm(paramKey)) {

                            List<Double> outValues = SPCRuleFunction.evaluateAlarm(paramInfo, doubleValueList, windowSize, outCount);
                            if (outValues.size() > 0) {
                                String msgRuleAlarm = SPCRuleFunction.makeOutOfRuleMsg(endTime, paramInfo, fd02Health, outValues.size(), "256");

                                context().forward(partitionKey, msgRuleAlarm.getBytes(), "output-fault");
                                log.debug("[{}] - Rule based alarm detection : {}", paramKey, outValues.size());

                                // Logic 2 health with alarm
                                Double healthScore = SPCRuleFunction.calcuateHealth(paramInfo, outValues);

                                String msgHealth = SPCRuleFunction.makeHealthMsg(endTime, "A", paramInfo, fd02Health, healthScore, outValues.size());

                                context().forward(partitionKey, msgHealth.getBytes(), "route-health");
                                context().forward(partitionKey, msgHealth.getBytes(), "output-health");

                                log.debug("[{}] - calculate the logic-2 health with alarm : {}", paramKey, msgHealth);
                            }

                        } else if (existWarning(paramKey)) {

                            List<Double> outValues = SPCRuleFunction.evaluateWarning(paramInfo, doubleValueList, windowSize, outCount);
                            if (outValues.size() > 0) {
                                String msgRuleAlarm = SPCRuleFunction.makeOutOfRuleMsg(endTime, paramInfo, fd02Health, outValues.size(), "128");

                                context().forward(partitionKey, msgRuleAlarm.getBytes(), "output-fault");
                                log.debug("[{}] - Rule based warning detection : {}", paramKey, outValues.size());

                                // to do : calculate health for warning.

                            }

                        } else {
                            // Logic 2 health without alarm, warning - If no alarm goes off, calculate the average of the intervals.
                            Double healthScore = SPCRuleFunction.calcuateHealth(paramInfo, doubleValueList);

                            String msg = SPCRuleFunction.makeHealthMsg(endTime, "N", paramInfo, fd02Health, healthScore, doubleValueList.size());

                            context().forward(partitionKey, msg.getBytes(), "route-health");
                            context().forward(partitionKey, msg.getBytes(), "output-health");

                            log.debug("[{}] - calculate the logic-2 health without alarm : {}", paramKey, msg);
                        }
                    } else {
                        //log.debug("[{}] - No health or Spec because skip the logic 2.", paramKey);
                    }
                }

                String flag = recordColumns[recordColumns.length - 1];
                if(flag.equalsIgnoreCase("CRC")){
                    String msg = endTime + "," + "CRC";
                    context().forward(partitionKey, msg.getBytes(), "refresh");
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

    private ParameterHealthDataSet getParamHealth(Long key, String code) throws ExecutionException {
        ParameterHealthDataSet healthData = null;

        for (ParameterHealthDataSet health : MasterCache.Health.get(key)) {
            if (health.getHealthCode().equalsIgnoreCase(code)) {
                healthData = health;
                break;
            }
        }

        return healthData;
    }

    public List<Pair<String, Integer>> getParamHealthFD02Options(Long key) throws ExecutionException {
        List<Pair<String, Integer>> optionList = new ArrayList<>();

        for (ParameterHealthDataSet health : MasterCache.Health.get(key)) {
            if (health.getHealthCode().equalsIgnoreCase("FD_RULE_1")) {
                optionList.add(new Pair<>(health.getOptionName(), health.getOptionValue()));
            }
        }

        return optionList;
    }
}
