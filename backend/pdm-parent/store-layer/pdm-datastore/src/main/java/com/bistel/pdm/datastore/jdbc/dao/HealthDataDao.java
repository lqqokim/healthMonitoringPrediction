package com.bistel.pdm.datastore.jdbc.dao;

import com.bistel.pdm.datastore.model.ParamHealthData;
import com.bistel.pdm.datastore.model.ParamHealthRULData;
import org.apache.kafka.clients.consumer.ConsumerRecords;

import java.util.List;

public interface HealthDataDao {

    Long getTraceRawId();

    void storeHealth(List<ParamHealthData> records);

    void storeHealthRUL(List<ParamHealthRULData> records);

    void storeRecord(ConsumerRecords<String, byte[]> records);
}
