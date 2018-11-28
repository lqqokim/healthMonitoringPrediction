package com.bistel.pdm.scheduler.controller;

import com.bistel.pdm.scheduler.service.SyncMasterDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/hmp/sync")
public class SyncMasterDataController {
    private static final Logger log = LoggerFactory.getLogger(SyncMasterDataController.class);

    @Autowired
    private SyncMasterDataService syncMasterDataService;

    @RequestMapping("/allConnections")
    public List<HashMap<String, Object>> getAllConnections() {
        return syncMasterDataService.getAllConnections();
    }

    @RequestMapping("/schedulerList")
    public List<HashMap<String, Object>> getSchedulerList() {
        return syncMasterDataService.getSchedulerList();
    }

    @PostMapping(path = {"/connectionInfo/insert"})
    public HashMap<String, Object> insertConnectionInfo(@RequestBody HashMap<String, Object> param) {
        return syncMasterDataService.insertConnectionInfo((HashMap<String, Object>) param.get("params"));
    }

    @PostMapping(path = {"/connectionInfo/update"})
    public HashMap<String, Object> updateConnectionInfo(@RequestBody HashMap<String, Object> param) {
        return syncMasterDataService.updateConnectionInfo((HashMap<String, Object>) param.get("params"));
    }

    @PostMapping(path = {"/connectionInfo/delete"})
    public HashMap<String, Object> deleteConnectionInfo(@RequestBody HashMap<String, Object> param) {
        return syncMasterDataService.deleteConnectionInfo((HashMap<String, Object>) param.get("params"));
    }

    @PostMapping(path = {"/master"})
    public HashMap<String, Object> syncManualMasterData(@RequestBody HashMap<String, Object> param) {
        return syncMasterDataService.syncManualMasterData((HashMap<String, Object>) param.get("params"));
    }

    public ServerResponse getServerResponse(int responseCode, Object data) {
        ServerResponse serverResponse = new ServerResponse();
        serverResponse.setStatusCode(responseCode);
        serverResponse.setData(data);
        return serverResponse;
    }
}
