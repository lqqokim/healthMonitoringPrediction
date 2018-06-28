package com.bistel.pdm.batch.processor;

import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class EventProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(EventProcessor.class);

    @Override
    public void init(ProcessorContext context) {
        super.init(context);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        log.debug("[{}] - Throw the event to output-event.", partitionKey);
        this.context().forward(partitionKey, streamByteRecord, "output-event");
        this.context().commit();
    }
}
