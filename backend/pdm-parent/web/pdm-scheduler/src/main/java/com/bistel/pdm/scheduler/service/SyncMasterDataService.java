package com.bistel.pdm.scheduler.service;

import java.util.HashMap;
import java.util.List;

public interface SyncMasterDataService {

//    boolean connectionTest();

    List<HashMap<String, Object>> getAllConnections();

    List<HashMap<String, Object>> getSchedulerList();

    void syncAutoMasterData();

    HashMap<String, Object> syncManualMasterData(HashMap<String, Object> param);

    HashMap<String, Object> insertConnectionInfo(HashMap<String, Object> param);

    HashMap<String, Object> updateConnectionInfo(HashMap<String, Object> param);

    HashMap<String, Object> deleteConnectionInfo(HashMap<String, Object> param);

}
