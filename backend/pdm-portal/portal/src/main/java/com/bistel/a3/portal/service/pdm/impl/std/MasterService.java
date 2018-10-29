package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.portal.dao.common.CodeMapper;
import com.bistel.a3.portal.dao.pdm.std.master.*;
import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.pdm.EqpWithArea;
import com.bistel.a3.portal.domain.pdm.Spec;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.AreaWithChildren;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import com.bistel.a3.portal.domain.pdm.master.PartWithParam;
import com.bistel.a3.portal.domain.pdm.std.master.STDConditionalSpec;
import com.bistel.a3.portal.domain.pdm.std.master.STDEqp;
import com.bistel.a3.portal.domain.pdm.std.master.STDParamHealth;
import com.bistel.a3.portal.service.pdm.IMasterService;
import com.bistel.a3.portal.util.ApacheHttpClientGet;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.TransactionUtil;

import net.bitnine.agensgraph.deps.org.json.simple.JSONObject;
import net.bitnine.agensgraph.deps.org.json.simple.parser.JSONParser;
import org.codehaus.jackson.map.util.JSONPObject;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

import java.security.Principal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnExpression("${run.standard}")
public class MasterService implements IMasterService {
    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    @Autowired
    private STDEventMapper stdEventMapper;

    @Autowired
    private CodeMapper codeMapper;

    @Autowired
    private ApacheHttpClientGet apacheHttpClientGet;

