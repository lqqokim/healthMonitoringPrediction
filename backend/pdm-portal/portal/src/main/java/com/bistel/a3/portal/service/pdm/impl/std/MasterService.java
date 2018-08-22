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
        OverallSpec overallSpec=paramDataMapper.selectTraceDataSpec(fromParamId);

//        paramDataMapper.insertSpec(toParamId, overallSpec.getAlarm(),overallSpec.getWarn());
        ParamWithCommonWithRpm paramWithCommonWithRpm = new ParamWithCommonWithRpm();
        paramWithCommonWithRpm.setUserName(userName);
        paramWithCommonWithRpm.setParam_id(toParamId);
        
        if (overallSpec != null) {
        	paramWithCommonWithRpm.setAlarm(overallSpec.getAlarm());
        	paramWithCommonWithRpm.setWarn(overallSpec.getWarn());
        }        
        
        paramDataMapper.insertSpec(paramWithCommonWithRpm);
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
    public void setParam(String fabId, Long eqpId , ParamWithCommonWithRpm param) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            if(param.getParam_id() == null) {
                mapper.insertOne(param);
//                if(param.getRpm()!=null){
//                    mapper.insertRpmOne(param);
//                }

//                mapper.insertCommonOne(param);
                if(param.getAlarm()!=null && param.getWarn()!=null){
                    mapper.insertSpec(param);
                    this.updateParamHealth(fabId, eqpId, param.getParam_id()); //추후 삭제(UI 부재)

                }



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
                    Spec spec = mapper.selectSpec(param.getParam_id());
                    if(spec!=null) {
                        mapper.updateSpec(param);

                    }else{
                        mapper.insertSpec(param);
                        this.updateParamHealth(fabId, eqpId, param.getParam_id()); //추후 삭제(UI 부재)
                    }
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
//            mapper.deleteCommonOne(paramId);
//            mapper.deleteRpmOne(paramId);
            mapper.deleteOne(paramId);
            mapper.deleteSpec(paramId);
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
    public void updateParamHealth(String fabId, Long eqpId, Long paramId){


        STDEtcMapper stdEtcMapper=SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);
        List<STDParamHealth> paramHealths=stdEtcMapper.selectParamHealth(eqpId, paramId);


        for (int i = 0; i < paramHealths.size(); i++) {

            Long param_health_mst_rawid=paramHealths.get(i).getParam_health_mst_rawid();
            Long param_mst_rawid=paramHealths.get(i).getParam_mst_rawid();
            Long health_logic_mst_rawid=paramHealths.get(i).getHealth_logic_mst_rawid();
            String apply_logic_yn=paramHealths.get(i).getApply_logic_yn();

            stdEtcMapper.insertParamHealth(param_health_mst_rawid, param_mst_rawid, health_logic_mst_rawid, apply_logic_yn); // param_health_mst_pdm에 Insert
            stdEtcMapper.insertParamHealthOptionTotal(param_health_mst_rawid); // param_health_option_mst_pdm 에 Insert
            stdEtcMapper.insertParamHealthOptionSpecific(param_health_mst_rawid); // param_health_option_mst_pdm 에 Insert



        }

        //request to Kafka
        STDEqpMapper eqpMapper= SqlSessionUtil.getMapper(sessions, fabId, STDEqpMapper.class);
        EqpWithEtc eqpWithEtc=eqpMapper.selectOne(eqpId);
        String eqp_name=eqpWithEtc.getName();
        apacheHttpClientGet.requestReload(eqp_name);


    }

    @Override
    public void deleteParamHealth(String fabId, Long eqpId, Long paramId){

        STDEtcMapper stdEtcMapper=SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);
        List<STDParamHealth> paramHealthMstAndOptionRawId=stdEtcMapper.selectParamHealthOption(paramId);

        Long optionRawId=null;
        for (int i = 0; i < paramHealthMstAndOptionRawId.size(); i++) {

            optionRawId=paramHealthMstAndOptionRawId.get(i).getParam_health_option_mst_rawid();
            stdEtcMapper.deleteParamHealthOptionMstPdmByRawId(optionRawId);
        }
        Long paramHealthMstRawId=paramHealthMstAndOptionRawId.get(0).getParam_health_mst_rawid();
        stdEtcMapper.deleteParamHealthMstPdmByRawId(paramHealthMstRawId);


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


//        STDConditionalSpec conditionalSpec=new STDConditionalSpec();

