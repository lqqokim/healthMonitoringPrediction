package com.bistel.a3.portal.dao.pdm.std.master;

import com.bistel.a3.portal.domain.pdm.Spec;
import com.bistel.a3.portal.domain.pdm.db.ManualRpm;
import com.bistel.a3.portal.domain.pdm.db.OverallSpec;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface STDParamMapper {
    List<com.bistel.a3.portal.domain.pdm.db.Param> selectByEqpId(@Param("eqpId") Long eqpId);

    List<ParamWithCommonWithRpm> selectList(@Param("eqpId") Long eqpId);

    ParamWithCommonWithRpm selectOne(@Param("paramId") Long paramId);

    com.bistel.a3.portal.domain.pdm.db.Param selectSpeedParam(@Param("eqpId") Long eqpId);

    void insertOne(ParamWithCommonWithRpm eqp);

    Long selectMaxParamRawId();

    void insertSpec(ParamWithCommonWithRpm eqp);

    void insertRpmOne(ParamWithCommonWithRpm eqp);

    void insertCommonOne(ParamWithCommonWithRpm eqp);

    void updateOne(ParamWithCommonWithRpm eqp);

    void updateSpec(ParamWithCommonWithRpm eqp);

    void updateRpmOne(ParamWithCommonWithRpm eqp);

    void updateCommonOne(ParamWithCommonWithRpm eqp);

    void deleteOne(@Param("paramId") Long paramId);

    void deleteRpmOne(@Param("paramId") Long paramId);

    void deleteCommonOne(@Param("paramId") Long paramId);

    void deleteSpec(@Param("param_id") Long param_id);

    List<com.bistel.a3.portal.domain.pdm.db.Param> selectParamEqpList();

    List<com.bistel.a3.portal.domain.pdm.db.Param> selectEqpList();

    @MapKey("param_id")
    Map<Long, ManualRpm> selectManualRpm();
    ManualRpm  selectManualRpmByParamId(@Param("param_id") Long param_id);
    Spec selectSpec(@Param("param_id") Long param_id);
//    void insertSpec(@Param("param_id") Long param_id, @Param("alarm") Double alarm, @Param("warn") Double warn);
    OverallSpec selectTraceDataSpec(@Param("param_id") Long param_id);
    List<com.bistel.a3.portal.domain.pdm.db.Param> selectParamByEqp(@Param("eqp_id") Long eqpId);
    ParamWithCommon selectParamWithInfo(@Param("param_id") Long param_id);
    List<ParamWithCommon> selectParamWtihInfoByEqp(@Param("eqp_id") Long eqp_id);


    List<String> selectParamNamesByEqps(@Param("eqpIds") List<Long> eqpIds);

    List<Long> selectParamIds();
}
