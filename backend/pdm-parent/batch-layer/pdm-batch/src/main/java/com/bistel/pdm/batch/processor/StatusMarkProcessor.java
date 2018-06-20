package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.EventMasterDataSet;
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
public class StatusMarkProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(StatusMarkProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private KeyValueStore<String, String> kvStore;

    private final static String SEPARATOR = ",";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        // retrieve the key-value store named "processing-previous"
        kvStore = (KeyValueStore) this.context().getStateStore("processing-previous");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);

        EventMasterDataSet event = MasterDataCache.getInstance().getEventForProcess(partitionKey);
        float paramValue = Float.parseFloat(recordColumns[event.getParamParseIndex()]);
        Long actualParamTime = parseStringToTimestamp(recordColumns[0]);

        String statusCode;
        if (paramValue >= event.getConditionValue()) {
            statusCode = "R";
        } else {
            statusCode = "I";
        }

        // extract event
        if (kvStore.get(partitionKey) == null) {
            kvStore.put(partitionKey, statusCode + ":" + actualParamTime);
        } else {
            String prevStatus = kvStore.get(partitionKey);
            String[] prev = prevStatus.split(":");

            if (prev[0].equalsIgnoreCase("I") && !prev[0].equalsIgnoreCase(statusCode)) {
                String eventMessage = actualParamTime + "," + event.getEventRawId() + "," + event.getEventTypeCD();
                context().forward(partitionKey, eventMessage, "event");

            } else if (prev[0].equalsIgnoreCase("R") && !prev[0].equalsIgnoreCase(statusCode)) {
                String eventMessage = actualParamTime + "," + event.getEventRawId() + "," + event.getEventTypeCD();
                context().forward(partitionKey, eventMessage, "event");
            }

            kvStore.put(partitionKey, statusCode + ":" + actualParamTime);
        }

        // add trace with status code
        // time, area, eqp, p1, p2, p3, p4, ... pn, rsd01, rsd02, rsd03, rsd04, rsd05
        context().forward(partitionKey, streamByteRecord, "trace");

        // commit the current processing progress
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
