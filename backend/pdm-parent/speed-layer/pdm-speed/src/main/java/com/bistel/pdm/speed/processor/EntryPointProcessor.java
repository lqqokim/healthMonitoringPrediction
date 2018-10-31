package com.bistel.pdm.speed.processor;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ExecutionException;

public class EntryPointProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(EntryPointProcessor.class);

    private final static String NEXT_STREAM_NODE = "RecordParserProcessor";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String key, byte[] bytes) {
        try {
            // filter by master
            if (MasterCache.Equipment.get(key) != null) {
                context().forward(key, bytes, To.child(NEXT_STREAM_NODE));

            } else {
                log.debug("[{}] - There are no matching equipment.", key);
                context().commit();
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
