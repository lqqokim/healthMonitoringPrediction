package com.bistel.a3.portal.dao.pdm.ulsan;

import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.ManualRpm;
import com.bistel.a3.portal.domain.pdm.db.OverallSpec;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Set;

public interface ParamDataMapper {
    List<ParamStatus> selectParamStatusByEqpId(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end);

    ParamWithCommon selectParamWithInfo(@Param("param_id") Long param_id);

    List<ParamWithCommon> selectParamWtihInfoByEqp(@Param("eqp_id") Long eqp_id);

    EqpInfo selectEqpInfo(@Param("eqp_id") Long eqp_id);

    List<UnivariateVariation> selectUnivariatevariation(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end);

    void deleteCalculateAvg90(@Param("date") Date date, @Param("eqpIds") Set<Long> eqpIds);

    void insertCalculateAvg90(@Param("before90") Date before90, @Param("date") Date date, @Param("eqpIds") Set<Long> eqpIds);

    List<com.bistel.a3.portal.domain.pdm.db.Param> selectParamByEqp(@Param("eqp_id") Long eqp_id);

    List<BasicData> selectData(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);

    Spec selectSpec(@Param("param_id") Long param_id);
//Allen
    OverallSpec selectOverallSpec(@Param("param_id") Long param_id);

    void insertSpec(@Param("param_id") Long param_id, @Param("alarm") Double alarm, @Param("warn") Double warn);

    ManualRpm selectRpm(@Param("param_id") Long param_id);

    void insertRpm(@Param("param_id") Long param_id, @Param("rpm") Double rpm);

    ParamWithCommon selectCommon(@Param("param_id") Long param_id);

    void insertCommon(@Param("param_id") Long param_id, @Param("eu") String eu, @Param("eu_type") Integer eu_type);
//
    List<Double> selectPrevPeriodAVG(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);


}