    //***************
    //     Area
    //***************
    public List<AreaWithChildren> getAreas(String fabId, Long parentId) {
        STDAreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAreaMapper.class);
        return getAreaTree(mapper, parentId);
    }
    public List<Area> getAreaAll(String fabId) {
        STDAreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAreaMapper.class);
        return mapper.selectAllArea();
    }
    private List<AreaWithChildren> getAreaTree(STDAreaMapper mapper, Long parentId) {
        List<AreaWithChildren> list = mapper.selectList(parentId);
        for(AreaWithChildren l : list) {
            if(l.getArea_id()!=null){
                l.setChildren(getAreaTree(mapper, l.getArea_id()));
            }

        }
        return list;
    }
    public Area getArea(String fabId, Long areaId) {
        STDAreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAreaMapper.class);
        return mapper.selectOne(areaId);
    }

    public void setArea(String fabId, Area area) {
        STDAreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAreaMapper.class);
        if(area.getArea_id() == null) {
            mapper.insertOne(area);
        } else {
            mapper.updateOne(area);
        }
    }
    public void removeArea(String fabId, Long areaId) {
        STDAreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDAreaMapper.class);
        mapper.deleteOne(areaId);
    }


    //***************
    //   Bearing
    //***************
    public List<Bearing> getBearings(String fabId) {
        STDBearingMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDBearingMapper.class);
        return mapper.selectList();
    }
    public Bearing getBearing(String fabId, String modelNumber, String manufacture) {
        STDBearingMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDBearingMapper.class);
        return mapper.selectOne(modelNumber, manufacture);
    }
    public void setBearing(String fabId, Bearing bearing) {
        STDBearingMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDBearingMapper.class);
        Bearing b = mapper.selectOne(bearing.getModel_number(), bearing.getManufacture());
        if(b == null) {
            mapper.insertOne(bearing);
        } else {
            mapper.updateOne(bearing);
        }
    }
    public void removeBearing(String fabId, String modelNumber, String manufacture) {
        STDBearingMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDBearingMapper.class);
        mapper.deleteOne(modelNumber, manufacture);
    }


    //***************
    //   Code
    //***************
    public List<Code> getCode(String app, String codeCategory, Boolean useYn) {
        return codeMapper.selectByCategoryName(app, codeCategory, useYn);
    }
    public String getCode(List<Code> codes, String cd) {
        for(Code code : codes) {
            if(code.getCode().equals(cd)) {
                return code.getName();
            }
        }
        return null;
    }


    //***************
    //   Eqp
    //***************
    public List<EqpWithEtc> getEqps(String fabId, Long areaId) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        return mapper.selectList(areaId);
    }
    public List<EqpWithArea> getEqpsByAreaIds(String fabId, List<Long> areaIds) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        List<EqpWithArea> retValue = new ArrayList<>();
        for (int i = 0; i < areaIds.size(); i++) {
            Long areaId = areaIds.get(i);
            List<EqpWithArea>  eqps =  mapper.selectEqpsByArea(areaId);
            retValue.addAll(eqps);
        }
        return retValue;
    }
    public EqpWithEtc getEqp(String fabId, Long areaId, Long eqpId) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        return mapper.selectOne(eqpId);
    }
    public void removeEqps(String fabId, Long areaId, Long[] eqpIds) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for (Long eqpId : eqpIds) {
//                mapper.deleteEtcOne(eqpId);
                mapper.deleteOne(eqpId);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    public void setEqp(String fabId, EqpWithEtc eqp) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            if(eqp.getEqp_id() == null) {
                String img=eqp.getImage();
                if(img!=null){
                    eqp.setImage(img);
                }
                eqp.setData_type_cd("STD");
                mapper.insertOne(eqp);
////                mapper.insertEtcOne(eqp);
            } else {
                mapper.updateOne(eqp);
//                mapper.updateEtcOne(eqp);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    public void removeEqp(String fabId, Long areaId, Long eqpId) {
        STDEqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
//            mapper.deleteEtcOne(eqpId);
            mapper.deleteParambyEqp(eqpId);
            mapper.deletePartsbyEqp(eqpId);
            mapper.deleteOne(eqpId);
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }

    public void eqpCopy(String userName,String fabId, Long fromEqpId, List<String> toEqpNames) {

        STDEqpMapper STDEqpMapper = SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);

        EqpWithEtc eqpWithEtc=STDEqpMapper.selectOne(fromEqpId);


        for (int i = 0; i < toEqpNames.size(); i++)
        {
//            Eqp eqp=new Eqp();
//
//            eqp.setArea_id(eqpWithEtc.getArea_id());
//            eqp.setName(toEqpNames.get(i));
//            eqp.setData_type(eqpWithEtc.getData_type());
//
//            eqp.setUserName(userName);
//            STDEqpMapper.insertOne(eqp);
//
//            HashMap<Long,Long> fromParamToParam= copyParameters(fabId,fromEqpId, eqp);
//            HashMap<Long,Long> fromPartsToParts=copyParts(fabId, fromEqpId, eqp);
//
//             copyParamPartsLink(fabId, fromParamToParam, fromPartsToParts);

            EqpWithEtc eqpWithEtc1=new EqpWithEtc();
            eqpWithEtc1.setArea_id(eqpWithEtc.getArea_id());
            eqpWithEtc1.setName(toEqpNames.get(i));
            eqpWithEtc1.setData_type_cd(eqpWithEtc.getData_type_cd());
            eqpWithEtc1.setImage(eqpWithEtc.getImage());
            eqpWithEtc1.setModel_name(eqpWithEtc.getModel_name());
            eqpWithEtc1.setOffline_yn(eqpWithEtc.getOffline_yn());
            eqpWithEtc1.setUserName(userName);
            STDEqpMapper.insertOne(eqpWithEtc1);//eqp추가

            HashMap<Long,Long> fromPartsToParts=copyParts(fabId, fromEqpId, eqpWithEtc1);
            HashMap<Long,Long> fromParamToParam=copyParameters(fabId,fromEqpId, eqpWithEtc1); //param 복사 및 추가


            //copyParamPartsLink(fabId, fromParamToParam, fromPartsToParts);

        }


    }

    private void copyParamPartsLink(String fabId, HashMap<Long, Long> fromParamToParam, HashMap<Long, Long> fromPartsToParts) {

        STDPartMapper STDPartMapper=SqlSessionUtil.getMapper(sessions, fabId, STDPartMapper.class);

        for(Long fromPartId:fromPartsToParts.keySet()){

            PartWithParam partWithParam=STDPartMapper.selectOne(fromPartId);
            Long fromParam=partWithParam.getParam_id();
            if(fromParam!=null)
            {
                Long toParam=fromParamToParam.get(fromParam);
                Long toParts=fromPartsToParts.get(fromPartId);

                PartWithParam partWithParam1=new PartWithParam();
                partWithParam1.setParam_id(toParam);
                partWithParam1.setPart_id(toParts);

                STDPartMapper.insertLnk(partWithParam1);
            }

        }
    }
    private HashMap<Long,Long> copyParts( String fabId, Long fromEqpId, EqpWithEtc eqp) {

        STDPartMapper STDPartMapper=SqlSessionUtil.getMapper(sessions, fabId, STDPartMapper.class);
        List<PartWithParam> partWithParams=STDPartMapper.selectList(fromEqpId);

        HashMap<Long,Long> fromPartsToParts=new HashMap<>();

        for (int i = 0; i < partWithParams.size(); i++) {

            PartWithParam partWithParam=partWithParams.get(i);
            Long fromParts=partWithParam.getPart_id();

            partWithParam.setEqp_id(eqp.getEqp_id());
            partWithParam.setUserName(eqp.getUserName());
            STDPartMapper.insertOne(partWithParam);
            Long toParts=partWithParam.getPart_id();

            fromPartsToParts.put(fromParts,toParts);
        }

        return fromPartsToParts;
    }
    private HashMap<Long,Long> copyParameters(String fabId,Long fromEqpId, EqpWithEtc eqp) {

        STDParamMapper STDParamMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        List<ParamWithCommonWithRpm> paramWithCommonWithRpms= STDParamMapper.selectList(fromEqpId);

        HashMap<Long, Long> fromParamToParam=new HashMap<>();

        for (int j = 0; j < paramWithCommonWithRpms.size(); j++) {

            ParamWithCommonWithRpm paramWithCommonWithRpm=paramWithCommonWithRpms.get(j);

            Long fromParamId=paramWithCommonWithRpm.getParam_id();

            paramWithCommonWithRpm.setEqp_id(eqp.getEqp_id());
            paramWithCommonWithRpm.setUserName(eqp.getUserName());

            STDParamMapper.insertOne(paramWithCommonWithRpm);

            Long toParamId=paramWithCommonWithRpm.getParam_id();

            fromParamToParam.put(fromParamId,toParamId);
            copySpec(eqp.getUserName(),fabId, fromParamId, toParamId);

        }

        return fromParamToParam;
    }
    private void copySpec(String userName,String fabId, Long fromParamId, Long toParamId) {

        STDParamMapper paramDataMapper=SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        //Allen trace_spec_mst_pdm제거작업(2018-08-24)
        //        OverallSpec overallSpec=paramDataMapper.selectTraceDataSpec(fromParamId);

//        paramDataMapper.insertSpec(toParamId, overallSpec.getAlarm(),overallSpec.getWarn());
        ParamWithCommonWithRpm paramWithCommonWithRpm = new ParamWithCommonWithRpm();
        paramWithCommonWithRpm.setUserName(userName);
        paramWithCommonWithRpm.setParam_id(toParamId);

        //Allen trace_spec_mst_pdm제거작업(2018-08-24)
//        if (overallSpec != null) {
//        	paramWithCommonWithRpm.setAlarm(overallSpec.getAlarm());
//        	paramWithCommonWithRpm.setWarn(overallSpec.getWarn());
//        }
        
        //Trace_Spec_Mst_Pdm 없음 Allen trace_spec_mst_pdm제거작업(2018-08-24)
        // paramDataMapper.insertSpec(paramWithCommonWithRpm);
    }



    //***************
    //   Parameter
    //***************
    public List<String> getParamNamesByEqps(String fabId,List<Long> eqpIds){

        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        return mapper.selectParamNamesByEqps(eqpIds);
    }
    public List<ParamWithCommonWithRpm> getParams(String fabId, Long eqpId) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        return mapper.selectList(eqpId);
    }
    public ParamWithCommonWithRpm getParam(String fabId, Long paramId) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        return mapper.selectOne(paramId);
    }
    public void setParam(String fabId, Long eqpId , ParamWithCommonWithRpm param, String userName) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            if(param.getParam_id() == null)
            {
                if(param.getParse_index()==null)
                {
                    param.setParse_index(-1L);
                }
                mapper.insertOne(param);
                Long newParamId=mapper.selectMaxParamRawId();

                this.updateParamHealth(fabId, eqpId, newParamId, userName); //추후 삭제(UI 부재)


            } else {
                mapper.updateOne(param);
//                if(param.getRpm()!=null) {
//                    ManualRpm manualRpm= mapper.selectManualRpmByParamId(param.getParam_id());
//                    if(manualRpm!=null) {
//                        mapper.updateRpmOne(param);
//                    }else{
//                        mapper.insertRpmOne(param);
//                    }
//                }
//                mapper.updateCommonOne(param);
                if(param.getAlarm()!=null && param.getWarn()!=null) {
                    //Allen trace_spec_mst_pdm제거작업(2018-08-24)
//                    Spec spec = mapper.selectSpec(param.getParam_id());
//                    if(spec!=null) {
                        //Allen trace_spec_mst_pdm제거작업(2018-08-24)
//                        mapper.updateSpec(param);

//                    }else{
                        //Allen trace_spec_mst_pdm제거작업(2018-08-24)
//                        mapper.insertSpec(param);
//                        this.updateParamHealth(fabId, eqpId, param.getParam_id()); //추후 삭제(UI 부재)
//                    }
                }
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }





    }
    public void removeParam(String fabId, Long eqpId, Long paramId) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {

            mapper.deleteOne(paramId);
            //Allen trace_spec_mst_pdm제거작업(2018-08-24)
            //mapper.deleteSpec(paramId);
            this.deleteParamHealth(fabId,eqpId,paramId);

            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }

        //request to Kafka
        STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
        String eqp_name=eqpWithEtc.getName();
        apacheHttpClientGet.requestReload(eqp_name);

    }
    public void removeParams(String fabId, Long eqpId, Long[] paramIds) {

        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for (Long paramId : paramIds) {
                mapper.deleteCommonOne(paramId);
                mapper.deleteRpmOne(paramId);
                mapper.deleteOne(paramId);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }


        //request to Kafka
        STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
        String eqp_name=eqpWithEtc.getName();
        apacheHttpClientGet.requestReload(eqp_name);

    }


    ///////////////////////////////////////////** 추후 삭제 ** //////////////////////////////////////////////////////////////
    //insert Param_health_mst_pdm (UI의 부재 때문)
    @Override
    public void updateParamHealth(String fabId, Long eqpId, Long paramId, String userName){


        STDEtcMapper stdEtcMapper=SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);



        stdEtcMapper.insertParamHealth(paramId, 1L , "Y", userName); // param_health_mst_pdm
        stdEtcMapper.insertParamHealth(paramId, 2L , "Y", userName); // param_health_mst_pdm



        STDParamHealth paramHealths=stdEtcMapper.selectParamHealth(eqpId, paramId);



        Long param_health_mst_rawid=paramHealths.getParam_health_mst_rawid();

        stdEtcMapper.insertParamHealthOptionTotal(param_health_mst_rawid, "M",6L,null, userName);
        stdEtcMapper.insertParamHealthOptionTotal(param_health_mst_rawid, "N",3L,null, userName);


        //request to Kafka
        STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
        String eqp_name=eqpWithEtc.getName();
        apacheHttpClientGet.requestReload(eqp_name);


    }

    @Override
    public void deleteParamHealth(String fabId, Long eqpId, Long paramId){

        STDEtcMapper stdEtcMapper=SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);

        List<Long> param_health_rawid_list=stdEtcMapper.selectParamHealthMstRawIdByParamId(paramId);

        for (int i = 0; i < param_health_rawid_list.size(); i++) {

            Long paramHealthMstRawId=param_health_rawid_list.get(i);
            List<Long> param_health_opt_rawid_list=stdEtcMapper.selectParamHealthOptMstRawIdByMstRawId(paramHealthMstRawId);
            for (int j = 0; j < param_health_opt_rawid_list.size(); j++)
            {
                Long optionRawId=param_health_opt_rawid_list.get(j);
                stdEtcMapper.deleteParamHealthOptionMstPdmByRawId(optionRawId);
            }
            stdEtcMapper.deleteParamHealthMstPdmByRawId(paramHealthMstRawId);
        }


        //request to Kafka
        STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
        String eqp_name=eqpWithEtc.getName();
        apacheHttpClientGet.requestReload(eqp_name);

    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //***************
    //   Parts
    //***************
    public List<PartType> getPartTypes(String fabId) {
        STDPartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDPartMapper.class);
        return mapper.selectTypeList();
    }
    public List<PartWithParam> getParts(String fabId, Long eqpId) {
        STDPartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDPartMapper.class);
        return mapper.selectList(eqpId);
    }
    public PartWithParam getPart(String fabId, Long partId) {
        STDPartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDPartMapper.class);
        return mapper.selectOne(partId);
    }
    public void removeParts(String fabId, Long eqpId, Long[] partIds) {
        STDPartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDPartMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for (Long partId : partIds) {
                mapper.deleteLnk(partId);
                mapper.deleteOne(partId);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    public void setPart(String fabId, PartWithParam part) {
        STDPartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDPartMapper.class);
        STDParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);

        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            if(part.getPart_id() == null) {
                mapper.insertOne(part);

            } else {
//                mapper.deleteLnk(part.getPart_id());
                mapper.updateOne(part);
            }
            //            if(part.getParam_id() != null) {
//                mapper.insertLnk(part);
//            }

            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    public void removePart(String fabId, Long eqpId, Long partId) {
        STDPartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDPartMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
//            mapper.deleteLnk(partId);
            mapper.deleteOne(partId);
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    public Param getSpeedParam(String fabId, Long eqpId) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        return mapper.selectSpeedParam(eqpId);
    }

    @Override
    public void setEpqEvent(String fabId,EqpEvent eqpEvent) {
        STDEventMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEventMapper.class);
        if(eqpEvent.getRawId()==null){
            mapper.insert(eqpEvent);
        }else{
            mapper.update(eqpEvent);
        }

        if (eqpEvent.getTimeout()!=36000L)
        {
            mapper.updateEqpTimeout(eqpEvent.getEqpId(),eqpEvent.getTimeout());
        }


        //request to Kafka
        STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        Long eqpId=eqpEvent.getEqpId();
        EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
        String eqp_name=eqpWithEtc.getName();
        apacheHttpClientGet.requestReload(eqp_name);

    }

    @Override
    public List<EqpEvent> getEqpEvents(String fabId,Long eqpId) {
        STDEventMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEventMapper.class);
        return mapper.select(eqpId);
    }

    @Override
    public List<EqpEvent> getEqpEventAll(String fabId) {
        STDEventMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEventMapper.class);
        return mapper.selectAll();
    }


    //*********************************************
    //      Conditional Spec Model Management
    //*********************************************
    @Override
    public List<STDEqp> getModels(String fabId) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        return conditionalSpecMapper.selectModelList();
    }

    @Override
    public List<STDConditionalSpec> getConditionsByModel(String fabId, String model) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        List<STDConditionalSpec> conditionsList=conditionalSpecMapper.selectConditionsByModel(model);


        String expressionValue="";
        String[] expression_values=null;
        for (int i = 0; i < conditionsList.size(); i++) {

            expressionValue=conditionsList.get(i).getExpression_value();
            if (expressionValue==null)
            {
                conditionsList.get(i).setExpression_values(expression_values);
            }
            else if(!expressionValue.equals(null))
            {
                conditionsList.get(i).setExpression_values(expressionValue.split(","));
            }

        }

        return conditionsList;
    }

    @Override
    public List<STDConditionalSpec> getSpecByRule(String fabId, String model, Long ruleId) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

            return conditionalSpecMapper.selectParamSpec(model, ruleId);

    }

    @Override
    public List<STDConditionalSpec> getConditionsByModelAndRule(String fabId, String model, String rule) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        return conditionalSpecMapper.selectConditionsByModelAndRule(model, rule);

    }


    //*********************************************
    //      Conditional Spec Eqp Management
    //*********************************************

    @Override
    public List<STDConditionalSpec> getConditionsByEqpId(String fabId, Long eqpId) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        return conditionalSpecMapper.selectConditionsByEqpId(eqpId);

    }

    @Override
    public List<STDConditionalSpec> getSpecByEqpIdAndRule(String fabId, Long eqpId, Long rule) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        Long eqp_spec_link_mst_rawid=conditionalSpecMapper.selectEqpSpecLnkRawId(eqpId,rule);

        if (eqp_spec_link_mst_rawid!=null){
            return conditionalSpecMapper.selectParamSpecByeqpIdAndRule(eqpId, rule,eqp_spec_link_mst_rawid);
        }
        else{
            List<STDConditionalSpec> stdConditionalSpecs=new ArrayList<>();
            return stdConditionalSpecs;
        }

    }

    @Override
    public List<STDConditionalSpec> getAllParametersByModel(String fabId, String model) {
        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        return conditionalSpecMapper.selectParamListByModelName(model);
    }

    @Override
    public void setModel(String fabId, STDConditionalSpec model) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        String userName=model.getUserName();
        Long ruleId=model.getRule_id();
        String ruleName=model.getRule_name();
        String modelName=model.getModel_name();
        String condition=model.getCondition();
        String expression=model.getExpression();
        String description=model.getDescription();
        String expression_value=model.getExpression_value();

        List<STDConditionalSpec> parameter=model.getParameter();

        String param_name=null;
        Double upper_alarm_spec=null;
        Double upper_warning_spec=null;
        Double target=null;
        Double lower_alarm_spec=null;
        Double lower_warning_spec=null;
        String paramDescription=null;
        Long model_param_spec_mst_rawid=null;
        boolean used_yn=false;

        if (ruleId==null) //create
        {
            conditionalSpecMapper.insertConditionalSpec(modelName,ruleName,expression,condition,description,userName,expression_value);

            ruleId=conditionalSpecMapper.selectConditionalSpecRawId(modelName,ruleName);

            for (int j = 0; j < parameter.size(); j++) {
                param_name=parameter.get(j).getParam_name();
                upper_alarm_spec=parameter.get(j).getUpper_alarm_spec();
                upper_warning_spec=parameter.get(j).getUpper_warning_spec();
                target=parameter.get(j).getTarget();
                lower_alarm_spec=parameter.get(j).getLower_alarm_spec();
                lower_warning_spec=parameter.get(j).getLower_warning_spec();
                paramDescription=parameter.get(j).getDescription();
                used_yn=parameter.get(j).isUsed_yn();

                if (used_yn==true) //used가 체크되면 Insert into Model_param_spec_mst_pdm
                {
                    conditionalSpecMapper.insertModelParamSpec(ruleId,  param_name, upper_alarm_spec, upper_warning_spec,target,
                            lower_alarm_spec,lower_warning_spec, paramDescription,userName);
                }

            }






        }
        else //updatae
        {
            conditionalSpecMapper.updateConditionalSpec(ruleId,modelName,ruleName,expression,condition,description,userName, expression_value);

            for (int j = 0; j < parameter.size(); j++) {


                model_param_spec_mst_rawid=parameter.get(j).getModel_param_spec_mst_rawid();
                param_name=parameter.get(j).getParam_name();
                upper_alarm_spec=parameter.get(j).getUpper_alarm_spec();
                upper_warning_spec=parameter.get(j).getUpper_warning_spec();
                target=parameter.get(j).getTarget();
                lower_alarm_spec=parameter.get(j).getLower_alarm_spec();
                lower_warning_spec=parameter.get(j).getLower_warning_spec();
                paramDescription=parameter.get(j).getDescription();
                used_yn=parameter.get(j).isUsed_yn();
                Long checkParam=0L;

                if (used_yn==true) //used가 체크되면 Insert into Model_param_spec_mst_pdm
                {
                    //Model_param_spec_mst_pdm에 paramName이 있는지 없는지 체크
                    //없으면 insert 있으면 update
                    // Insert into Model_param_spec_mst_pdm
                    // update model_param_spec_mst_pdm
                    //conditionalSpecMapper.updateModelParamSpec(modelName,param_name,upper_alarm_spec,upper_warning_spec,target,lower_alarm_spec,lower_warning_spec, paramDescription, userName, model_param_spec_mst_rawid);

                    checkParam=conditionalSpecMapper.selectCheckModelParam(ruleId,param_name);
                    if (checkParam<1){//used_Yn이 treu일때
                        conditionalSpecMapper.insertModelParamSpec(ruleId, param_name, upper_alarm_spec, upper_warning_spec,target, lower_alarm_spec,
                                lower_warning_spec,paramDescription,userName);
                    }
                    else{//스펙만 바뀔때
                        conditionalSpecMapper.updateModelParamSpec(param_name,upper_alarm_spec,upper_warning_spec,target,
                                lower_alarm_spec,lower_warning_spec, paramDescription, userName, model_param_spec_mst_rawid);

                    }

                }
                else if (used_yn==false && model_param_spec_mst_rawid!=null) //used가 false이면 delete Model_param_spec_mst_pdm
                {
                    conditionalSpecMapper.deleteModelParamSpec(model_param_spec_mst_rawid);
                }

            }


        }

        //request to Kafka
        List<Long> eqpIds=conditionalSpecMapper.selectEqpIdListByModelName(modelName);

        for (int i = 0; i < eqpIds.size(); i++) {

            STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
            if (eqpIds.get(i)!=null)
            {
                EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpIds.get(i));
                String eqp_name=eqpWithEtc.getName();
                apacheHttpClientGet.requestReload(eqp_name);
            }

        }

    }

    @Override
    public void deleteModel(String fabId, Long rule) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);
        //request to Kafka
        String modelName=conditionalSpecMapper.selectModelNameByRuleName(rule);
        //

        List<String> paramNameList=conditionalSpecMapper.selectParamNameByRuleId(rule);
        String param_name=null;
        for (int i = 0; i <paramNameList.size() ; i++) {

            param_name=paramNameList.get(i);
            conditionalSpecMapper.deleteModelParamSpecOne(rule, param_name); //delete Model_Param_Spec_Mst_Pdm
        }

        conditionalSpecMapper.deleteConditionalSpec(rule); // delete Conditional_Spec_Mst_Pdm

        //request to Kafka
        List<Long> eqpIds=conditionalSpecMapper.selectEqpIdListByModelName(modelName);

        for (int i = 0; i < eqpIds.size(); i++) {

            STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
            if (eqpIds.get(i)!=null)
            {
                EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpIds.get(i));
                String eqp_name=eqpWithEtc.getName();
                apacheHttpClientGet.requestReload(eqp_name);
            }

        }
        //
    }

    @Override
    public void setEqpRule(String fabId, Long eqpId ,List<STDConditionalSpec> eqpRuleList) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        Long rule_id=null;
        Long ordering=null;
        String description=null;
        String userName=null;
        Long eqp_spec_link_mst_rawid=null;

        boolean used_yn=false;

        for (int i = 0; i < eqpRuleList.size(); i++) {

            rule_id=eqpRuleList.get(i).getRule_id();
            ordering=eqpRuleList.get(i).getOrdering();
            userName=eqpRuleList.get(i).getUserName();
            used_yn=eqpRuleList.get(i).isUsed_yn();
            eqp_spec_link_mst_rawid=eqpRuleList.get(i).getEqp_spec_link_mst_rawid();

//            if (eqp_spec_link_mst_rawid!=null)
//            {
//                used_yn=true;
//            }

            if (used_yn==true)
            {
                //eqp_spec_link_mst_pdm에 있는지 없는지 체크 후에 Insert
                //used tured인 경우
                //1. eqp_spec_link_mst_pdm에 insert
                //2. 해당 해당 파라미터들 param_spec_mst_pdm에 insert

                //1.
                conditionalSpecMapper.deleteEqpSpecLink(eqpId,rule_id);//체크해제했다가 다시 체크하는 경우를 위해서
                conditionalSpecMapper.insertEqpSpecLink(eqpId, rule_id, ordering,  description, userName);

                List<STDConditionalSpec> modelParam=conditionalSpecMapper.selectAppliedEqpParamListByeqpIdAndRule(eqpId,rule_id);

                Long param_id=null;
                String spec_type="MODEL";
                Double upper_alarm_spec=null;
                Double upper_warning_spec=null;
                Double target=null;
                Double lower_alarm_spec=null;
                Double lower_warning_spec=null;
                String modelParamDescription=null;

                for (int j = 0; j < modelParam.size(); j++) {

                    param_id=modelParam.get(j).getParam_id();
                    upper_alarm_spec=modelParam.get(j).getUpper_alarm_spec();
                    upper_warning_spec=modelParam.get(j).getUpper_warning_spec();

                    if (eqp_spec_link_mst_rawid!=null)//체크 된 Param(eqp에만 쓰이는 param일 경우)
                    {
//                        conditionalSpecMapper.deleteParamSpec(eqp_spec_link_mst_rawid);
                    }

                    if (eqp_spec_link_mst_rawid==null && used_yn==true) //체크해제 후 체크
                    {
                        eqp_spec_link_mst_rawid=conditionalSpecMapper.selectEqpSpecLnkRawId(eqpId, rule_id);
                    }

//                    conditionalSpecMapper.insertParamSpec(param_id,eqp_spec_link_mst_rawid,spec_type,upper_alarm_spec,upper_warning_spec,
//                            target,lower_alarm_spec,lower_warning_spec,modelParamDescription,userName);

                }


            }
            else
            {
                //1. param_spec_mst_pdm삭제
                //2. eqp_spec_mst_link_pdm 삭제
                if (eqp_spec_link_mst_rawid!=null)
                {
                    conditionalSpecMapper.deleteParamSpec(eqp_spec_link_mst_rawid);
                }
                conditionalSpecMapper.deleteEqpSpecLink(eqpId,rule_id);
            }

        }

        //request to Kafka
        STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        if (eqpId!=null)
        {
            EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
            String eqp_name=eqpWithEtc.getName();
            apacheHttpClientGet.requestReload(eqp_name);
        }

    }

    @Override
    public void setEqpParamSpec(String fabId, List<STDConditionalSpec> eqpParamSpecList) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);
        STDParamMapper paramMapper=SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);

        //1. Spec 변경시 Param_spec_mst_pdm에 Insert
        //2.
        Long param_id=null;
        String param_name=null;
        Long eqp_spec_link_mst_rawid=null;
        String spec_type="EQP";
        Double eqp_upper_alarm_spec=null;
        Double eqp_upper_warning_spec=null;
        Double target=null;
        Double eqp_lower_alarm_spec=null;
        Double eqp_lower_warning_spec=null;
        String description=null;
        String userName=null;
        Long eqpId=null;
        Long ruleId=null;
        Long model_param_spec_mst_rawid=null;
        boolean used_yn=false;

        for (int i = 0; i < eqpParamSpecList.size(); i++) {

            param_id=eqpParamSpecList.get(i).getParam_id();
            ParamWithCommonWithRpm param=paramMapper.selectOne(param_id);
            param_name=param.getName();

            eqp_spec_link_mst_rawid=eqpParamSpecList.get(i).getEqp_spec_link_mst_rawid();
            eqp_upper_alarm_spec=eqpParamSpecList.get(i).getEqp_upper_alarm_spec();
            eqp_upper_warning_spec=eqpParamSpecList.get(i).getEqp_upper_warning_spec();
            eqp_lower_alarm_spec=eqpParamSpecList.get(i).getEqp_lower_alarm_spec();
            eqp_lower_warning_spec=eqpParamSpecList.get(i).getEqp_lower_warning_spec();
            eqpId=eqpParamSpecList.get(i).getEqp_id();
            ruleId=eqpParamSpecList.get(i).getRule_id();
            description= eqpParamSpecList.get(i).getDescription();
            userName=eqpParamSpecList.get(i).getUserName();
            model_param_spec_mst_rawid=conditionalSpecMapper.selectModelParamSpecMstRawId(ruleId, param_name);
            used_yn=eqpParamSpecList.get(i).isUsed_yn();
//            if (eqp_spec_link_mst_rawid==null) //Model의 스펙을 처음 바꿨을때 param_spec_mst_pdm에 없다면 insert
//            {
//                eqp_spec_link_mst_rawid=conditionalSpecMapper.selectEqpSpecLnkRawId(eqpId,ruleId);
//
//
//            }
            if (eqp_spec_link_mst_rawid==null && used_yn==true) // model의 param인데 수정된 것만 param_spec_mst_pdm에 insert
            {
                eqp_spec_link_mst_rawid=conditionalSpecMapper.selectEqpSpecLnkRawId(eqpId,ruleId);
                conditionalSpecMapper.insertParamSpec(param_id, eqp_spec_link_mst_rawid,  eqp_upper_alarm_spec, eqp_upper_warning_spec,
                        target,eqp_lower_alarm_spec,eqp_lower_warning_spec,description, userName);
            }
            else if (eqp_spec_link_mst_rawid!=null && used_yn==true) //이미 eqp param이지만 spec을 변경할때
            {
                conditionalSpecMapper.updateParamSpec( eqp_upper_alarm_spec, eqp_upper_warning_spec, eqp_lower_alarm_spec, eqp_lower_warning_spec,
                        param_id, eqp_spec_link_mst_rawid);
            }
//            if (eqp_spec_link_mst_rawid==null) //모델정보
//            {
//                conditionalSpecMapper.updateModelParamSpec(param_name, eqp_upper_alarm_spec, eqp_upper_warning_spec, target,
//                        eqp_lower_alarm_spec, eqp_lower_warning_spec, description, userName, model_param_spec_mst_rawid );
//            }
            else if (eqp_spec_link_mst_rawid!=null && used_yn==false)//이미 eqp spec값을 바꾼 것이라면 (param_spec_mst_pdm에 이미 있다면) update
            {
                conditionalSpecMapper.updateParamSpec( eqp_upper_alarm_spec, eqp_upper_warning_spec, eqp_lower_alarm_spec, eqp_lower_warning_spec,
                        param_id, eqp_spec_link_mst_rawid);
            }

            //request to Kafka
            STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
            if (eqpId!=null)
            {
                EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
                String eqp_name=eqpWithEtc.getName();
                apacheHttpClientGet.requestReload(eqp_name);
            }

        }
    }

    @Override
    public void revertToModelSpec(String fabId, String param_name, Long eqp_spec_link_mst_rawid) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);


        conditionalSpecMapper.deleteParamSpecOne(eqp_spec_link_mst_rawid, param_name);

        //request to Kafka
        Long eqpId=conditionalSpecMapper.selectEqpIdByEqpSpecMstRawId(eqp_spec_link_mst_rawid);

        STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        if (eqpId!=null)
        {
            EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
            String eqp_name=eqpWithEtc.getName();
            apacheHttpClientGet.requestReload(eqp_name);
        }

    }

    @Override
    public STDConditionalSpec getModelEqpSpec(String fabId, String param_name, Long eqp_spec_link_mst_rawid, Long rule_id) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);
        return conditionalSpecMapper.selectModelEqpParamSpec(eqp_spec_link_mst_rawid, param_name, rule_id);

    }


}
