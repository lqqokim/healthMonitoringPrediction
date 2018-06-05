package com.bistel.a3.portal.dao.pdm.std.master;

import com.bistel.a3.portal.domain.pdm.EqpInfo;
import com.bistel.a3.portal.domain.pdm.EqpWithArea;
import com.bistel.a3.portal.domain.pdm.ParamClassificationData;
import com.bistel.a3.portal.domain.pdm.EqpStatusData;
import com.bistel.a3.portal.domain.pdm.db.Eqp;
import com.bistel.a3.portal.domain.pdm.db.EqpEtc;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface STDEqpMapper {
    List<EqpWithEtc> selectList(@Param("areaId") Long areaId);

    EqpWithEtc selectOne(@Param("eqpId") Long eqpId);

    void deleteOne(@Param("eqpId") Long eqpId);
    void deleteParambyEqp(@Param("eqpId") Long eqpId);
    void deletePartsbyEqp(@Param("eqpId") Long eqpId);

    void insertOne(Eqp eqp);

    void updateOne(Eqp eqp);

    void insertEtcOne(EqpWithEtc eqp);

    void updateEtcOne(EqpWithEtc eqp);

    void deleteEtcOne(@Param("eqpId") Long eqpId);

    EqpEtc selectEtcOne(Long eqp_id);


    EqpInfo selectEqpInfo(@Param("eqp_id") Long eqp_id);

    Eqp selectEqpById(@Param("eqpId") Long eqpId);

    Eqp selectEqpByMeasureTrxId(@Param("measureTrxId") Long measureTrxId);

    List<Eqp> selectEqps();

    List<EqpWithArea> selectEqpsByArea(@Param("area_id") Long area_id);

    List<EqpWithEtc> selectList4(@Param("areaId") Long areaId);

    List<EqpWithEtc> selectList100(@Param("areaId") Long areaId);

    List<EqpWithEtc> selectList9(@Param("areaId") Long areaId);

    List<EqpWithEtc> selectListDemoAll(@Param("areaId") Long areaId);

    List<EqpWithEtc> selectList200(@Param("areaId") Long areaId);

    List<EqpWithEtc> selectList300(@Param("areaId") Long areaId);

    List<EqpWithEtc> selectList400(@Param("areaId") Long areaId);

    List<EqpWithEtc> selectList500(@Param("areaId") Long areaId);





}
