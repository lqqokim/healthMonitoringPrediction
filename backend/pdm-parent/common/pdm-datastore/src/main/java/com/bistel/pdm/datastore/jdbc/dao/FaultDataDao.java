package com.bistel.pdm.datastore.jdbc.dao;

import org.apache.kafka.clients.consumer.ConsumerRecords;

public interface FaultDataDao {
    void storeRecord(ConsumerRecords<String, byte[]> records);
}
