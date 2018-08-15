package com.bistel.pdm.datastore.jdbc.dao;

import org.apache.kafka.clients.consumer.ConsumerRecord;

import java.util.List;

public interface FeatureDataDao {

    void storeRecords(List<ConsumerRecord<String, byte[]>> records);
}
