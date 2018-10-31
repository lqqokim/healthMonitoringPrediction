package com.bistel.pdm.speed.processor;

import com.bistel.pdm.data.stream.ConditionalSpecMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.lang3.StringUtils;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
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
import java.util.Map;

public class BranchProcessor extends AbstractProcessor<String, String> {
    private static final Logger log = LoggerFactory.getLogger(BranchProcessor.class);
    private final static String SEPARATOR = ",";

    private final static String NEXT_FAULT_STREAM_NODE = "FaultDetectionProcessor";
    private final static String NEXT_HEALTH_STREAM_NODE = "IndividualHealthProcessor";
    private final static String NEXT_OUT_STREAM_NODE = "output-trace";

    private WindowStore<String, Double> kvNormalizedParamValueStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvNormalizedParamValueStore = (WindowStore) context().getStateStore("speed-normalized-value-store");
    }

    @Override
    public void process(String key, String record) {
        String[] columns = record.split(SEPARATOR, -1);

        try {
            List<ParameterWithSpecMaster> paramList = MasterCache.ParameterWithSpec.get(key);
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

            String conditionRuleName = evaluateCondition(key, columns);

            if(columns[0].equalsIgnoreCase("END")){

                log.debug("[{}] - fetch data from {} to {}.", key, columns[1], columns[2]);

                Date startDate = dateFormat.parse(columns[1]);
                Long startEpochTime = new Timestamp(startDate.getTime()).getTime();

                Date endDate = dateFormat.parse(columns[2]);
                Long endEpochTime = new Timestamp(endDate.getTime()).getTime();

                for (ParameterWithSpecMaster paramInfo : paramList) {
                    if (paramInfo.getParamParseIndex() <= 0) continue;

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

                        String normalizedString = StringUtils.join(normalizedValueList, '^');

                        // time, param_rawid, value, alarm_spec, warning_spec, fault_class, rulename, condition
                        String nextMsg = endEpochTime + "," +
                                paramInfo.getParameterRawId() + "," +
                                normalizedString + "," +
                                paramInfo.getUpperAlarmSpec() + "," +
                                paramInfo.getUpperWarningSpec() + "," +
                                paramInfo.getParameterName() + "," +
                                paramInfo.getRuleName() + "," +
                                paramInfo.getCondition().replaceAll(",", ";");

                        //farward health
                        context().forward(key, nextMsg, To.child(NEXT_HEALTH_STREAM_NODE));

                    }
                }

            } else {

                if (conditionRuleName.length() > 0) {
                    // time, P1, P2, P3, P4, ... Pn,status,groupid, +rulename
                    String nextMessage = record + "," + conditionRuleName;
                    context().forward(key, nextMessage.getBytes(), To.child(NEXT_OUT_STREAM_NODE));

                    Date parsedDate = dateFormat.parse(columns[0]);
                    Timestamp nowTimestamp = new Timestamp(parsedDate.getTime());
                    Long nowEpochTime = nowTimestamp.getTime();


                    // check OOS
                    for (ParameterWithSpecMaster paramInfo : paramList) {
                        if (paramInfo.getParamParseIndex() <= 0) continue;

                        if (conditionRuleName.equalsIgnoreCase(paramInfo.getRuleName())) {
                            if (paramInfo.getUpperAlarmSpec() == null) continue;

                            String strParamValue = columns[paramInfo.getParamParseIndex()];

                            if (strParamValue.length() > 0) {
                                String paramKey = key + ":" + paramInfo.getParameterRawId();

                                Double paramValue = Double.parseDouble(strParamValue);
                                Double normalizedValue = paramValue / paramInfo.getUpperAlarmSpec();

                                log.debug("[{}] - put value : {}", key, normalizedValue);
                                kvNormalizedParamValueStore.put(paramKey, normalizedValue, nowEpochTime);

                                // time, param_rawid, value, alarm_spec, warning_spec, fault_class, rulename, condition
                                String nextMsg = nowEpochTime + "," +
                                        paramInfo.getParameterRawId() + "," +
                                        paramValue + "," +
                                        paramInfo.getUpperAlarmSpec() + "," +
                                        paramInfo.getUpperWarningSpec() + "," +
                                        paramInfo.getParameterName() + "," +
                                        paramInfo.getRuleName() + "," +
                                        paramInfo.getCondition().replaceAll(",", ";");

                                //farward fault detection
                                context().forward(key, nextMsg, To.child(NEXT_FAULT_STREAM_NODE));
                            }
                        }
                    }
                } else {
                    // time, P1, P2, P3, P4, ... Pn,status,groupid,rulename
                    String nextMessage = record + "," + "NORULE"; // append rule name
                    context().forward(key, nextMessage.getBytes(), To.child(NEXT_OUT_STREAM_NODE));
                }
            }
        } catch(Exception e){
            log.error(e.getMessage(), e);
        }
    }

    private String evaluateCondition(String partitionKey, String[] record) {
        String conditionName = "";

        try {
            RuleVariables ruleVariables = new RuleVariables();

            List<ConditionalSpecMaster> eqpConditions = MasterCache.EquipmentCondition.get(partitionKey);

            for (ConditionalSpecMaster cs : eqpConditions) {
                if (cs.getExpression() == null || cs.getExpression().length() <= 0) {
                    conditionName = "DEFAULT";
                    break;
                }

                Map<String, Integer> expr = MasterCache.ExprParameter.get(partitionKey).get(cs.getRuleName());
                if(expr.size() > 0) {
                    String[] params = cs.getExpressionValue().split(",");
                    for (int i = 1; i <= params.length; i++) {
                        Integer index = expr.get(params[i - 1]);
                        ruleVariables.putValue("p" + i, Double.parseDouble(record[index]));
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
}
