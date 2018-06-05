package com.bistel.a3.portal.dao.pdm.ulsan.master;

import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ParamMapper {
    List<com.bistel.a3.portal.domain.pdm.db.Param> selectByEqpId(@Param("eqpId") Long eqpId);

    List<ParamWithCommonWithRpm> selectList(@Param("eqpId") Long eqpId);

    ParamWithCommonWithRpm selectOne(@Param("paramId") Long paramId);

    void insertOne(ParamWithCommonWithRpm eqp);


    void insertRpmOne(ParamWithCommonWithRpm eqp);

    void insertCommonOne(ParamWithCommonWithRpm eqp);

    void updateOne(ParamWithCommonWithRpm eqp);

    void updateRpmOne(ParamWithCommonWithRpm eqp);

    void updateCommonOne(ParamWithCommonWithRpm eqp);

    void deleteOne(@Param("paramId") Long paramId);

    void deleteRpmOne(@Param("paramId") Long paramId);

    void deleteCommonOne(@Param("paramId") Long paramId);

    void deleteSpec(@Param("paramId") Long param_id);

    void insertSpec(ParamWithCommonWithRpm eqp);

    void updateSpec(ParamWithCommonWithRpm eqp);

    com.bistel.a3.portal.domain.pdm.db.Param selectSpeedParam(@Param("eqpId") Long eqpId);
}
