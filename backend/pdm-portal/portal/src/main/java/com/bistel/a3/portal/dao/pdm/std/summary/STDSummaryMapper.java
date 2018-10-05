package com.bistel.a3.portal.dao.pdm.std.summary;

import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.HealthInfo;
import com.bistel.a3.portal.domain.pdm.db.ParamFeatureTrx;
import com.bistel.a3.portal.domain.pdm.std.master.STDParamHealth;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public interface STDSummaryMapper {



    List<AreaFaultCountSummary> selectStatusCountSummary(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<AlarmHistory> selectAlarmHistoryAll(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<AlarmHistory> selectAlarmHistoryByAreaId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id );

    List<AlarmHistory> selectAlarmHistoryByEqpId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id, @Param("eqp_id") Long eqp_id );

    List<AlarmClassification> selectAlarmClassificationSummary(@Param("fromdate") String fromdate, @Param("todate") String todate);

    List<AlarmClassification> selectAlarmClassificationSummaryByAreaId(@Param("fromdate") String fromdate, @Param("todate") String todate, @Param("area_id") Long area_id);

    List<AreaFaultCountSummary> selectLineStatusTrend(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("sFrom") String sFrom, @Param("sTo") String sTo);

    List<AreaFaultCountSummary> selectLineStatusTrendByAreaId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id, @Param("sFrom") String sFrom, @Param("sTo") String sTo);

    List<WorstEquipmentList> selectWorstEquipmentList(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts,@Param("eqp_id") Long eqp_id );

    ArrayList<WorstEqupmentListChartData> selectWorstEqupmentListChartData(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts, @Param("eqp_id") Long eqp_id);

    List<WorstEquipmentList> selectWorstEquipmentListByAreaId(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts, @Param("area_id") Long area_id, @Param("eqp_id") Long eqp_id);

    ArrayList<WorstEqupmentListChartData> selectWorstEqupmentListChartDataByAreaId(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts, @Param("area_id") Long area_id, @Param("eqp_id") Long eqp_id);

    List<EqpHealthIndex> selectEqpHealthIndex(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("globalWarning") Double globalWarning);

    List<EqpHealthIndexTrend> selectEqpHealthIndexTrend(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id, @Param("eqp_id") Long eqp_id,@Param("upperWarningSpec") Double upperWarningSpec, @Param("upperAlarmSpec") Double upperAlarmSpec);

    List<FabMonitoringInfo> selectFabMonitoring(@Param("eqp_id") Long eqp_id, @Param("param_name") String param_name, @Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("globalWarn") Double globalWarn);

    List<EqpHealthIndex> selectEqpHealthAlarmCount(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<EqpHealthIndex> selectEqpHealthIndexMasterParamInfo(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<EqpHealthIndex> selectEqpHealthIndexInfo(@Param("fromdate") Date fromdate, @Param("todate") Date todate);


    List<EqpHealthIndex> selectEqpHealthIndexByAreaId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id);

    List<EqpHealthSPCRule> selectEqpHealthSPCRule(@Param("param_id") Long param_id, @Param("health_logic_id") Long health_logic_id);

//    List<BasicData> selectParamHealthTrxRul(@Param("param_id") Long param_id, @Param("fromdate") Date fromdate, @Param("todate") Date todate,@Param("globalWarning") Double globalWarning);

    List<BasicData> selectParamHealthTrx(@Param("param_id") Long param_id, @Param("logic_id") Long logic_id ,@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("globalWarning") Double globalWarning);

    List<WorstEquipmentList> selectEqpHealthDiff(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts,@Param("eqp_id") Long eqp_id );

    EqpStatisticsData selectPreviousAVGAndSigma(@Param("start_dtts") String start_dtts,@Param("end_dtts") String end_dtts, @Param("param_id") Long param_id );

    EqpStatisticsData selectPeriodAVG(@Param("start_dtts") String start_dtts,@Param("end_dtts") String end_dtts, @Param("param_id") Long param_id );

    EqpStatisticsData selectPreviousPeriod(@Param("start_dtts") String start_dtts,@Param("end_dtts") String end_dtts, @Param("param_id") Long param_id);

    EqpHealthRUL selectRUL(@Param("fromdate") Date fromdate, @Param("todate") Date todate,@Param("param_id") Long param_id );

    void insertSummaryHealthSTDSPC(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void insertSummaryHealthDiff(@Param("fromdate") String fromdate, @Param("todate") String todate);

    void insertSummaryHealthRUL(@Param("eqp_mst_rawid") Long eqp_mst_rawid, @Param("param_health_mst_rawid") Long param_health_mst_rawid , @Param("score") Double score, @Param("fromdate") Date fromdate);


    void deleteSummaryHealth(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<ParamFeatureTrx> selectSummaryData(@Param("param_id") Long param_id,@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void deleteEqpAlarmDailySum(@Param("fromdate") Date fromdate, @Param("todate") Date todate);
    void insertEqpAlarmDailySum(@Param("fromdate") Date fromdate, @Param("todate") Date todate);


    List<HealthInfo> selectWorstEqps(@Param("fromdate") Date fromdate, @Param("todate") Date todate,@Param("numberOfWorst") Integer numberOfWorst, @Param("globalWarn") Double globalWarn);

    List<ParamRULSummary> selectRULSummary(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void deleteParamHealthRUL(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void insertParamHealthRULTRX(@Param("param_health_mst_rawid") Long param_health_mst_rawid, @Param("intercept") Double intercept, @Param("slope") Double slope, @Param("xvalue") Double xvalue, @Param("create_dtts") Date create_dtts);

    STDParamHealth selectEqpIdandParamHealthMSTRawId(@Param("param_id") Long param_id);
}
