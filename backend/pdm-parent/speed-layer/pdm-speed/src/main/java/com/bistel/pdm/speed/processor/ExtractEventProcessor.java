package com.bistel.pdm.speed.processor;

import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ExecutionException;

/**
 *
 */
public class ExtractEventProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(ExtractEventProcessor.class);

    private final static String SEPARATOR = ",";

    @Override
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // time, P1, P2, P3, P4, ... Pn, now status:time, prev status:time, refresh flag
        String[] recordColumns = recordValue.split(SEPARATOR, -1);

        try {
            String statusCodeAndTime = recordColumns[recordColumns.length - 3];
            String[] nowStatusCodeAndTime = statusCodeAndTime.split(":");

            String prevStatusAndTime = recordColumns[recordColumns.length - 2];
            String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");

            // extract event
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("I")
                    && nowStatusCodeAndTime[0].equalsIgnoreCase("R")) {

                // event started.
                EventMaster event = getEvent(partitionKey, "S");
                String eventMessage =
                        nowStatusCodeAndTime[1] + ","
                                + event.getEventRawId() + ","
                                + event.getEventTypeCD();

                log.info("[{}] - process started.", partitionKey);
                context().forward(partitionKey, eventMessage.getBytes());
                context().commit();

            } else if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                    && nowStatusCodeAndTime[0].equalsIgnoreCase("I")) {

                // event ended.
                EventMaster event = getEvent(partitionKey, "E");
                String eventMessage =
                        prevStatusCodeAndTime[1] + ","
                                + event.getEventRawId() + ","
                                + event.getEventTypeCD();

                log.info("[{}] - process ended.", partitionKey);
                context().forward(partitionKey, eventMessage.getBytes());
                context().commit();
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private EventMaster getEvent(String key, String type) throws ExecutionException {
        EventMaster e = null;
        for (EventMaster event : MasterCache.Event.get(key)) {
            if (event.getProcessYN().equalsIgnoreCase("Y")
                    && event.getEventTypeCD().equalsIgnoreCase(type)) {
                e = event;
                break;
            }
        }

        return e;
    }
}
