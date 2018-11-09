package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.concurrent.ConcurrentHashMap;

public class StatusDecisionProcessor extends AbstractProcessor<String, String> {
    private static final Logger log = LoggerFactory.getLogger(StatusDecisionProcessor.class);
    private final static String SEPARATOR = ",";
    private final static String NEXT_STREAM_NODE = "EventProcessor";

    private final ConcurrentHashMap<String, Boolean> cacheReloadFlagMap = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String key, String record) {
        String[] columns = record.split(SEPARATOR, -1);

        String nowStatusCode = "I";

        try {
            cacheReloadFlagMap.putIfAbsent(key, false);

            if (columns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
                cacheReloadFlagMap.put(key, true);
                return;
            }

            Pair<EventMaster, EventMaster> eventInfo = MasterCache.IntervalEvent.get(key);
            if (eventInfo != null && eventInfo.getFirst() != null
                    && eventInfo.getFirst().getParamParseIndex() != null) {

                String strValue = columns[eventInfo.getFirst().getParamParseIndex()];
                if (strValue.length() > 0) {
                    double statusValue = Double.parseDouble(strValue);
                    nowStatusCode = evaluateStatusCode(eventInfo.getFirst(), statusValue);
                }
            } else {
                log.info("[{}] - Unknown event.", key);
            }

            // when status is idle, refresh.
            if (nowStatusCode.equalsIgnoreCase("I") && cacheReloadFlagMap.get(key)) {
                refreshMasterCache(key);
                cacheReloadFlagMap.put(key, false);

                Timestamp timestamp = new Timestamp(System.currentTimeMillis());
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                String msg = dateFormat.format(timestamp) + ",CMD-REFRESH-CACHE";
                context().forward(key, msg.getBytes(), To.child("output-reload"));
            }

            // time, P1, P2, P3, P4, ... Pn, +status
            String nextMessage = record + "," + nowStatusCode;
            context().forward(key, nextMessage, To.child(NEXT_STREAM_NODE));

            log.debug("[{}] - status:{}, offset:{}", key, nowStatusCode, context().offset());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private String evaluateStatusCode(EventMaster eventInfo, double paramValue) {
        String nowStatusCode = "I";

        RuleVariables ruleVariables = new RuleVariables();
        ruleVariables.putValue("value", paramValue);
        RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
        boolean isRun = ruleEvaluator.evaluate(eventInfo.getCondition());

        if (isRun) {
            nowStatusCode = "R";
        }
        return nowStatusCode;
    }

    private void refreshMasterCache(String partitionKey) {
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

            log.debug("[{}] - all cache refreshed.", partitionKey);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
