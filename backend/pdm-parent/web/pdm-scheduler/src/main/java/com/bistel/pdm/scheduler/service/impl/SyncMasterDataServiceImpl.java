package com.bistel.pdm.scheduler.service.impl;

import com.bistel.pdm.scheduler.job.mapper.SyncConnectionInfoMapper;
import com.bistel.pdm.scheduler.job.mapper.SyncMasterMapper;
import com.bistel.pdm.scheduler.service.SyncMasterDataService;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

@Service
public class SyncMasterDataServiceImpl implements SyncMasterDataService {
    private static final Logger log = LoggerFactory.getLogger(SyncMasterDataServiceImpl.class);

    private static final String LEGACY_MYBATIS_CONFIG = "./config/legacy-mybatis-config.xml";

    @Autowired
    private SyncConnectionInfoMapper connectionInfoMapper;

    @Autowired
    private SyncMasterMapper syncMasterMapper;

    @Override
    public List<HashMap<String, Object>> getAllConnections() {
        return connectionInfoMapper.getAllConnections();
    }

    @Override
    public List<HashMap<String, Object>> getSchedulerList() {
        return connectionInfoMapper.getSchedulerList();
    }

    @Override
    public void syncAutoMasterData() {
        try {
            //fog connection 정보 조회 <- 사용여부가 Y인 것만
            List<HashMap<String, Object>> autoSyncConnections = connectionInfoMapper.getAutoSyncConnections();

            //커넥션 정보 만큼 conn 테스트
            for (HashMap<String, Object> connectionInfo : autoSyncConnections) {

                Properties dataSourceProperty = getDynamicDataSource(connectionInfo);

                InputStream inputStream = Resources.getResourceAsStream(LEGACY_MYBATIS_CONFIG);
                SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream, dataSourceProperty);

                //false 는 autoCommit 하지 않겠다는 의미
                SqlSession session = sqlSessionFactory.openSession(false);

                //쿼리에 필요한 입력 값을 세팅
                HashMap<String, Object> param = new HashMap<String, Object>();
                param.put("idx", connectionInfo.get("FOG_DB_CONN_MST_IDX").toString());

//                List<HashMap<String, Object>> syncEqpList = connectionInfoMapper.getEquipments(param);

                List<HashMap<String, Object>> outputs =
                        session.selectList("com.bistel.pdm.scheduler.job.mapper.LegacyMasterMapper.testList");

                for (HashMap<String, Object> output : outputs) {
                    System.out.println(output.get("TEST").toString());
                }

                session.commit();
                session.close();
            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public HashMap<String, Object> syncManualMasterData(HashMap<String, Object> param) {
        log.debug("Starting data synchronization...");

        try {
            HashMap<String, Object> connectionOneByIdx = connectionInfoMapper.getConnectionOneByIdx(param);
            Properties dataSourceProperty = getDynamicDataSource(connectionOneByIdx);

            InputStream inputStream = Resources.getResourceAsStream(LEGACY_MYBATIS_CONFIG);
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream, dataSourceProperty);

            //if false, not allow autocommit.
            SqlSession session = sqlSessionFactory.openSession(false);

            //List<HashMap<String, Object>> eqpList = dongwookMapper.getEqpList(param);

            List<HashMap<String, Object>> fogUnitList =
                    session.selectList("com.bistel.pdm.scheduler.job.mapper.LegacyMasterMapper.edgeDeviceInfoList");

            //LineList 추출
            List<HashMap<String, Object>> tempLineList = new ArrayList<HashMap<String, Object>>();

            //ProcessLineList 추출
            List<HashMap<String, Object>> tempProcessLineList = new ArrayList<HashMap<String, Object>>();

            for (HashMap<String, Object> fogUnit : fogUnitList) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                HashMap<String, Object> map2 = new HashMap<String, Object>();
                map.put("LINE", fogUnit.get("LINE").toString());
                tempLineList.add(map); //
                map2.put("LINE", fogUnit.get("LINE").toString());
                map2.put("PROCESSLINE", fogUnit.get("PROCESSLINE").toString());
                tempProcessLineList.add(map2);
            }

            //중복 제거
            List<HashMap<String, Object>> lineList = new ArrayList<HashMap<String, Object>>();
            List<HashMap<String, Object>> processLineList = new ArrayList<HashMap<String, Object>>();

            for (HashMap<String, Object> tempLine : tempLineList) {
                if (!lineList.contains(tempLine)) {
                    lineList.add(tempLine);
                }
            }

            for (HashMap<String, Object> tempProcessLine : tempProcessLineList) {
                if (!processLineList.contains(tempProcessLine)) {
                    processLineList.add(tempProcessLine);
                }
            }

            //hmp AREA_MST_PDM 조회
            List<HashMap<String, Object>> areaList = syncMasterMapper.getAreaList();

            //없으면 insert, 있으면 그대로(Line)
            for (HashMap<String, Object> line : lineList) {
                //비교 구문
                boolean isExist = false;
                for (HashMap<String, Object> area : areaList) {
                    if (area.get("NAME").toString().equals(line.get("LINE").toString())) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) { //없으면 insert
                    HashMap<String, Object> paramMap = new HashMap<String, Object>();
                    paramMap.put("RAWID", 1);
                    paramMap.put("NAME", line.get("LINE").toString());

                    syncMasterMapper.insertAreaMstPdm(paramMap);
                }
            }

            //hmp AREA_MST_PDM 조회
            List<HashMap<String, Object>> areaList2 = syncMasterMapper.getProcessLineList();

            //없으면 insert, 있으면 그대로(ProcessLine)
            for (HashMap<String, Object> processLine : processLineList) {
                //비교 구문
                boolean isExist = false;
                for (HashMap<String, Object> area : areaList2) {
                    if (area.get("PARENT_NAME").toString().equals(processLine.get("LINE").toString())
                            && area.get("NAME").toString().equals(processLine.get("PROCESSLINE").toString())) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) { //없으면 insert
                    HashMap<String, Object> paramMap = new HashMap<String, Object>();
                    paramMap.put("NAME", processLine.get("PROCESSLINE").toString());
                    paramMap.put("LINE", processLine.get("LINE").toString());

                    syncMasterMapper.insertAreaMstPdm(paramMap);
                }
            }

            //////////////////////////////////////////////////////////////////////////

            //eqp
            //커넥션 RAWID에 맞는 HMP EQP_SYNC_LINK_MST_PDM 조인 걸어서 EQP_MST_PDM 조회()
            List<HashMap<String, Object>> eqpList = syncMasterMapper.getEqpList(param);

            //없으면 insert, 있으면 비교해서 update, 또한 역비교해서 hmp에는 있는데, fog에는 없으면, delete_flag를 Y로 업데이트
            for (HashMap<String, Object> fogUnit : fogUnitList) {
                //비교 구문
                boolean isExist = false;
                for (HashMap<String, Object> eqp : eqpList) {
                    if (eqp.get("AREA_NAME").toString().equals(fogUnit.get("PROCESSLINE").toString())
                            && eqp.get("MODEL_NAME").toString().equals(fogUnit.get("EQPTYPE").toString())
                            && eqp.get("NAME").toString().equals(
                            fogUnit.get("EQPID").toString().equals(fogUnit.get("UNITID").toString()) ?
                                    fogUnit.get("EQPID").toString() : fogUnit.get("EQPID").toString() + "_" + fogUnit.get("UNITID").toString()
                    )) {
                        isExist = true;
                        if (eqp.get("IS_DELETED").toString().equals("Y")) {//동기화 해서 update : 동기화 항목은 IS_DELETED
                            HashMap<String, Object> paramMap = new HashMap<String, Object>();
                            paramMap.put("RAWID", eqp.get("RAWID").toString());
                            paramMap.put("IS_DELETED", "N");

                            syncMasterMapper.updateEqpSync(paramMap);
                        }
                        break;
                    }
                }

                if (!isExist) { //없으면 EQP_MST_PDM 과 EQP_SYNC_LINK_MST_PDM 두곳에 insert
                    HashMap<String, Object> paramMap = new HashMap<String, Object>();
                    paramMap.put("PROCESSLINE", fogUnit.get("PROCESSLINE").toString());
                    paramMap.put("MODEL_NAME", fogUnit.get("EQPTYPE").toString());
                    paramMap.put("NAME", fogUnit.get("EQPID").toString().equals(fogUnit.get("UNITID").toString()) ?
                            fogUnit.get("EQPID").toString() : fogUnit.get("EQPID").toString() + "_" + fogUnit.get("UNITID").toString());

                    syncMasterMapper.insertEqp(paramMap);// Mybatis에 의해 EQP_MST_RAWID이 저절로 세팅

                    paramMap.put("DATA_SYNC_MST_RAWID", param.get("RAWID"));
                    syncMasterMapper.insertEqpSync(paramMap);


                }
            }

            //////////////////////////////////////////////////////////////////////////

            //eqp param
            //fog에서 param 조회
            List<HashMap<String, Object>> fogParamList = session.selectList("com.bistel.test.mapper.FogMapper.deviceAddressInfoList");

            //커넥션 RAWID에 맞는 HMP PARAM_SYNC_LINK_MST_PDM 조인 걸어서 PARAM_MST_PDM 조회()
            List<HashMap<String, Object>> paramList = syncMasterMapper.getParamList(param);

            //없으면 insert, 있으면 비교해서 update, 또한 역비교해서 hmp에는 있는데, fog에는 없으면, delete_flag를 Y로 업데이트
            for (HashMap<String, Object> fogParam : fogParamList) {
                //비교 구문
                boolean isExist = false;
                for (HashMap<String, Object> parameter : paramList) {
                    //svid 없을때...
                    if (parameter.get("NAME").toString().equals(fogParam.get("COLUMNNAME").toString())
                            && parameter.get("EQP_NAME").toString().equals(
                            fogParam.get("EQPID").toString().equals(fogParam.get("UNITID").toString()) ?
                                    fogParam.get("EQPID").toString() : fogParam.get("EQPID").toString() + "_" + fogParam.get("UNITID").toString()
                    )) {
                        //svid 있을때...
                        //if(parameter.get("SVID").toString().equals(fogParam.get("SVID").toString()) {

                        isExist = true;
                        if (parameter.get("IS_DELETED").toString().equals("Y")
                                || !parameter.get("USE_YN").toString().equals(fogParam.get("ISUSE").toString())) {//동기화 해서 update : 동기화 항목은 IS_DELETED, USE_YN
                            HashMap<String, Object> paramMap = new HashMap<String, Object>();
                            paramMap.put("RAWID", fogParam.get("RAWID").toString());
                            paramMap.put("PARAM_SYNC_RAWID", fogParam.get("PARAM_SYNC_RAWID").toString());
                            paramMap.put("IS_DELETED", "N");
                            paramMap.put("USE_YN", fogParam.get("ISUSE").toString());

                            syncMasterMapper.updateParamSync(paramMap);
                            syncMasterMapper.updateParam(paramMap);
                        }
                        break;
                    }
                }

                if (!isExist) { //없으면 PARAM_MST_PDM 과 PARAM_SYNC_LINK_MST_PDM 두곳에 insert
                    HashMap<String, Object> paramMap = new HashMap<String, Object>();
                    paramMap.put("EQP_NAME", fogParam.get("EQPID").toString().equals(fogParam.get("UNITID").toString()) ?
                            fogParam.get("EQPID").toString() : fogParam.get("EQPID").toString() + "_" + fogParam.get("UNITID").toString());
                    paramMap.put("SVID", fogParam.get("SVID").toString());
                    paramMap.put("NAME", fogParam.get("COLUMNNAME").toString());
                    paramMap.put("PARAM_TYPE_CD", fogParam.get("ITEMTYPE").toString());
                    paramMap.put("DATA_TYPE_CD", fogParam.get("DATATYPE").toString());
                    paramMap.put("UNIT_CD", fogParam.get("DISPLAYUNIT").toString());
                    paramMap.put("USE_YN", fogParam.get("ISUSE").toString());

                    syncMasterMapper.insertParam(paramMap);// Mybatis에 의해 EQP_MST_RAWID이 저절로 세팅

                    paramMap.put("DATA_SYNC_MST_RAWID", param.get("RAWID"));
                    syncMasterMapper.insertParamSync(paramMap);


                }
            }
            //////////////////////////////////////////////////////////////////////////

            session.commit();
            session.close();
            log.debug("Data synchronization completed.");

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

		/*AUTO_SYNC_YN: "Y"
		DB_NAME: "fog1"
		DB_TYPE: "mssql"
		FOG_DB_CONN_MST_IDX: 2
		IP: "localhost"
		PASSWORD: "bistel01"
		USER_NAME: "bistel"*/

		/*try {
			resultMap.put("result", dongwookMapper.deleteFogConn(param));
		} catch (Exception e) {
			resultMap.put("result", 0);
			resultMap.put("msg", e);
		}*/
        return param;
    }

    @Override
    public HashMap<String, Object> insertConnectionInfo(HashMap<String, Object> param) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        try {
            resultMap.put("result", connectionInfoMapper.insertConnection(param));
        } catch (Exception e) {
            resultMap.put("result", 0);
            resultMap.put("msg", e);
        }
        return resultMap;
    }

