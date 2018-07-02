package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.json.EventMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
        String[] recordColumns = recordValue.split(SEPARATOR);

        // time, area, eqp, p1, p2, p3, p4, ... pn, status:time, prev:time
        String statusCodeAndTime = recordColumns[recordColumns.length - 2];
        String[] nowStatusCodeAndTime = statusCodeAndTime.split(":");

        String prevStatusAndTime = recordColumns[recordColumns.length - 1];
        String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");

        // extract event
        if (prevStatusCodeAndTime[0].equalsIgnoreCase("I")
                && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

            EventMasterDataSet event = MasterDataCache.getInstance().getEventByType(partitionKey, "S");
            String eventMessage = nowStatusCodeAndTime[1] + ","
                    + event.getEventRawId() + "," + event.getEventTypeCD();

            log.debug("[{}] - process started.", partitionKey);
            context().forward(partitionKey, eventMessage.getBytes());
            context().commit();

        } else if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

            EventMasterDataSet event = MasterDataCache.getInstance().getEventByType(partitionKey, "E");
            String eventMessage = prevStatusCodeAndTime[1] + ","
                    + event.getEventRawId() + "," + event.getEventTypeCD();

            log.debug("[{}] - process ended.", partitionKey);
            context().forward(partitionKey, eventMessage.getBytes());
            context().commit();
        }
    }
}
