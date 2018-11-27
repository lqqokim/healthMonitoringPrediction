package com.bistel.pdm.speed.processor;

import com.bistel.pdm.data.stream.ConditionalSpecRuleMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.data.stream.ProcessGroupMaster;
import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.lang3.StringUtils;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.apache.kafka.streams.state.WindowStoreIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Processor for processing by message type
 */
public class ByMessageTypeProcessor extends AbstractProcessor<String, String> {
    private static final Logger log = LoggerFactory.getLogger(ByMessageTypeProcessor.class);
    private final static String SEPARATOR = ",";
    private final static String TIME_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";

    private KeyValueStore<String, String> kvProcessContextStore;
    private WindowStore<String, Double> kvNormalizedParamValueStore;

    private final static String NEXT_FAULT_STREAM_NODE = "FaultDetectionProcessor";
    private final static String NEXT_HEALTH_STREAM_NODE = "IndividualHealthProcessor";

    private final static String NEXT_OUT_TRACE_STREAM_NODE = "output-trace";
    private final static String NEXT_OUT_EVENT_STREAM_NODE = "output-event";

    private final ConcurrentHashMap<String, Boolean> cacheReloadFlagMap = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvProcessContextStore = (KeyValueStore) context().getStateStore("speed-process-context-store");
        kvNormalizedParamValueStore = (WindowStore) context().getStateStore("speed-normalized-value-store");
    }

    @Override
    public void process(String key, String record) {
        String[] columns = record.split(SEPARATOR, -1);

        try {
            if (columns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
                cacheReloadFlagMap.put(key, true);
                return;
            }


            String msgType = "";
            for (Header header : context().headers().toArray()) {
                if (header.key().equalsIgnoreCase("msgType")) {
                    msgType = new String(header.value());
                }
            }

            if (msgType.equalsIgnoreCase("E")) {
                //EVENT : time, event_id, event_name, event_flag(S/E), vid_1=value, vid_2=value, ..., vid_n=value

                String eventFlag = columns[3];
                log.debug("[{}] - {} {}-{} event occurred.", key, columns[0], columns[2], eventFlag);

                SimpleDateFormat dateFormat = new SimpleDateFormat(TIME_FORMAT);
                Long epochTime = dateFormat.parse(columns[0]).getTime();

                if (eventFlag.equalsIgnoreCase("E")) {
                    // event ended.
                    String value = kvProcessContextStore.get(key);
                    value += epochTime;
                    kvProcessContextStore.put(key, value); // event_flag, start_long_time, end_long_time

                    ProcessGroupMaster pgMaster = MasterCache.ProcessGroup.get(key);
                    //forward event
                    //process_group_rawid, event_id, start_event_name, end_event_name, start epoch, end epoch
                    String nextMsg = pgMaster.getId() + "," + columns[2] + "," + columns[2] + "," + value;
                    context().forward(key, nextMsg.getBytes(), To.child(NEXT_OUT_EVENT_STREAM_NODE));

                    // refresh cache by cmd.
                    if (cacheReloadFlagMap.get(key) != null & cacheReloadFlagMap.get(key)) {
                        refreshMasterCache(key);
                        cacheReloadFlagMap.put(key, false);
                    }
                } else {
                    // event started.
                    // event_flag, start_long_time, end_long_time
                    kvProcessContextStore.put(key, eventFlag + "," + epochTime + ",");
                }
            } else if (msgType.equalsIgnoreCase("T")) {
                //TRACE : time, vid_1=value, vid_2=value, vid_3=value, ..., vid_n=value

                if (kvProcessContextStore.get(key) != null) {
                    String context = kvProcessContextStore.get(key);
                    String[] eventState = context.split(",");

                    SimpleDateFormat dateFormat = new SimpleDateFormat(TIME_FORMAT);
                    Long epochTime = dateFormat.parse(columns[0]).getTime();

                    String conditionRuleName = evaluateCondition(key, columns);
                    List<ParameterWithSpecMaster> paramList = MasterCache.ParameterWithSpec.get(key);

                    if (eventState[0].equalsIgnoreCase("S")) {
                        // RUN

                        log.debug("[{}] - spec rule name:{}, offset:{}", key, conditionRuleName, context().offset());
                        if (conditionRuleName.length() > 0) {

                            // time, vid_1=value, vid_2=value, vid_3=value, ..., vid_n=value, {status, groupid, rulename}
                            String nextMessage = record + ",R," + eventState[1] + "," + conditionRuleName;
                            context().forward(key, nextMessage.getBytes(), To.child(NEXT_OUT_TRACE_STREAM_NODE));

                            // check OOS
                            for (ParameterWithSpecMaster paramInfo : paramList) {

                                if (conditionRuleName.equalsIgnoreCase(paramInfo.getRuleName())) {
                                    if (paramInfo.getUpperAlarmSpec() == null) continue;

                                    Double svidValue = getSvidValue(columns, paramInfo.getSvid());
                                    if(!svidValue.isNaN()){
                                        String paramKey = key + ":" + paramInfo.getParameterRawId();
                                        Double normalizedValue = svidValue / paramInfo.getUpperAlarmSpec();

                                        kvNormalizedParamValueStore.put(paramKey, normalizedValue, epochTime);

                                        // time, param_rawid, value, alarm_spec, warning_spec, fault_class, rulename, condition
                                        String nextMsg = epochTime + "," +
                                                paramInfo.getParameterRawId() + "," +
                                                svidValue + "," +
                                                paramInfo.getUpperAlarmSpec() + "," +
                                                paramInfo.getUpperWarningSpec() + "," +
                                                paramInfo.getParameterName() + "," +
                                                paramInfo.getRuleName() + "," +
                                                paramInfo.getCondition().replaceAll(",", ";");

                                        //forward fault detection
                                        context().forward(key, nextMsg, To.child(NEXT_FAULT_STREAM_NODE));
                                    }
                                }
                            }
                        } else {
                            // time, vid_1=value, vid_2=value, vid_3=value, ..., vid_n=value, {status, groupid, rulename}
                            String nextMessage = record + ",R," + eventState[1] + ",NORULE";
                            context().forward(key, nextMessage.getBytes(), To.child(NEXT_OUT_TRACE_STREAM_NODE));
                            log.info("[{}] - There is no rule information.", key);
                        }
                    } else if (eventState[0].equalsIgnoreCase("E")) {
                        // NOT RUN
                        Long startEpochTime = Long.parseLong(eventState[1]);
                        Long endEpochTime = Long.parseLong(eventState[2]);

                        log.info("[{}] - fetch data from {} to {}.", key, startEpochTime, endEpochTime);

                        for (ParameterWithSpecMaster paramInfo : paramList) {

                            if (conditionRuleName.equalsIgnoreCase(paramInfo.getRuleName())) {
                                if (paramInfo.getUpperAlarmSpec() == null) continue;

                                String paramKey = key + ":" + paramInfo.getParameterRawId();

                                List<Double> normalizedValueList = new ArrayList<>();
                                WindowStoreIterator<Double> storeIterator =
                                        kvNormalizedParamValueStore.fetch(paramKey, startEpochTime, endEpochTime);

                                while (storeIterator.hasNext()) {
                                    KeyValue<Long, Double> kv = storeIterator.next();
                                    if (!kv.value.isNaN()) {
                                        normalizedValueList.add(kv.value);
                                    }
                                }
                                storeIterator.close();

                                log.debug("[{}] - value size:{}", paramKey, normalizedValueList.size());

                                String normalizedString = StringUtils.join(normalizedValueList, '^');

                                //out : time, param_rawid, value, alarm_spec, warning_spec, fault_class,
                                //      rulename, condition, process context
                                String nextMsg = endEpochTime + "," +
                                        paramInfo.getParameterRawId() + "," +
                                        normalizedString + "," +
                                        paramInfo.getUpperAlarmSpec() + "," +
                                        paramInfo.getUpperWarningSpec() + "," +
                                        paramInfo.getParameterName() + "," +
                                        paramInfo.getRuleName() + "," +
                                        paramInfo.getCondition().replaceAll(",", ";") + "," +
                                        startEpochTime;

                                //forward health
                                context().forward(key, nextMsg, To.child(NEXT_HEALTH_STREAM_NODE));
                            }
                        }

                        kvProcessContextStore.put(key, "," + ",");
                    } else {
                        // IDLE
                        // time, vid_1=value, vid_2=value, vid_3=value, ..., vid_n=value, {status, groupid, rulename}
                        String nextMessage = record + ",I,-,-";
                        context().forward(key, nextMessage.getBytes(), To.child(NEXT_OUT_TRACE_STREAM_NODE));
                        log.info("[{}] - There is no rule information.", key);
                    }
                }
            } else if (msgType.equalsIgnoreCase("A")) {
                //ALARM : time, alarm_id, alarm_code, alarm_text
                //
            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private String evaluateCondition(String partitionKey, String[] record) {
        String conditionName = "";

        try {
            // rule name  : PUMP_RULE_1
            // expression : p1>=50.0 AND p2>1000.0
            // condition  : [{\"param_name\":\"ADP Speed\",\"operand\":\">=\",\"param_value\":50},{\"param_name\":\"Roots1 W\",\"operand\":\">\",\"param_value\":\"200\"}]
            RuleVariables ruleVariables = new RuleVariables();

            List<ConditionalSpecRuleMaster> eqpConditions = MasterCache.EquipmentSpecRule.get(partitionKey);

            for (ConditionalSpecRuleMaster cs : eqpConditions) {
                if (cs.getExpression() == null || cs.getExpression().length() <= 0) {
                    conditionName = "DEFAULT";
                    break;
                }

                Map<String, String> expr = MasterCache.SpecRuleExpression.get(partitionKey).get(cs.getRuleName());
                if (expr.size() > 0) {
                    String[] params = cs.getExpressionValue().split(",");
                    for (int i = 1; i <= params.length; i++) {
                        String svid = expr.get(params[i - 1]);

                        for (String col : record) {
                            String[] cols = col.split("=");

                            if (cols.length >= 2) {
                                if (cols[0].equalsIgnoreCase(svid)) {
                                    ruleVariables.putValue("p" + i, Double.parseDouble(cols[1]));
                                }
                            }
                        }
                    }

                    RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
                    if (ruleEvaluator.evaluate(cs.getExpression())) {
                        conditionName = cs.getRuleName();
                        break;
                    }
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return conditionName;
    }

    private Double getSvidValue(String[] columns, String svid){
        Double value = Double.NaN;

        for (String col : columns) {
            String[] cols = col.split("=");

            if (cols.length >= 2) {
                if (cols[0].equalsIgnoreCase(svid)) {
                    if(cols[1].length() > 0){
                        value = Double.parseDouble(cols[1]);
                    }
                    break;
                }
            }
        }

        return value;
    }

    private void refreshMasterCache(String key) {
        // refresh master info.
        try {
            MasterCache.Equipment.refresh(key);
            MasterCache.Parameter.refresh(key);
            MasterCache.ParameterWithSpec.refresh(key);
            MasterCache.EquipmentSpecRule.refresh(key);
            MasterCache.SpecRuleExpression.refresh(key);
            MasterCache.Health.refresh(key);
            MasterCache.ProcessGroup.refresh(key);

            log.debug("[{}] - all cache refreshed.", key);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
