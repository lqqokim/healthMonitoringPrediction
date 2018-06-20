package com.bistel.pdm.batch.processor;

import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class FD02Processor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(FD02Processor.class);

    private final static String SEPARATOR = ",";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        // calculate health index for logic 1, 2


    }
}
