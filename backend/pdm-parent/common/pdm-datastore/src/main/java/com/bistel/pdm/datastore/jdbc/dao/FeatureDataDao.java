package com.bistel.pdm.datastore.jdbc.dao;

import org.apache.kafka.clients.consumer.ConsumerRecords;

public interface FeatureDataDao {

    void storeRecord(ConsumerRecords<String, byte[]> records);
}
