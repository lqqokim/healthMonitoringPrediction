package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.pdm.EqpWithArea;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.AreaWithChildren;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import com.bistel.a3.portal.domain.pdm.master.PartWithParam;
import com.bistel.a3.portal.domain.pdm.std.master.STDConditionalSpec;
import com.bistel.a3.portal.domain.pdm.std.master.STDEqp;

import java.util.List;

public interface IMasterService {
    //***************
    //     Area
    //***************
    List<AreaWithChildren> getAreas(String fabId, Long parentId);

    Area getArea(String fabId, Long areaId);
    List<Area> getAreaAll(String fabId);

    void setArea(String fabId, Area area);

    void removeArea(String fabId, Long areaId);

    //***************
    //   Bearing
    //***************
    List<Bearing> getBearings(String fabId);

    Bearing getBearing(String fabId, String modelNumber, String manufacture);

    void setBearing(String fabId, Bearing bearing);

    void removeBearing(String fabId, String modelNumber, String manufacture);

    //***************
    //   Code
    //***************
    List<Code> getCode(String app, String codeCategory, Boolean useYn);

    String getCode(List<Code> codes, String cd);

    //***************
    //   Eqp
    //***************
    List<EqpWithEtc> getEqps(String fabId, Long areaId);

    List<EqpWithArea> getEqpsByAreaIds(String fabId, List<Long> areaIds);

    EqpWithEtc getEqp(String fabId, Long areaId, Long eqpId);

    void removeEqps(String fabId, Long areaId, Long[] eqpIds);

    void setEqp(String fabId, EqpWithEtc eqp);

    void removeEqp(String fabId, Long areaId, Long eqpId);

    void eqpCopy(String userName,String fabId, Long fromEqpId, List<String> toEqpNames);

    //***************
    //   Parameter
    //***************
    List<String> getParamNamesByEqps(String fabId,List<Long> eqpIds);

    List<ParamWithCommonWithRpm> getParams(String fabId, Long eqpId);

    ParamWithCommonWithRpm getParam(String fabId, Long paramId);

    void setParam(String fabId, Long eqpId ,  ParamWithCommonWithRpm param);

    void removeParam(String fabId, Long eqpId, Long paramId);

    void removeParams(String fabId, Long eqpId, Long[] paramIds);

    void updateParamHealth(String fabId, Long eqpId, Long paramId);

    void deleteParamHealth(String fabId, Long eqpId, Long paramId);

    //***************
    //   Parts
    //***************
    List<PartType> getPartTypes(String fabId);

    List<PartWithParam> getParts(String fabId, Long eqpId);

    PartWithParam getPart(String fabId, Long partId);

    void removeParts(String fabId, Long eqpId, Long[] partIds);

    void setPart(String fabId, PartWithParam part);

    void removePart(String fabId, Long eqpId, Long partId);

    Param getSpeedParam(String fabId, Long eqpId);


    //***************
    //   Eqp Event
    //***************
    void setEpqEvent(String fabId,EqpEvent eqpEvent);
    List<EqpEvent> getEqpEvents(String fabId,Long eqpId);
    List<EqpEvent> getEqpEventAll(String fabId);


    //***************************************************
    //   Conditional Spec Model Management
    //***************************************************
    List<STDEqp> getModels(String fabId);

    List<STDConditionalSpec> getConditionsByModel(String fabId, String model);

    List<STDConditionalSpec> getSpecByRule(String fabId, String model, String rule);

    List<STDConditionalSpec> getConditionsByModelAndRule(String fabId, String model, String rule);

    //*********************************************
    //      Conditional Spec EQP Management
    //*********************************************

    List<STDConditionalSpec> getConditionsByEqpId(String fabId, Long eqpId);

    List<STDConditionalSpec> getSpecByEqpIdAndRule(String fabId, Long eqpId, String rule);

    List<STDConditionalSpec> getAllParametersByModel(String fabId, String model);

    List<STDConditionalSpec> setModel(String fabId, STDConditionalSpec model);

}
