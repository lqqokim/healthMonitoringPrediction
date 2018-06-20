package com.bistel.pdm.speed.processor;

import org.apache.kafka.streams.processor.Processor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class PredictFaultProcessor implements Processor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectChangeProcessor.class);

    private final static String SEPARATOR = ",";

    private ProcessorContext context;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        // keep the processor context locally because we need it in punctuate() and commit()
        this.context = processorContext;
    }

    @Override
    public void process(String s, byte[] bytes) {

    }

    @Override
    @Deprecated
    public void punctuate(long l) {
        // this method is deprecated and should not be used anymore
    }

    @Override
    public void close() {
        // close any resources managed by this processor
        // Note: Do not close any StateStores as these are managed by the library
    }
}
