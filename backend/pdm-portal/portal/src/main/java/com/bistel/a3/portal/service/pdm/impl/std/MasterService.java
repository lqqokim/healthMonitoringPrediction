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
import com.bistel.a3.portal.service.pdm.IMasterService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.TransactionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

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
        paramWithCommonWithRpm.setAlarm(overallSpec.getAlarm());
        paramWithCommonWithRpm.setWarn(overallSpec.getWarn());
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
    public void setParam(String fabId, ParamWithCommonWithRpm param) {
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
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
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
    }




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


}
