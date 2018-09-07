package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.speed.Function.ConditionSpecFunction;
import com.bistel.pdm.speed.Function.IndividualDetection;
import com.bistel.pdm.speed.Function.RuleBasedDetection;
import com.bistel.pdm.speed.Function.StatusDefineFunction;
import com.bistel.pdm.speed.model.StatusWindow;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
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
 * start point on speed.
 */
public class SpeedProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(SpeedProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    private final static String SEPARATOR = ",";

    private WindowStore<String, Double> kvNormalizedParamValueStore;

    private final StatusDefineFunction statusDefineFunction = new StatusDefineFunction();
    private IndividualDetection individualDetection = new IndividualDetection();
    private RuleBasedDetection ruleBasedDetection = new RuleBasedDetection();

    private final ConcurrentHashMap<String, StatusWindow> statusContextMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> messageGroupMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> intervalLongTime = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> conditionRuleMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> refreshCacheFlagMap = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvNormalizedParamValueStore = (WindowStore) context().getStateStore("speed-normalized-value");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR, -1);

        try {
            // refresh cache
            if (recordColumns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
                refreshCacheFlagMap.put(partitionKey, "Y");
                context().commit();
                log.debug("[{}-{}] - Refresh Order were issued.", partitionKey, context().partition());
                return;
            }

            // filter by master
            if (MasterCache.Equipment.get(partitionKey) == null) {
                log.debug("[{}-{}] - Not existed.", partitionKey, context().partition());
                context().commit();
                return;
            }

            Pair<EventMaster, EventMaster> eventInfo = MasterCache.IntervalEvent.get(partitionKey);
            if (eventInfo != null && eventInfo.getFirst() != null) {

                final Long msgLongTime = parseStringToTimestamp(recordColumns[0]);
                double statusValue = Double.parseDouble(recordColumns[eventInfo.getFirst().getParamParseIndex()]);
                String nowStatusCode = statusDefineFunction.evaluateStatusCode(eventInfo.getFirst(), statusValue);

                //log.debug("[{}] - value:{}, status:{}", partitionKey, statusValue, nowStatusCode);

                StatusWindow statusWindow;
                if (statusContextMap.get(partitionKey) == null) {
                    statusWindow = new StatusWindow();
                    statusWindow.addPrevious(nowStatusCode, msgLongTime);
                    statusWindow.addCurrent(nowStatusCode, msgLongTime);
                    statusContextMap.put(partitionKey, statusWindow);
                } else {
                    statusWindow = statusContextMap.get(partitionKey);
                    statusWindow.addCurrent(nowStatusCode, msgLongTime);
                }

                intervalLongTime.putIfAbsent(partitionKey, msgLongTime);
                messageGroupMap.putIfAbsent(partitionKey, msgLongTime.toString());

                if (statusWindow.getCurrentStatusCode().equalsIgnoreCase("R")
                        && statusWindow.getPreviousStatusCode().equalsIgnoreCase("I")) {
                    // process start (IR)

                    String msgGroup = msgLongTime.toString(); // define group id
                    messageGroupMap.put(partitionKey, msgGroup);

                    // event started. ------------------------------------------
                    String eventMsg =
                            statusWindow.getCurrentLongTime() + ","
                                    + eventInfo.getFirst().getEventRawId() + ","
                                    + eventInfo.getFirst().getEventTypeCD();

                    log.info("[{}-{}] - process started.", partitionKey, context().partition());
                    context().forward(partitionKey, eventMsg.getBytes(), "output-event");
                    context().commit();
                    // event started. ------------------------------------------

                    intervalLongTime.put(partitionKey, statusWindow.getCurrentLongTime());
                }

                if (statusWindow.getCurrentStatusCode().equalsIgnoreCase("R")) {
                    // running (RR)
                    String msgGroup = messageGroupMap.get(partitionKey);

                    // check conditional spec.
                    String ruleName = ConditionSpecFunction.evaluateCondition(partitionKey, recordColumns);
                    if (ruleName.length() > 0) {
                        conditionRuleMap.put(partitionKey, ruleName);

                        Long paramTime = statusWindow.getCurrentLongTime();

                        // time, P1, P2, P3, P4, ... Pn, {status, groupid, rulename}
                        String traceMsg = recordValue + ",R," + msgGroup + "," + ruleName;
                        context().forward(partitionKey, traceMsg.getBytes(), "output-trace");
                        context().commit();

                        List<ParameterWithSpecMaster> paramList = MasterCache.ParameterWithSpec.get(partitionKey);
                        // check OOS
                        for (ParameterWithSpecMaster paramInfo : paramList) {
                            if (paramInfo.getParamParseIndex() <= 0) continue;

                            if (ruleName.equalsIgnoreCase(paramInfo.getRuleName())) {
                                if (paramInfo.getUpperAlarmSpec() == null) continue;

                                String strValue = recordColumns[paramInfo.getParamParseIndex()];

                                if (strValue.length() > 0) {
                                    String paramKey = partitionKey + ":" + paramInfo.getParameterRawId();

                                    Double paramDblValue = Double.parseDouble(strValue);
                                    Long time = parseStringToTimestamp(recordColumns[0]);
                                    Double normalizedValue = paramDblValue / paramInfo.getUpperAlarmSpec();

                                    kvNormalizedParamValueStore.put(paramKey, normalizedValue, time);

                                    // fault detection
                                    String faultMsg = individualDetection.detect(partitionKey, paramKey, paramInfo,
                                            recordColumns[0], paramDblValue);

                                    if (faultMsg.length() > 0) {
                                        context().forward(partitionKey, faultMsg.getBytes(), "output-fault");
                                        context().commit();
                                        log.debug("[{}-{}] - individual fault occurred.", partitionKey, context().partition());
                                    }
                                } else {
                                    log.debug("[{}-{}] - index {} empty.",
                                            partitionKey, context().partition(), paramInfo.getParamParseIndex());
                                }
                            }
                        }


                        if (eventInfo.getFirst().getTimeIntervalYn().equalsIgnoreCase("Y")) {

                            Long startTime = intervalLongTime.get(partitionKey);
                            Long interval = startTime + eventInfo.getFirst().getIntervalTimeMs();

                            if (paramTime >= interval) {

                                // event ended. ------------------------------------------
                                String eventMsg =
                                        statusWindow.getPreviousLongTime() + ","
                                                + eventInfo.getSecond().getEventRawId() + ","
                                                + eventInfo.getSecond().getEventTypeCD();

                                log.info("[{}-{}] - process ended.", partitionKey, context().partition());
                                context().forward(partitionKey, eventMsg.getBytes(), "output-event");
                                context().commit();
                                // event ended. ------------------------------------------

                                // event started. ------------------------------------------
                                eventMsg =
                                        statusWindow.getCurrentLongTime() + ","
                                                + eventInfo.getFirst().getEventRawId() + ","
                                                + eventInfo.getFirst().getEventTypeCD();

                                log.info("[{}-{}] - process started.", partitionKey, context().partition());
                                context().forward(partitionKey, eventMsg.getBytes(), "output-event");
                                context().commit();
                                // event started. ------------------------------------------


                                // logic-2 -----------------------------------------------
                                Long endTime = statusWindow.getPreviousLongTime();

                                for (ParameterWithSpecMaster paramInfo : paramList) {
                                    if (paramInfo.getParamParseIndex() <= 0) continue;

                                    if (ruleName.equalsIgnoreCase(paramInfo.getRuleName())) {
                                        if (paramInfo.getUpperAlarmSpec() == null) continue;

                                        String paramKey = partitionKey + ":" + paramInfo.getParameterRawId();

                                        List<Double> normalizedValueList = new ArrayList<>();

                                        String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                                        String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(endTime));
                                        log.debug("[{}-{}] - fetch data from {} to {}.", partitionKey, context().partition(), sts, ets);

                                        WindowStoreIterator<Double> storeIterator = kvNormalizedParamValueStore.fetch(paramKey, startTime, endTime);
                                        while (storeIterator.hasNext()) {
                                            KeyValue<Long, Double> kv = storeIterator.next();
                                            normalizedValueList.add(kv.value);
                                        }
                                        storeIterator.close();

                                        boolean existAlarm = individualDetection.existAlarm(paramKey);
                                        boolean existWarning = individualDetection.existWarning(paramKey);

                                        // Logic 1 health
                                        String health1Msg = individualDetection.calculate(partitionKey, paramKey, paramInfo, endTime, normalizedValueList);

                                        if (health1Msg.length() > 0) {
                                            health1Msg = health1Msg + "," + msgGroup; // with group
                                            context().forward(partitionKey, health1Msg.getBytes(), "output-health");
                                            context().commit();
                                            log.debug("[{}-{}] - logic 1 health : {}", paramKey, context().partition(), health1Msg);
                                        }

                                        // Rule based detection
                                        ruleBasedDetection.detect(partitionKey, paramKey, endTime, paramInfo, normalizedValueList, existAlarm, existWarning);

                                        String faultMsg = ruleBasedDetection.getOutOfSpecMsg();
                                        if (faultMsg.length() > 0) {
                                            context().forward(partitionKey, faultMsg.getBytes(), "output-fault");
                                            context().commit();
                                            log.debug("[{}-{}] - rule fault occurred.", partitionKey, context().partition());
                                        }

                                        // Logic 2 health
                                        String health2Msg = ruleBasedDetection.getHealthMsg();
                                        if (health2Msg.length() > 0) {
                                            health2Msg = health2Msg + "," + msgGroup; // with group
                                            context().forward(partitionKey, health2Msg.getBytes(), "output-health");
                                            context().commit();
                                            log.debug("[{}-{}] - logic 2 health : {}", paramKey, context().partition(), health2Msg);
                                        }

                                        individualDetection.resetAlarmCount(paramKey);
                                        individualDetection.resetWarningCount(paramKey);
                                    }
                                }
                                // logic-2 -----------------------------------------------

                                intervalLongTime.put(partitionKey, paramTime);
                            }
                        }

                    } else {
                        // time, P1, P2, P3, P4, ... Pn, {status, groupid, rulename}
                        String traceMsg = recordValue + ",R," + msgGroup + "," + "NORULE"; // append rule name
                        context().forward(partitionKey, traceMsg.getBytes(), "output-trace");
                        context().commit();
                    }

                } else if (statusWindow.getCurrentStatusCode().equalsIgnoreCase("I")
                        && statusWindow.getPreviousStatusCode().equalsIgnoreCase("R")) {
                    // process end (RI)
                    String msgGroup = messageGroupMap.get(partitionKey);


                    // event ended. ------------------------------------------
                    String eventMsg =
                            statusWindow.getPreviousLongTime() + ","
                                    + eventInfo.getSecond().getEventRawId() + ","
                                    + eventInfo.getSecond().getEventTypeCD();

                    log.info("[{}-{}] - process ended.", partitionKey, context().partition());
                    context().forward(partitionKey, eventMsg.getBytes(), "output-event");
                    context().commit();
                    // event ended. ------------------------------------------

                    // logic-2 -----------------------------------------------
                    Long startTime = intervalLongTime.get(partitionKey);
                    Long endTime = statusWindow.getPreviousLongTime();

                    List<ParameterWithSpecMaster> paramList = MasterCache.ParameterWithSpec.get(partitionKey);
                    String ruleName = conditionRuleMap.get(partitionKey);
                    if (ruleName != null && ruleName.length() > 0) {

                        for (ParameterWithSpecMaster paramInfo : paramList) {
                            if (paramInfo.getParamParseIndex() <= 0) continue;

                            if (ruleName.equalsIgnoreCase(paramInfo.getRuleName())) {
                                if (paramInfo.getUpperAlarmSpec() == null) continue;

                                String paramKey = partitionKey + ":" + paramInfo.getParameterRawId();

                                List<Double> normalizedValueList = new ArrayList<>();

                                String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                                String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(endTime));
                                log.debug("[{}-{}] - fetch data from {} to {}.", partitionKey, context().partition(), sts, ets);

                                WindowStoreIterator<Double> storeIterator = kvNormalizedParamValueStore.fetch(paramKey, startTime, endTime);
                                while (storeIterator.hasNext()) {
                                    KeyValue<Long, Double> kv = storeIterator.next();
                                    normalizedValueList.add(kv.value);
                                }
                                storeIterator.close();

                                boolean existAlarm = individualDetection.existAlarm(paramKey);
                                boolean existWarning = individualDetection.existWarning(paramKey);

                                // Logic 1 health
                                String health1Msg = individualDetection.calculate(partitionKey, paramKey, paramInfo, endTime, normalizedValueList);

                                if (health1Msg.length() > 0) {
                                    health1Msg = health1Msg + "," + msgGroup; // with group
                                    context().forward(partitionKey, health1Msg.getBytes(), "output-health");
                                    context().commit();
                                    log.debug("[{}-{}] - logic 1 health : {}", paramKey, context().partition(), health1Msg);
                                }

                                // Rule based detection
                                ruleBasedDetection.detect(partitionKey, paramKey, endTime, paramInfo, normalizedValueList, existAlarm, existWarning);

                                String faultMsg = ruleBasedDetection.getOutOfSpecMsg();
                                if (faultMsg.length() > 0) {
                                    context().forward(partitionKey, faultMsg.getBytes(), "output-fault");
                                    context().commit();
                                    log.debug("[{}-{}] - rule fault occurred.", partitionKey, context().partition());
                                }

                                // Logic 2 health
                                String health2Msg = ruleBasedDetection.getHealthMsg();
                                if (health2Msg.length() > 0) {
                                    health2Msg = health2Msg + "," + msgGroup; // with group
                                    context().forward(partitionKey, health2Msg.getBytes(), "output-health");
                                    context().commit();
                                    log.debug("[{}-{}] - logic 2 health : {}", paramKey, context().partition(), health2Msg);
                                }

                                individualDetection.resetAlarmCount(paramKey);
                                individualDetection.resetWarningCount(paramKey);
                            }
                        }
                    }
                    // logic-2 -----------------------------------------------

                    // time, P1, P2, P3, P4, ... Pn, {status, groupid, rulename}
                    String traceMsg = recordValue + ",I,IDLE," + "NORULE";
                    context().forward(partitionKey, traceMsg.getBytes(), "output-trace");
                    context().commit();

                    // refresh cache
                    if (refreshCacheFlagMap.get(partitionKey) != null
                            && refreshCacheFlagMap.get(partitionKey).equalsIgnoreCase("Y")) {

                        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
                        String msg = dateFormat.format(timestamp) + ",CMD-REFRESH-CACHE";
                        context().forward(partitionKey, msg.getBytes(), "output-reload");
                        context().commit();

                        refreshMasterCache(partitionKey, context().partition());
                        refreshCacheFlagMap.put(partitionKey, "N");
                    }
                } else {
                    // idle (II)
                    // time, P1, P2, P3, P4, ... Pn, {status, groupid, rulename}
                    String traceMsg = recordValue + ",I,IDLE," + "NORULE";
                    context().forward(partitionKey, traceMsg.getBytes(), "output-trace");
                    context().commit();

                    // refresh cache
                    if (refreshCacheFlagMap.get(partitionKey) != null
                            && refreshCacheFlagMap.get(partitionKey).equalsIgnoreCase("Y")) {

                        refreshMasterCache(partitionKey, context().partition());
                        refreshCacheFlagMap.put(partitionKey, "N");

                        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
                        String msg = dateFormat.format(timestamp) + ",CMD-REFRESH-CACHE";
                        context().forward(partitionKey, msg.getBytes(), "output-reload");
                        context().commit();
                    }
                }

                statusWindow.addPrevious(nowStatusCode, msgLongTime);
                statusContextMap.put(partitionKey, statusWindow);

            } else {
                // refresh cache
                if (refreshCacheFlagMap.get(partitionKey) != null
                        && refreshCacheFlagMap.get(partitionKey).equalsIgnoreCase("Y")) {

                    refreshMasterCache(partitionKey, context().partition());
                    refreshCacheFlagMap.put(partitionKey, "N");

                    Timestamp timestamp = new Timestamp(System.currentTimeMillis());
                    String msg = dateFormat.format(timestamp) + ",CMD-REFRESH-CACHE";
                    context().forward(partitionKey, msg.getBytes(), "output-reload");
                    context().commit();
                }

                // time, P1, P2, P3, P4, ... Pn, {status, groupid, rulename}
                String traceMsg = recordValue + ",I,NOEVENT," + "NORULE";
                context().forward(partitionKey, traceMsg.getBytes(), "output-trace");
                context().commit();

                log.debug("[{}-{}] - No event registered.", partitionKey, context().partition());
            }
        } catch (Exception e) {
            log.debug("[{}-{}] - {}", partitionKey, context().partition(), recordValue);
            log.error(e.getMessage(), e);
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

    private void refreshMasterCache(String partitionKey, int partition) {
        // refresh master info.
        try {
            MasterCache.Equipment.refresh(partitionKey);
            MasterCache.IntervalEvent.refresh(partitionKey);
            MasterCache.Parameter.refresh(partitionKey);
            MasterCache.ParameterWithSpec.refresh(partitionKey);
            MasterCache.EquipmentCondition.refresh(partitionKey);
            MasterCache.ExprParameter.refresh(partitionKey);
            MasterCache.Health.refresh(partitionKey);
            MasterCache.Mail.refresh(partitionKey);

            log.debug("[{}-{}] - all cache refreshed.", partitionKey, partition);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