//        JSONParser jsonParser=null;
//
//        String condition=null;
//        for(int i=0; i<conditionsList.size(); i++){
//            condition=conditionsList.get(i).getCondition();
//            condition="{\"condition\":[{\"param_name\":\"ADP Speed\", \"operand\":\">=\", \"param_value\":50},{\"param_name\":\"Roots1 W\", \"operand\":\">\", \"param_value\":1000}]}";
//            condition="[{param_name:\"ADP Speed\", operand:\">=\", param_value:50},{param_name:\"Roots1 W\", operand:\">\", param_value:1000}]";

//            condition="{\"param_name\":\"ADP Speed\", \"operand\":\">=\", \"param_value\":50},{\"param_name\":\"Roots1 W\", \"operand\":\">\", \"param_value\":1000}";
//            String[] conditionArray=condition.split("}");
//
//            jsonParser=new JSONParser();
//            try {
//                JSONObject jsonObject=(JSONObject) jsonParser.parse(condition);
//
//                conditionsList.get(i).setConditionsJSON(jsonObject);
//            } catch (net.bitnine.agensgraph.deps.org.json.simple.parser.ParseException e) {
//                e.printStackTrace();
//            }
//            System.out.println("Hi");
//        }

//        String expression=null;
//        String expressionValue=null;
//        for(int i=0; i<conditionsList.size(); i++){
//            expression=conditionsList.get(i).getExpression();
//            expressionValue=conditionsList.get(i).getExpression_value();
//            String[] expressionValueArray=expressionValue.split(",");
//            int expressionArguSize=expressionValueArray.length;
//
//            for (int j = 0; j < expressionArguSize; j++) {
//                int idx=expression.indexOf("p"+i);
//            }
//
//        }

        String expressionValue=null;
        for (int i = 0; i < conditionsList.size(); i++) {

            expressionValue=conditionsList.get(i).getExpression_value();
            conditionsList.get(i).setExpression_values(expressionValue.split(","));

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
    public List<STDConditionalSpec> getSpecByEqpIdAndRule(String fabId, Long eqpId, String rule) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        return conditionalSpecMapper.selectParamSpecByeqpIdAndRule(eqpId, rule);

    }

    @Override
    public List<STDConditionalSpec> getAllParametersByModel(String fabId, String model) {
        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        return conditionalSpecMapper.selectParamListByModelName(model);
    }

    @Override
    public void setModel(String fabId, List<STDConditionalSpec> model) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);


        String userName=null;
        Long ruleId=null;
        String ruleName=null;
        String modelName=null;
        String condition=null;
        String expression=null;
        String description=null;
        String expression_value=null;

        for (int i = 0; i < model.size(); i++) {
            userName=model.get(i).getUserName();
            ruleId=model.get(i).getRule_id();
            ruleName=model.get(i).getRule_name();
            modelName=model.get(i).getModel_name();
            condition=model.get(i).getCondition();
            expression=model.get(i).getExpression();
            expression_value=model.get(i).getExpression_value();

            List<STDConditionalSpec> parameter=model.get(i).getParameter();

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
                        conditionalSpecMapper.insertModelParamSpec(ruleId, modelName, param_name,upper_alarm_spec, upper_warning_spec,target,
                                lower_alarm_spec,lower_warning_spec, paramDescription,userName);
                    }

                }

            }
            else //updatae
            {
                conditionalSpecMapper.updateConditionalSpec(ruleId,modelName,ruleName,expression,condition,description,userName);

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

                    if (used_yn==true) //used가 체크되면 Insert into Model_param_spec_mst_pdm
                    {
                        conditionalSpecMapper.updateModelParamSpec(modelName,param_name,upper_alarm_spec,upper_warning_spec,target,lower_alarm_spec,lower_warning_spec, paramDescription, userName, model_param_spec_mst_rawid);
                    }
                    else //used가 false이면 delete Model_param_spec_mst_pdm
                    {
                        conditionalSpecMapper.deleteModelParamSpec(model_param_spec_mst_rawid);
                    }

                }
            }


        }


    }

    @Override
    public void deleteModel(String fabId, Long rule) {

        STDConditionalSpecMapper conditionalSpecMapper=SqlSessionUtil.getMapper(sessions, fabId, STDConditionalSpecMapper.class);

        conditionalSpecMapper.deleteModelParamSpec(rule); //delete Model_Param_Spec_Mst_Pdm
        conditionalSpecMapper.deleteConditionalSpec(rule); // delete Conditional_Spec_Mst_Pdm


    }


}
