package com.bistel.pdm.api.producer;

/**
 *
 */
public interface ProducerJob {

    SensorDataRecord execute(String record);
}
