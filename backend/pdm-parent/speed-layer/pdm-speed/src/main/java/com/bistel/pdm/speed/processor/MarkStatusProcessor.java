package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.json.EventMasterDataSet;
import com.bistel.pdm.lambda.kafka.expression.RuleEvaluator;
import com.bistel.pdm.lambda.kafka.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 */
public class MarkStatusProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(MarkStatusProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private KeyValueStore<String, String> kvStore;

    private final static String SEPARATOR = ",";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
        kvStore = (KeyValueStore) this.context().getStateStore("status-context");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);

        EventMasterDataSet event = MasterDataCache.getInstance().getEventForProcess(partitionKey);
        if (event == null) {
            log.info("[{}] - There are no registered events.", partitionKey);
            return;
        }

        double paramValue = Double.parseDouble(recordColumns[event.getParamParseIndex()]);
        log.debug("[{}] - event param:{}, value : {}, condition:{}", partitionKey,
                event.getParameterName(), paramValue, event.getCondition());

        RuleVariables ruleVariables = new RuleVariables();
        ruleVariables.putValue("value", paramValue);
        RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
        boolean isRun = ruleEvaluator.evaluate(event.getCondition());

        String statusCode;
        if (isRun) {
            statusCode = "R";
        } else {
            statusCode = "I";
        }

        //------
        Long msgTimeStamp = parseStringToTimestamp(recordColumns[0]);
        String statusCodeAndTime = statusCode + ":" + msgTimeStamp;
        String prevStatusAndTime;

        if (kvStore.get(partitionKey) == null) {
            kvStore.put(partitionKey, statusCodeAndTime);
            prevStatusAndTime = statusCodeAndTime;
        } else {
            prevStatusAndTime = kvStore.get(partitionKey);
        }

        log.debug("[{}] - ({}, {}) ", partitionKey, statusCodeAndTime, prevStatusAndTime);

        // add trace with status code
        // time, area, eqp, p1, p2, p3, p4, ... pn, status:time, prev:time
        recordValue = recordValue + "," + statusCodeAndTime + "," + prevStatusAndTime;
        context().forward(partitionKey, recordValue.getBytes());
        context().commit();

        kvStore.put(partitionKey, statusCodeAndTime);
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