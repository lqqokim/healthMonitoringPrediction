package com.bistel.pdm.speed.processor;

import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CalculateHealthIndexProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(CalculateHealthIndexProcessor.class);

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, byte[]> kvStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        // keep the processor context locally because we need it in punctuate() and commit()
        super.init(processorContext);

        // retrieve the key-value store named "persistent-processing"
        kvStore = (KeyValueStore) context().getStateStore("persistent-processing");

    }

    @Override
    public void process(String s, byte[] bytes) {
        // calculate health index for logic 1, 2
    }
}
