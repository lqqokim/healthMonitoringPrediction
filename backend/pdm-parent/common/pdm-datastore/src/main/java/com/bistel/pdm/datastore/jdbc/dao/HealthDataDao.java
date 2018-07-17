package com.bistel.pdm.datastore.jdbc.dao;

import org.apache.kafka.clients.consumer.ConsumerRecords;

public interface HealthDataDao {

    void storeRecord(ConsumerRecords<String, byte[]> records);
}
