package com.bistel.a3.portal.dao.pdm.ulsan.master;

import com.bistel.a3.portal.domain.pdm.ParamClassificationData;
import com.bistel.a3.portal.domain.pdm.EqpStatusData;
import com.bistel.a3.portal.domain.pdm.db.Eqp;
import com.bistel.a3.portal.domain.pdm.db.EqpEtc;
import com.bistel.a3.portal.domain.pdm.master.EqpWithEtc;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface EqpMapper {
    List<EqpWithEtc> selectList(@Param("areaId") Long areaId);

    EqpWithEtc selectOne(@Param("eqpId") Long eqpId);

    void deleteOne(@Param("eqpId") Long eqpId);

    void insertOne(Eqp eqp);

    void updateOne(Eqp eqp);

    void insertEtcOne(EqpWithEtc eqp);

    void updateEtcOne(EqpWithEtc eqp);

    void deleteEtcOne(@Param("eqpId") Long eqpId);

    EqpEtc selectEtcOne(Long eqp_id);

    List<EqpStatusData> selectAlarmWarningEqps(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);

    List<EqpStatusData> selectGoodFiveEqps(@Param("start") Date start, @Param("end") Date end);

    List<EqpStatusData> selectBadFiveEqps(@Param("start") Date start, @Param("end") Date end);

    List<ParamClassificationData> selectRadar(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);
}
