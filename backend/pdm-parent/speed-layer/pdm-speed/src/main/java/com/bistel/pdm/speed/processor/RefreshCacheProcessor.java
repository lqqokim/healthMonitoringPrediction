package com.bistel.pdm.speed.processor;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Reload metadata in-memory.
 */
public class RefreshCacheProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(RefreshCacheProcessor.class);

    @Override
    public void init(ProcessorContext context) {
        super.init(context);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        try {
            // refresh master info.
            MasterCache.Equipment.refresh(partitionKey);
            MasterCache.ParameterWithSpec.refresh(partitionKey);
            MasterCache.EquipmentCondition.refresh(partitionKey);
            MasterCache.ExprParameter.refresh(partitionKey);
            MasterCache.Event.refresh(partitionKey);
            MasterCache.Health.refresh(partitionKey);
            MasterCache.Mail.refresh(partitionKey);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        context().forward(partitionKey, streamByteRecord);
        context().commit();
    }
}
