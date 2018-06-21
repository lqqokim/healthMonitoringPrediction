package com.bistel.pdm.speed.processor;

import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class PredictFaultProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(PredictFaultProcessor.class);

    private final static String SEPARATOR = ",";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String s, byte[] bytes) {

    }
}
