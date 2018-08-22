package com.bistel.pdm.datastore.jdbc.dao;

import org.apache.kafka.clients.consumer.ConsumerRecord;

import java.util.List;

public interface EventDataDao {

    void storeRecords(List<ConsumerRecord<String, byte[]>> records);
}
