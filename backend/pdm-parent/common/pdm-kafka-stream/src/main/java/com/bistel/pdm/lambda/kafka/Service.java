package com.bistel.pdm.lambda.kafka;

/**
 *
 *
 */
public interface Service {

    void start(String bootstrapServers);

    void stop();
}
