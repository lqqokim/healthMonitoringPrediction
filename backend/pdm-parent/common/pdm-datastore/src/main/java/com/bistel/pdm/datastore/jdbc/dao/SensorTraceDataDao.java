package com.bistel.pdm.datastore.jdbc.dao;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.datastore.model.SensorTraceData;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;

import java.sql.SQLException;
import java.util.List;

public interface SensorTraceDataDao {

    Long getTraceRawId() throws SQLException;

    void storeRecords(List<ConsumerRecord<String, byte[]>> records);

    void storeRecord(List<Pair<Long, SensorTraceData>> records) throws SQLException;
}
