package com.bistel.a3.portal.dao.pdm.db;

import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface SKFPumpMapper {

    //region bearing
    List<Bearing> selectBearing();
    void deleteBearing();
    void insertBearing(Bearing r);
    //endregion

    //region area
    List<Area> selectArea();
    void deleteArea();
    void insertArea(Area r);
    //endregion

    //region eqp
    List<Eqp> selectEqp();
    void deleteEqp();
    void insertEqp(Eqp r);
    //endregion

    //region EqpEtc
    List<EqpEtc> selectEqpEtc();
    void deleteEqpEtc();
    void insertEqpEtc(EqpEtc r);
    //endregion

    //region Param
    List<com.bistel.a3.portal.domain.pdm.db.Param> selectParam();
    List<com.bistel.a3.portal.domain.pdm.db.Param> selectParamByPDM(@Param("eqp_id") Long eqp_id);
    void deleteParam();
    void insertParam(com.bistel.a3.portal.domain.pdm.db.Param r);
    //endregion

    //region ParamWithCommon
    List<ParamWithCommon> selectParamWithCommon();
    void deleteParamWithCommon();
    void insertParamWithCommon(ParamWithCommon r);
    //endregion

    //region ManualRpm
    List<ManualRpm> selectManualRpm();
    void deleteManualRpm();
    void insertManualRpm(ManualRpm r);
    //endregion

    //region Part
    List<Part> selectPart();
    void deletePart();
    void insertPart(Part r);
    //endregion

    //region OverallSpec
    List<OverallSpec> selectOverallSpec();
    void deleteOverallSpec();
    void insertOverallSpec(OverallSpec r);
    OverallSpec selectOverallSpecByPdM(@Param("param_id") Long param_id);
    //endregion


    //region EqpAlarmTrx
    List<EqpAlarmTrx> selectEqpAlarmTrx(@Param("start") Date start, @Param("end") Date end, @Param("eqpId") Long eqpId);
    void deleteEqpAlarmTrx(@Param("start") Date start, @Param("end") Date end, @Param("eqpId") Long eqpId);
    void insertEqpAlarmTrx(EqpAlarmTrx r);
    //endregion

    //region AlarmTrx
    List<AlarmTrx> selectAlarmTrx(@Param("start") Date start, @Param("end") Date end, @Param("eqpId") Long eqpId);
    List<AlarmTrx> selectAlarmTrxByParamId(@Param("param_id") Long param_id);
    void deleteAlarmTrx(@Param("start") Date start, @Param("end") Date end, @Param("eqpId") Long eqpId);
    void insertAlarmTrx(AlarmTrx r);
    //endregion

    //region MeasureTrx
    List<MeasureTrx> selectMeasureTrx(@Param("start") Date start, @Param("end") Date end, @Param("eqpId") Long eqpId);
    void deleteMeasureTrx(@Param("start") Date start, @Param("end") Date end, @Param("eqpId") Long eqpId);
    void insertMeasureTrx(MeasureTrx r);
    //endregion

    //region MeasureTrxBin
    List<MeasureTrxBin> selectMeasureTrxBin(@Param("start") Date start, @Param("end") Date end, @Param("eqpId") Long eqpId);
    void deleteMeasureTrxBin(@Param("start") Date start, @Param("end") Date end, @Param("eqpId") Long eqpId);
    void insertMeasureTrxBin(MeasureTrxBin r);


    void deleteMeasureTrxByParamId(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);
    void deleteMeasureTrxBinByParamId(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);

    //endregion

    //region OverallMinuteTrx
    List<OverallMinuteTrx> selectOverallMinuteTrx(@Param("start") Date start, @Param("end") Date end);
    void deleteOverallMinuteTrx(@Param("start") Date start, @Param("end") Date end);
    void insertOverallMinuteTrx(OverallMinuteTrx r);
    List<OverallMinuteTrx> selectOverallMinuteTrxByParamId(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);
    void deleteOverallMinuteTrxByParamId(@Param("paramId") Long paramId, @Param("start") Date start, @Param("end") Date end);

    void updateOverallMinuteTrxByPDM(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end, @Param("alarm") Double alarm,@Param("warn") Double warn);
    //endregion
}
