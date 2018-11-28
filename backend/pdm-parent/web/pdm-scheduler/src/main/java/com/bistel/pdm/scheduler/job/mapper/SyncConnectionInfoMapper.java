package com.bistel.pdm.scheduler.job.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface SyncConnectionInfoMapper {

    /*모든 커넥션 정보 다 가져오기*/
    List<HashMap<String, Object>> getAllConnections();

    /*특정 커넥션 정보만 가져오기*/
    HashMap<String, Object> getConnectionOneByIdx(HashMap<String, Object> param);

    /*사용여부가 Y인 커넥션 정보만 가져오기*/
    List<HashMap<String, Object>> getAutoSyncConnections();

    /*해당 conn에 맞는 설비 정보만 가져오기*/
    List<HashMap<String, Object>> getEquipments(HashMap<String, Object> param);

    /*해당 설비에 맞는 파라미터 정보만 가져오기*/
    List<HashMap<String, Object>> getParameters(HashMap<String, Object> param);

    /*모든 스캐줄러 정보 다 가져오기*/
    List<HashMap<String, Object>> getSchedulerList();

    int insertConnection(HashMap<String, Object> param);

    int updateConnection(HashMap<String, Object> param);

    int deleteConnection(HashMap<String, Object> param);

}
