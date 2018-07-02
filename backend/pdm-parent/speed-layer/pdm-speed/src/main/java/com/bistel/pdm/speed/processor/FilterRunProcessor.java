package com.bistel.pdm.speed.processor;

import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Filter by master info.
 */
public class FilterRunProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(FilterRunProcessor.class);

    private final static String SEPARATOR = ",";

    @Override
    public void init(ProcessorContext context) {
        super.init(context);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);

        if (recordColumns[recordColumns.length - 1].equalsIgnoreCase("R")) {
            context().forward(partitionKey, streamByteRecord);
            context().commit();
        }
    }
}
