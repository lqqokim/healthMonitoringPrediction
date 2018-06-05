package com.bistel.pdm.batch.transform;

import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import com.typesafe.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Main entry point for Batch Layer.
 */
public class TransformMapFunction extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(TransformMapFunction.class);

    public TransformMapFunction(String applicationId, String inBrokers,
                                String outBrokers, String inTopicName,
                                String outTopicName, String schemaUrl, String servingAddr) {
        super(inBrokers, outBrokers, inTopicName, outTopicName, schemaUrl, servingAddr);
    }

    @Override
    protected String getApplicationId() {
        return this.applicationId;
    }

    public synchronized void start() {
        String id = getApplicationId();
        if (id != null) {
            log.info("Starting Batch Layer - {}", id);
        }
    }

    @Override
    public void close() throws IOException {
    }
}
