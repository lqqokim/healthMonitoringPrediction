package com.bistel.a3.portal.dao.pdm.std.summary;

import com.bistel.a3.portal.domain.pdm.*;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public interface STDSummaryMapper {


    List<AreaFaultCountSummary> selectStatusCountSummary(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<AlarmHistory> selectAlarmHistoryAll(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<AlarmHistory> selectAlarmHistoryByAreaId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id );

    List<AlarmHistory> selectAlarmHistoryByEqpId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id, @Param("eqp_id") Long eqp_id );

    List<AlarmClassification> selectAlarmClassificationSummary(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<AlarmClassification> selectAlarmClassificationSummaryByAreaId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id);

    List<AreaFaultCountSummary> selectLineStatusTrend(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<AreaFaultCountSummary> selectLineStatusTrendByAreaId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id);

    List<WorstEquipmentList> selectWorstEquipmentList(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts,@Param("eqp_id") Long eqp_id );

    ArrayList<WorstEqupmentListChartData> selectWorstEqupmentListChartData(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts);

    List<WorstEquipmentList> selectWorstEquipmentListByAreaId(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts, @Param("area_id") Long area_id);

    ArrayList<WorstEqupmentListChartData> selectWorstEqupmentListChartDataByAreaId(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts, @Param("area_id") Long area_id);

    List<EqpHealthIndex> selectEqpHealthIndexMasterEqpInfo(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<EqpHealthIndex> selectEqpHealthIndexMasterParamInfo(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<EqpHealthIndex> selectEqpHealthIndexInfo(@Param("fromdate") Date fromdate, @Param("todate") Date todate);


    List<EqpHealthIndex> selectEqpHealthIndexByAreaId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id);

    List<EqpHealthSPCRule> selectEqpHealthSPCRule(@Param("param_id") Long param_id, @Param("health_logic_id") Long health_logic_id);

    List<BasicData> selectSummaryData(@Param("param_id") Long param_id, @Param("fromdate") Date fromdate, @Param("todate") Date todate);


    List<WorstEquipmentList> selectEqpHealthDiff(@Param("start_dtts") String start_dtts, @Param("end_dtts") String end_dtts,@Param("eqp_id") Long eqp_id );

    EqpStatisticsData selectPreviousAVGAndSigma(@Param("start_dtts") String start_dtts, @Param("param_id") Long param_id );

    EqpStatisticsData selectPeriodAVG(@Param("start_dtts") String start_dtts, @Param("param_id") Long param_id );


}
