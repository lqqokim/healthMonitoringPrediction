package com.bistel.pdm.speed.processor;

import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RecordParserProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(RecordParserProcessor.class);

    private final static String NEXT_STREAM_NODE = "StatusDecisionProcessor";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String key, byte[] bytes) {
        String record = new String(bytes);
        log.debug("[{}] - partition:{}, offset:{}", key, context().partition(), context().offset());
        context().forward(key, record, To.child(NEXT_STREAM_NODE));
    }
}
