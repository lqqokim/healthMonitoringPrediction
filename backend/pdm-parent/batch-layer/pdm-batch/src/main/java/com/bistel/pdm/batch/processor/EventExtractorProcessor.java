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

        String nowMsgStatusCodeAndTime = recordColumns[recordColumns.length - 1];
        String[] nowStatusCodeAndTime = nowMsgStatusCodeAndTime.split(":");
        String prevStatusAndTime = ":";

        // extract event
        if (kvStore.get(partitionKey) == null) {
            kvStore.put(partitionKey, nowMsgStatusCodeAndTime);
            prevStatusAndTime = nowMsgStatusCodeAndTime;
        } else {
            prevStatusAndTime = kvStore.get(partitionKey);
            String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");

            if (prevStatusCodeAndTime[0].equalsIgnoreCase("I")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                EventMasterDataSet event = MasterDataCache.getInstance().getEventByType(partitionKey, "S");
                String eventMessage = nowStatusCodeAndTime[1] + ","
                        + event.getEventRawId() + "," + event.getEventTypeCD();

                log.debug("[{}] - process started.", partitionKey);
                context().forward(partitionKey, eventMessage.getBytes(), "event");
                context().commit();

            } else if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                EventMasterDataSet event = MasterDataCache.getInstance().getEventByType(partitionKey, "E");
                String eventMessage = prevStatusCodeAndTime[1] + ","
                        + event.getEventRawId() + "," + event.getEventTypeCD();

                log.debug("[{}] - process ended.", partitionKey);
                context().forward(partitionKey, eventMessage.getBytes(), "event");
                context().commit();
            }
            kvStore.put(partitionKey, nowMsgStatusCodeAndTime);
        }

        // time, area, eqp, p1, p2, p3, p4, ... pn,curr_status:time,prev_status:time
        String newMsg = recordValue + "," + prevStatusAndTime;
        context().forward(partitionKey, newMsg.getBytes(), "aggregator");
        context().commit();
    }
}
