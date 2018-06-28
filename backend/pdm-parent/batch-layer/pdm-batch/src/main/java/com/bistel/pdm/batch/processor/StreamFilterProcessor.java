package com.bistel.pdm.batch.processor;

import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Filter by attribute into master info.
 */
public class StreamFilterProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(StreamFilterProcessor.class);

    @Override
    public void init(ProcessorContext context) {
        super.init(context);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        if (!MasterDataCache.getInstance().getEqpMasterDataSet().containsKey(partitionKey)) {
            log.info("[{}] - Not existed.", partitionKey);
        } else {
            context().forward(partitionKey, streamByteRecord);
            // commit the current processing progress
            context().commit();
        }
    }
}
