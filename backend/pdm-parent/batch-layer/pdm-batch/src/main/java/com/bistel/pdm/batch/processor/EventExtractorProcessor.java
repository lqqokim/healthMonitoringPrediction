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
public class EventExtractorProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(EventExtractorProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private KeyValueStore<String, String> kvStore;

    private final static String SEPARATOR = ",";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvStore = (KeyValueStore) this.context().getStateStore("sustain-previous");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);

        EventMasterDataSet event = MasterDataCache.getInstance().getEventForProcess(partitionKey);

        String nowMsgStatusCodeAndTime = recordColumns[recordColumns.length - 1];
        String[] nowStatusCodeAndTime = nowMsgStatusCodeAndTime.split(":");
        String prevStatusAndTime = ":";

        // extract event
        if (kvStore.get(partitionKey) == null) {
            kvStore.put(partitionKey, nowMsgStatusCodeAndTime);

        } else {
            prevStatusAndTime = kvStore.get(partitionKey);
            String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");

            if (prevStatusCodeAndTime[0].equalsIgnoreCase("I")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                Long actualParamTime = parseStringToTimestamp(nowStatusCodeAndTime[1]);
                String eventMessage = actualParamTime + "," + event.getEventRawId() + "," + event.getEventTypeCD();

                log.debug("Throw the start event!!! {}", partitionKey);
                context().forward(partitionKey, eventMessage, "event");

            } else if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                Long actualParamTime = parseStringToTimestamp(prevStatusCodeAndTime[1]);
                String eventMessage = actualParamTime + "," + event.getEventRawId() + "," + event.getEventTypeCD();

                log.debug("Throw the end event!!! {}", partitionKey);
                context().forward(partitionKey, eventMessage, "event");
            }
            kvStore.put(partitionKey, nowMsgStatusCodeAndTime);
        }

        // time, area, eqp, p1, p2, p3, p4, ... pn,curr_status:time,prev_status:time
        String newMsg = recordValue + "," + prevStatusAndTime;
        context().forward(partitionKey, newMsg, "aggregator");

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
