package com.bistel.pdm.lambda.kafka.partitioner;

import com.bistel.pdm.common.json.EquipmentMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.StreamPartitioner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ExecutionException;

public class CustomStreamPartitioner implements StreamPartitioner<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(CustomStreamPartitioner.class);

    @Override
    public Integer partition(final String key, final byte[] value, final int numPartitions) {
        int partition = 0;

        try {
            EquipmentMasterDataSet master = MasterCache.Equipment.get(key);
            partition = master.getEqpRawId().intValue() % numPartitions;

        } catch (ExecutionException e) {
            log.error(e.getMessage(), e);
        }

        return partition;
    }
}
