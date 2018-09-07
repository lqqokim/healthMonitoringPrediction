package com.bistel.a3.portal.service.pdm.impl.ulsan;

import com.bistel.a3.portal.dao.common.CodeMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.ParamDataMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.master.*;
import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.pdm.EqpWithArea;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.*;
import com.bistel.a3.portal.domain.pdm.std.master.STDConditionalSpec;
import com.bistel.a3.portal.domain.pdm.std.master.STDEqp;
import com.bistel.a3.portal.service.pdm.IMasterService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.TransactionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnExpression("!${run.standard}")
public class MasterService implements IMasterService {
    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    @Autowired
    private CodeMapper codeMapper;

    //***************
    //     Area
    //***************
    @Override
    public List<AreaWithChildren> getAreas(String fabId, Long parentId) {
        AreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, AreaMapper.class);
        return getAreaTree(mapper, parentId);
    }
    private List<AreaWithChildren> getAreaTree(AreaMapper mapper, Long parentId) {
        List<AreaWithChildren> list = mapper.selectList(parentId);
        for(AreaWithChildren l : list) {
            l.setChildren(getAreaTree(mapper, l.getArea_id()));
        }
        return list;
    }
    @Override
    public Area getArea(String fabId, Long areaId) {
        AreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, AreaMapper.class);
        return mapper.selectOne(areaId);
    }

    @Override
    public List<Area> getAreaAll(String fabId) {
        return null;
    }

    @Override
    public void setArea(String fabId, Area area) {
        AreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, AreaMapper.class);
        if(area.getArea_id() == null) {
            mapper.insertOne(area);
        } else {
            mapper.updateOne(area);
        }
    }
    @Override
    public void removeArea(String fabId, Long areaId) {
        AreaMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, AreaMapper.class);
        mapper.deleteOne(areaId);
    }


    //***************
    //   Bearing
    //***************
    @Override
    public List<Bearing> getBearings(String fabId) {
        BearingMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, BearingMapper.class);
        return mapper.selectList();
    }
    @Override
    public Bearing getBearing(String fabId, String modelNumber, String manufacture) {
        BearingMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, BearingMapper.class);
        return mapper.selectOne(modelNumber, manufacture);
    }
    @Override
    public void setBearing(String fabId, Bearing bearing) {
        BearingMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, BearingMapper.class);
        Bearing b = mapper.selectOne(bearing.getModel_number(), bearing.getManufacture());
        if(b == null) {
            mapper.insertOne(bearing);
        } else {
            mapper.updateOne(bearing);
        }
    }
    @Override
    public void removeBearing(String fabId, String modelNumber, String manufacture) {
        BearingMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, BearingMapper.class);
        mapper.deleteOne(modelNumber, manufacture);
    }


    //***************
    //   Code
    //***************
    @Override
    public List<Code> getCode(String app, String codeCategory, Boolean useYn) {
        return codeMapper.selectByCategoryName(app, codeCategory, useYn);
    }
    @Override
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
    @Override
    public List<EqpWithEtc> getEqps(String fabId, Long areaId) {
        EqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, EqpMapper.class);
        return mapper.selectList(areaId);
    }

    @Override
    public List<EqpWithArea> getEqpsByAreaIds(String fabId, List<Long> areaIds) {
        return null;
    }

    @Override
    public EqpWithEtc getEqp(String fabId, Long areaId, Long eqpId) {
        EqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, EqpMapper.class);
        return mapper.selectOne(eqpId);
    }
    @Override
    public void removeEqps(String fabId, Long areaId, Long[] eqpIds) {
        EqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, EqpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for (Long eqpId : eqpIds) {
                mapper.deleteEtcOne(eqpId);
                mapper.deleteOne(eqpId);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
//    @Override
//    public void setEqp(String fabId, EqpWithEtc eqp) {
//        EqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, EqpMapper.class);
//        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
//        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
//        try {
//            if(eqp.getEqp_id() == null) {
//                mapper.insertOne(eqp);
//                mapper.insertEtcOne(eqp);
//            } else {
//                mapper.updateOne(eqp);
//                mapper.updateEtcOne(eqp);
//            }
//            manager.commit(status);
//        } catch (Exception e) {
//            manager.rollback(status);
//            throw new RuntimeException(e.getMessage());
//        }
//    }
//    @Override
//    public void removeEqp(String fabId, Long areaId, Long eqpId) {
//        EqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, EqpMapper.class);
//        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
//        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
//        try {
//            mapper.deleteEtcOne(eqpId);
//            mapper.deleteOne(eqpId);
//            manager.commit(status);
//        } catch (Exception e) {
//            manager.rollback(status);
//            throw new RuntimeException(e.getMessage());
//        }
//    }


    private HashMap<Long,Long> copyParameters(String fabId,Long fromEqpId, Eqp eqp) {

        ParamMapper paramMapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        List<ParamWithCommonWithRpm> paramWithCommonWithRpms= paramMapper.selectList(fromEqpId);

        HashMap<Long, Long> fromParamToParam=new HashMap<>();

        for (int j = 0; j < paramWithCommonWithRpms.size(); j++) {

            ParamWithCommonWithRpm paramWithCommonWithRpm=paramWithCommonWithRpms.get(j);

            Long fromParamId=paramWithCommonWithRpm.getParam_id();

            paramWithCommonWithRpm.setEqp_id(eqp.getEqp_id());
            paramMapper.insertOne(paramWithCommonWithRpm);

            Long toParamId=paramWithCommonWithRpm.getParam_id();

            fromParamToParam.put(fromParamId,toParamId);
            copySpec(fabId, fromParamId, toParamId);

        }

        return fromParamToParam;
    }



    //***************
    //   Parameter
    //***************
    @Override
    public List<ParamWithCommonWithRpm> getParams(String fabId, Long eqpId) {
        ParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        return mapper.selectList(eqpId);
    }

    @Override
    public ParamWithCommonWithRpm getParam(String fabId, Long paramId) {
        ParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        return mapper.selectOne(paramId);
    }



    @Override
    public void setParam(String fabId, Long eqpId ,ParamWithCommonWithRpm param, String userName) {
        ParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            if(param.getParam_id() == null) {
                mapper.insertOne(param);
                mapper.insertRpmOne(param);
                mapper.insertCommonOne(param);

                mapper.insertSpec(param);


            } else {
                mapper.updateOne(param);
                mapper.updateRpmOne(param);
                mapper.updateCommonOne(param);

                mapper.updateSpec(param);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    @Override
    public void removeParam(String fabId, Long eqpId, Long paramId) {
        ParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            mapper.deleteCommonOne(paramId);
            mapper.deleteRpmOne(paramId);
            mapper.deleteOne(paramId);
            mapper.deleteSpec(paramId);

            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    @Override
    public void removeParams(String fabId, Long eqpId, Long[] paramIds) {
        ParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for (Long paramId : paramIds) {
                this.removeParam(fabId,eqpId,paramId);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void updateParamHealth(String fabId, Long eqpId, Long paramId, String UserName) {

    }


    @Override
    public void deleteParamHealth(String fabId, Long eqpId, Long paramId) {

    }


    //***************
    //   Parts
    //***************
    @Override
    public List<PartType> getPartTypes(String fabId) {
        PartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, PartMapper.class);
        return mapper.selectTypeList();
    }
    @Override
    public List<PartWithParam> getParts(String fabId, Long eqpId) {
        PartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, PartMapper.class);
        return mapper.selectList(eqpId);
    }
    @Override
    public PartWithParam getPart(String fabId, Long partId) {
        PartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, PartMapper.class);
        return mapper.selectOne(partId);
    }
    @Override
    public void removeParts(String fabId, Long eqpId, Long[] partIds) {
        PartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, PartMapper.class);
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
    @Override
    public void setPart(String fabId, PartWithParam part) {
        PartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, PartMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            if(part.getPart_id() == null) {
                mapper.insertOne(part);
            } else {
                mapper.deleteLnk(part.getPart_id());
                mapper.updateOne(part);
            }
            if(part.getParam_id() != null) {
                mapper.insertLnk(part);
            }

            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    @Override
    public void removePart(String fabId, Long eqpId, Long partId) {
        PartMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, PartMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            mapper.deleteLnk(partId);
            mapper.deleteOne(partId);
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    @Override
    public Param getSpeedParam(String fabId, Long eqpId) {
        ParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        return mapper.selectSpeedParam(eqpId);
    }

    @Override
    public void setEpqEvent(String fabId, EqpEvent eqpEvent) {

    }

    @Override
    public List<EqpEvent> getEqpEvents(String fabId, Long eqpId) {
        return null;
    }

    @Override
    public List<EqpEvent> getEqpEventAll(String fabId) {
        return null;
    }

    @Override
    public List<STDEqp> getModels(String fabId) {
        return null;
    }

    @Override
    public List<STDConditionalSpec> getConditionsByModel(String fabId, String model) {
        return null;
    }

    @Override
    public List<STDConditionalSpec> getSpecByRule(String fabId, String model, Long rule) {
        return null;
    }

    @Override
    public List<STDConditionalSpec> getConditionsByModelAndRule(String fabId, String model, String rule) {
        return null;
    }

    @Override
    public List<STDConditionalSpec> getConditionsByEqpId(String fabId, Long eqpId) {
        return null;
    }

    @Override
    public List<STDConditionalSpec> getSpecByEqpIdAndRule(String fabId, Long eqpId, Long rule) {
        return null;
    }

    @Override
    public List<STDConditionalSpec> getAllParametersByModel(String fabId, String model) {
        return null;
    }

    @Override
    public void setModel(String fabId, STDConditionalSpec model) {

    }

    @Override
    public void deleteModel(String fabId, Long rule) {

    }

    @Override
    public void setEqpRule(String fabId, Long eqpId ,List<STDConditionalSpec> eqpRuleList) {

    }

    @Override
    public void setEqpParamSpec(String fabId, List<STDConditionalSpec> eqpParamSpecList) {

    }

    @Override
    public void revertToModelSpec(String fabId, String param_name, Long eqp_spec_link_mst_rawid) {

    }

    @Override
    public STDConditionalSpec getModelEqpSpec(String fabId, String param_name, Long eqp_spec_link_mst_rawid, Long rule_id) {
        return null;
    }


    @Override
    public void eqpCopy(String userName,String fabId, Long fromEqpId, List<String> toEqpNames) {


        EqpMapper eqpMapper = SqlSessionUtil.getMapper(sessions, fabId, EqpMapper.class);

        EqpWithEtc eqpWithEtc=eqpMapper.selectOne(fromEqpId);

        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

        try {
            for (int i = 0; i < toEqpNames.size(); i++)
            {
                Eqp eqp=new Eqp();
                eqp.setArea_id(eqpWithEtc.getArea_id());
                eqp.setName(toEqpNames.get(i));
                eqp.setData_type(eqpWithEtc.getData_type());

                eqpMapper.insertOne(eqp);

                HashMap<Long,Long> fromParamToParam=copyParameters(fabId,fromEqpId, eqp);
                HashMap<Long,Long> fromPartsToParts=copyParts(fabId, fromEqpId, eqp);

                copyParamPartsLink(fabId, fromParamToParam, fromPartsToParts);

            }

            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }




    }

    @Override
    public List<String> getParamNamesByEqps(String fabId, List<Long> eqpIds) {
        return null;
    }

    private void copyParamPartsLink(String fabId, HashMap<Long, Long> fromParamToParam, HashMap<Long, Long> fromPartsToParts) {

        PartMapper partMapper=SqlSessionUtil.getMapper(sessions, fabId, PartMapper.class);


        for(Long fromPartId:fromPartsToParts.keySet()){

            PartWithParam partWithParam=partMapper.selectOne(fromPartId);
            Long fromParam=partWithParam.getParam_id();
            if(fromParam!=null)
            {
                Long toParam=fromParamToParam.get(fromParam);
                Long toParts=fromPartsToParts.get(fromPartId);

                PartWithParam partWithParam1=new PartWithParam();
                partWithParam1.setParam_id(toParam);
                partWithParam1.setPart_id(toParts);

                partMapper.insertLnk(partWithParam1);


            }

        }
    }


    private HashMap<Long,Long> copyParts(String fabId, Long fromEqpId, Eqp eqp) {

        PartMapper partMapper=SqlSessionUtil.getMapper(sessions, fabId, PartMapper.class);
        List<PartWithParam> partWithParams=partMapper.selectList(fromEqpId);

        HashMap<Long,Long> fromPartsToParts=new HashMap<>();

        for (int i = 0; i < partWithParams.size(); i++) {

            PartWithParam partWithParam=partWithParams.get(i);
            Long fromParts=partWithParam.getPart_id();

            partWithParam.setEqp_id(eqp.getEqp_id());

            partMapper.insertOne(partWithParam);

            Long toParts=partWithParam.getPart_id();

            fromPartsToParts.put(fromParts,toParts);
        }

        return fromPartsToParts;
    }



    private void copySpec(String fabId, Long fromParamId, Long toParamId) {

        ParamDataMapper paramDataMapper=SqlSessionUtil.getMapper(sessions, fabId, ParamDataMapper.class);
        OverallSpec overallSpec=paramDataMapper.selectOverallSpec(fromParamId);


        paramDataMapper.insertSpec(toParamId, overallSpec.getAlarm(),overallSpec.getWarn());




    }

    private void copyRpm(String fabId, Long fromParamId, Long toParamId){
        ParamDataMapper paramDataMapper=SqlSessionUtil.getMapper(sessions, fabId, ParamDataMapper.class);


        ParamMapper paramMapper=SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);
        ManualRpm manualRpm=paramDataMapper.selectRpm(fromParamId);

        if(manualRpm!=null)
        {
            ParamWithCommonWithRpm paramWithCommonWithRpm=new ParamWithCommonWithRpm();

            paramWithCommonWithRpm.setParam_id(toParamId);
            if(manualRpm.getRpm()==null){
                paramWithCommonWithRpm.setRpm(null);
            }else {
                paramWithCommonWithRpm.setRpm(Integer.valueOf(manualRpm.getRpm().toString()));
            }

            paramMapper.insertRpmOne(paramWithCommonWithRpm);

        }
    }

    private void copyCommon(String fabId, Long fromParamId, Long toParamId){
        ParamDataMapper paramDataMapper=SqlSessionUtil.getMapper(sessions, fabId, ParamDataMapper.class);
        ParamMapper paramMapper=SqlSessionUtil.getMapper(sessions, fabId, ParamMapper.class);

        ParamWithCommon paramWithCommon=paramDataMapper.selectCommon(fromParamId);
        if(paramWithCommon!=null)
        {
            ParamWithCommonWithRpm paramWithCommonWithRpm=new ParamWithCommonWithRpm();

            paramWithCommonWithRpm.setParam_id(toParamId);
            paramWithCommonWithRpm.setEu(paramWithCommon.getEu());
            paramWithCommonWithRpm.setEu_type(paramWithCommon.getEu_type());

            paramMapper.insertCommonOne(paramWithCommonWithRpm);
        }
    }

    @Override
    public void setEqp(String fabId, EqpWithEtc eqp) {
        EqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, EqpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            if(eqp.getEqp_id() == null) {
                mapper.insertOne(eqp);
                mapper.insertEtcOne(eqp);
            } else {
                mapper.updateOne(eqp);
                mapper.updateEtcOne(eqp);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void removeEqp(String fabId, Long areaId, Long eqpId) {
        EqpMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, EqpMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            mapper.deleteEtcOne(eqpId);
            mapper.deleteOne(eqpId);
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
}
