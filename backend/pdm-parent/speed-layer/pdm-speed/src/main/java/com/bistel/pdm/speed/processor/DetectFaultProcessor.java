package com.bistel.pdm.speed.processor;

import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.speed.Function.ConditionSpecFunction;
import com.bistel.pdm.speed.Function.IndividualDetection;
import com.bistel.pdm.speed.Function.RuleBasedDetection;
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
import java.util.concurrent.ConcurrentHashMap;

/**
 * fault detection
 */
public class DetectFaultProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectFaultProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, Long> kvTimeInIntervalStore;
    private WindowStore<String, Double> kvNormalizedParamValueStore;

    private final ConcurrentHashMap<String, String> conditionMap = new ConcurrentHashMap<>();

    private IndividualDetection individualDetection = new IndividualDetection();
    private RuleBasedDetection ruleBasedDetection = new RuleBasedDetection();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvTimeInIntervalStore = (KeyValueStore) context().getStateStore("speed-process-interval");
        kvNormalizedParamValueStore = (WindowStore) context().getStateStore("speed-normalized-value");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // time, P1, P2, P3, P4, ... Pn, now status:time, prev status:time, refresh flag
        String[] recordColumns = recordValue.split(SEPARATOR, -1);

        try {
            List<ParameterWithSpecMaster> paramList = MasterCache.ParameterWithSpec.get(partitionKey);
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

                // check conditional spec.
                String conditionName = ConditionSpecFunction.evaluateCondition(partitionKey, recordColumns);

                if (conditionName.length() > 0) {
                    conditionMap.put(partitionKey, conditionName);

                    // check OOS
                    for (ParameterWithSpecMaster paramInfo : paramList) {
                        if (paramInfo.getParamParseIndex() <= 0) continue;

                        if (conditionName.equalsIgnoreCase(paramInfo.getConditionName())) {
                            if(paramInfo.getUpperAlarmSpec() == null) continue;

                            Double paramValue = Double.parseDouble(recordColumns[paramInfo.getParamParseIndex()]);
                            String paramKey = partitionKey + ":" + paramInfo.getParameterRawId();
                            Long time = parseStringToTimestamp(recordColumns[0]);
                            Double healthIndex = paramValue/paramInfo.getUpperAlarmSpec();

                            kvNormalizedParamValueStore.put(paramKey, healthIndex, time);

                            // fault detection
                            String msg = individualDetection.detect(partitionKey, paramKey, paramInfo,
                                    recordColumns[0], paramValue);

                            if (msg.length() > 0) {
                                context().forward(partitionKey, msg.getBytes(), "output-fault");
                                log.debug("[{}] - IND FAULT:{}", partitionKey, msg);
                            }
                        }
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

                String conditionName = conditionMap.get(partitionKey);
                if(conditionName != null && conditionName.length() > 0) {

                    for (ParameterWithSpecMaster paramInfo : paramList) {
                        if (paramInfo.getParamParseIndex() <= 0) continue;

                        if (conditionName.equalsIgnoreCase(paramInfo.getConditionName())) {
                            if(paramInfo.getUpperAlarmSpec() == null) continue;

                            String paramKey = partitionKey + ":" + paramInfo.getParameterRawId();

                            List<Double> normalizedValueList = new ArrayList<>();
                            WindowStoreIterator<Double> storeIterator = kvNormalizedParamValueStore.fetch(paramKey, startTime, endTime);
                            while (storeIterator.hasNext()) {
                                KeyValue<Long, Double> kv = storeIterator.next();
                                normalizedValueList.add(kv.value);
                            }
                            storeIterator.close();

                            boolean existAlarm = individualDetection.existAlarm(paramKey);
                            boolean existWarning = individualDetection.existWarning(paramKey);

                            // Logic 1 health
                            String msgIndHealth = individualDetection.calculate(partitionKey, paramKey, paramInfo, endTime, normalizedValueList);

                            if (msgIndHealth.length() > 0) {
                                context().forward(partitionKey, msgIndHealth.getBytes());
                                log.debug("[{}] - logic 1 health : {}", paramKey, msgIndHealth);
                            }


                            // Rule based detection
                            ruleBasedDetection.detect(partitionKey, paramKey, endTime, paramInfo, normalizedValueList, existAlarm, existWarning);

                            String msgRuleAlarm = ruleBasedDetection.getOutOfSpecMsg();
                            if (msgRuleAlarm.length() > 0) {
                                context().forward(partitionKey, msgRuleAlarm.getBytes(), "output-fault");
                                log.debug("[{}] - RULE FAULT:{}", partitionKey, msgRuleAlarm);
                            }

                            // Logic 2 health
                            String msgRuleHealth = ruleBasedDetection.getHealthMsg();
                            if (msgRuleHealth.length() > 0) {
                                context().forward(partitionKey, msgRuleHealth.getBytes(), "output-health");
                                log.debug("[{}] - logic 2 health : {}", paramKey, msgRuleHealth);
                            }

                            individualDetection.resetAlarmCount(paramKey);
                            individualDetection.resetWarningCount(paramKey);
                        }
                    }
                }

                String flag = recordColumns[recordColumns.length - 1];
                if (flag.equalsIgnoreCase("CRC")) {
                    String msg = endTime + "," + "CRC";
                    context().forward(partitionKey, msg.getBytes(), "refresh");
                    log.debug("[{}] - cache refreshed.", partitionKey);
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            context().commit();
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
