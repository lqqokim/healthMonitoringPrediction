package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.EventMasterDataSet;
import com.bistel.pdm.lambda.kafka.expression.RuleEvaluator;
import com.bistel.pdm.lambda.kafka.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 */
public class StatusMarkProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(StatusMarkProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final static String SEPARATOR = ",";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);

        EventMasterDataSet event = MasterDataCache.getInstance().getEventForProcess(partitionKey);
        if(event == null){
            log.info("There are no registered events.");
            return;
        }

        double paramValue = Double.parseDouble(recordColumns[event.getParamParseIndex()]);
        log.debug("event param:{}, value : {}, condition:{}", event.getParameterName(), paramValue, event.getCondition());

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

        Long actualParamTime = parseStringToTimestamp(recordColumns[0]);
        log.debug(" {} - {} ", partitionKey, statusCode);

        // add trace with status code
        // time, area, eqp, p1, p2, p3, p4, ... pn,curr_status:time
        recordValue = recordValue + "," + statusCode + ":" + actualParamTime;
        context().forward(partitionKey, recordValue.getBytes());
        context().commit();
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