    @Override
    public HashMap<String, Object> updateConnectionInfo(HashMap<String, Object> param) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        try {
            resultMap.put("result", connectionInfoMapper.updateConnection(param));
        } catch (Exception e) {
            resultMap.put("result", 0);
            resultMap.put("msg", e);
        }
        return resultMap;
    }

    @Override
    public HashMap<String, Object> deleteConnectionInfo(HashMap<String, Object> param) {
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        try {
            resultMap.put("result", connectionInfoMapper.deleteConnection(param));
        } catch (Exception e) {
            resultMap.put("result", 0);
            resultMap.put("msg", e);
        }
        return resultMap;
    }

    private Properties getDynamicDataSource(HashMap<String, Object> dataSourceInfo) {
        Properties props = new Properties();

        if (dataSourceInfo.get("DB_TYPE").toString().equals("mssql")) {
            StringBuilder url = new StringBuilder(); // jdbc:sqlserver://localhost:1433;databaseName=fog1;

            url.append("jdbc:sqlserver://");
            url.append(dataSourceInfo.get("IP").toString());
            url.append(dataSourceInfo.get("PORT") == null ? ":1433;" : ":" + dataSourceInfo.get("PORT").toString() + ";");

            if (dataSourceInfo.get("DB_NAME") != null) {
                url.append("databaseName=").append(dataSourceInfo.get("DB_NAME").toString()).append(";");
            }

            props.put("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver");
            props.put("url", url.toString());
            props.put("username", dataSourceInfo.get("USER_NAME").toString());
            props.put("password", dataSourceInfo.get("PASSWORD").toString());

        } else if (dataSourceInfo.get("DB_TYPE").toString().equals("oracle")) {
            StringBuilder url = new StringBuilder(); //jdbc:oracle:thin:@localhost:1521:orcl

            url.append("jdbc:oracle:thin:@");
            url.append(dataSourceInfo.get("IP").toString());
            url.append(dataSourceInfo.get("PORT") == null ? ":1521" : ":" + dataSourceInfo.get("PORT").toString());

            if (dataSourceInfo.get("SID") != null) {
                url.append(":" + dataSourceInfo.get("SID").toString());
            } else if (dataSourceInfo.get("SERVICE_NAME") != null) {
                url.append("/" + dataSourceInfo.get("SERVICE_NAME").toString());
            } else {
                // default settings
                url.append(":orcl");
            }
            props.put("driver", "oracle.jdbc.driver.OracleDriver");
            props.put("url", url.toString());
            props.put("username", dataSourceInfo.get("USER_NAME").toString());
            props.put("password", dataSourceInfo.get("PASSWORD").toString());
        }

        return props;
    }
}
