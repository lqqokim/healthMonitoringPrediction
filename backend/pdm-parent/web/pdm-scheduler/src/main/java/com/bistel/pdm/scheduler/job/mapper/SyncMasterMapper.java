package com.bistel.pdm.scheduler.job.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface SyncMasterMapper {

    /*Area 정보 다 가져오기*/
    List<HashMap<String, Object>> getAreaList();

    /*ProcessLine 정보 다 가져오기*/
    List<HashMap<String, Object>> getProcessLineList();

    /*Area, ProcessLine 정보 update, delete*/
    int insertAreaMstPdm(HashMap<String, Object> param);

    int updateAreaMstPdm(HashMap<String, Object> param);

    /*Eqp 정보 다 가져오기*/
    List<HashMap<String, Object>> getEqpList(HashMap<String, Object> param);

    int updateEqpSync(HashMap<String, Object> param);

    int insertEqp(HashMap<String, Object> param);

    int insertEqpSync(HashMap<String, Object> param);

    /*파라미터 정보 다 가져오기*/
    List<HashMap<String, Object>> getParamList(HashMap<String, Object> param);

    int updateParamSync(HashMap<String, Object> param);

    int updateParam(HashMap<String, Object> param);

    int insertParam(HashMap<String, Object> param);

    int insertParamSync(HashMap<String, Object> param);

}
