package com.bistel.pdm.datastore.jdbc.dao;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.datastore.model.SensorRawData;

import java.util.Map;

public interface SensorRawDataDao {

    void storeRecord(Map<String, Pair<Long, SensorRawData>> records);
}
