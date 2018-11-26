package com.bistel.a3.portal.dao.pdm.std.report;

import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.*;

public interface STDReportMapper {
    List<ReportAlarm> selectReportAlarm(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void updateReportAlarm(ReportAlarm reportAlarm);

    List<MaintenanceHst> selectReportAlarmByEqpId(@Param("eqp_id") Long eqp_id, @Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void insertReportAlarm(ReportAlarm reportAlarm);

    void deleteReportAlarm(ReportAlarm reportAlarm);


    EqpStatus selecEqpStatusByEqpId(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end, @Param("from90") Date from90);


    AreaWithStatus selectAreaStatusByAreaId(@Param("area_id") Long area_id, @Param("start") Date start, @Param("end") Date end);


    void deleteBatchJobHst(BatchJobHst batchJobHst);

    void insertBatchJobHst(BatchJobHst batchJobHst);

    List<BatchJobHst> selectJobHst(@Param("start") Date start, @Param("end") Date end, @Param("job_type_cd") String job_type_cd);


    void deleteSummaryTrx(OverallMinuteSummaryTrx summaryTrx);
    void deleteDailySummaryTrxByEqpId(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);



    void insertSummaryTrx(OverallMinuteSummaryTrx summaryTrx);


    List<ParamStatus> selectParamStatusByEqpId(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end);


    List<UnivariateVariation> selectUnivariatevariation(@Param("eqp_id") Long eqp_id, @Param("start") Date start, @Param("end") Date end);

    void deleteCalculateAvg90(@Param("date") Date date, @Param("eqpIds") Set<Long> eqpIds);

    void insertCalculateAvg90(@Param("before90") Date before90, @Param("date") Date date, @Param("eqpIds") Set<Long> eqpIds);


    List<BasicData> selectData(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);

    List<Double> selectPrevPeriodAVG(@Param("param_id") Long param_id, @Param("start") Date start, @Param("end") Date end);


    List<EqpStatusData> selectAlarmWarningEqps(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end, @Param("globalWarn") Double globalWarn);

    List<EqpStatusData> selectGoodFiveEqps(@Param("start") Date start, @Param("end") Date end, @Param("threshold") Double threshold);

    List<EqpStatusData> selectBadFiveEqps(@Param("start") Date start, @Param("end") Date end, @Param("threshold") Double threshold);

    List<EqpStatusData> selectNumberOfWorstEqps(@Param("start") Date start, @Param("end") Date end,@Param("numberOfWorst") Integer numberOfWorst);

    List<ParamClassificationData> selectRadar(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end, @Param("globalWarn") Double globalWarn);

    List<HashMap<String,Object>> selectDailyAnalysisCause(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);

    Set<Long> selectExpectedAlarmWarningEqps( @Param("start") Date start, @Param("end") Date end,@Param("rmsOverCount") int rmsOverCount);


    List<FeatureTrx> selectFeatureData(@Param("paramId") Long paramId,@Param("fromDate") Date fromDate,@Param("toDate") Date toDate);

    List<BasicData> selectFeatureTrend(@Param("paramId") Long paramId,@Param("fromDate") Date fromDate,@Param("toDate") Date toDate);

    List<BasicDatasForCorrelationANOVA> selectFeatureTrendWithIndex(@Param("paramId") Long paramId,@Param("fromDate") Date fromDate,@Param("toDate") Date toDate);

    List<BasicData> selectHealthIndexTrend(@Param("paramId") Long paramId,@Param("fromDate") Date fromDate,@Param("toDate") Date toDate);

    List<HashMap<String,Object>> selectCorrelationInputData(@Param("param") Map<String, Object> param);
}
