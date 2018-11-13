package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.Eqp;
import com.bistel.a3.portal.domain.pdm.db.HealthStat;
import com.bistel.a3.portal.domain.pdm.db.OverallSpec;
import com.bistel.a3.portal.domain.pdm.db.ReportAlarm;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

public interface IReportService {
    List<Fab> getFabs();

    List<AreaWithStatus> getAreaStatus(String fabId, Long fromdate, Long todate);

    List<EqpStatus> getEqpStatus(String fabId, Long areaId, Long fromdate, Long todate, Integer regressionDays);

    void checkOverSpec(String fabId, Date start, Date end, HealthStat stat);

    Eqp getEqpById(String fabId, Long eqpId);

    Eqp getEqpByMeasureTrxId(String fabId, Long measureTrxId);

    List<Eqp> getEqps(String fabId);

    List<Node> getEqpTree(String fabId);

    EqpInfo getEqpInfo(String fabId, Long eqpId);

    List<EqpVariance> getVariances(String fabId, Long areaId, Date baseStart, Date baseEnd, Date now);

    EqpVariance getVariance(String fabId, Long areaId, Long eqpId, Date baseStart, Date baseEnd, Date now);

    List<UnivariateVariation> getUnivariatevariation(String fabId, Long eqpId, Date start, Date end);

    void caculateAvg90(String fabId, Date before90, Date date, Set<Long> eqpIds);

    void createPartiton(String fabId, Date from, int count);

    List<EqpStatusData> getAlarmWarningEqps(String fabId, Date from, Date to);

    List<EqpStatusData> getGoodFiveEqps(String fabId, Date from, Date to, Double threshold);

    List<EqpStatusData> getBadFiveEqps(String fabId, Date from, Date to, Double threshold);

    List<ParamClassificationData> getParamClassifications(String fabId, Long eqpId, Date from, Date to);

    void getDuration(String fabId, List<EqpStatusData> list, Date from, Date to);

    Overall getOverall(String fabId, Long eqpId, Long paramId, Long fromdate, Long todate);

    List<ReportAlarm> getAlarms(String fabId, Long fromdate, Long todate);

    void updateAlarm(String fabId, ReportAlarm alarmReport);

    List<MaintenanceHst> getAlarmsByEqpId(String fabId, Long eqpId, Long fromdate, Long todate);

    List<ParamStatus> getParamStatus(String fabId, Long eqpId, Long fromdate, Long todate);

    List<ParamWithCommon> getParamWtihTypeByEqp(String fabId, Long eqpId);

    ParamWithCommon getParamWithComm(String fabId, Long paramId);

    Spec getOverallMinuteTrxSpec(String fabId, Long paramId, Long fromdate, Long todate);

    Spec getOverallMinuteTrxSpecConfig(String fabId, Long paramId);

    void calculateSummary(String userName,String fabId, Date overallSummarySpecDate, Date from, Date to, Long eqpId);
    void calculateRealTimeSummary(String userName,String fabId,Date from, Date to, Long eqpId);

    OverallSpec getOverallSpec(String fabId, Long paramId);

    List<EqpStatusData> getNumberOfWorstEqps(String fabId, Date from, Date to, Integer numberOfWorst);

    List<STDTraceData> getTraceData(String fabId, Long eqpId, Date fromdate, Date todate, String normalizeType);

    Set<Long> selectExpectedAlarmWarningEqps(String fab, Date from, Date to);

    Object getFeatureDataWithRUL(String fabId, Long eqpId, Long paramId, Long fromdate, Long todate);

    Object getHealthIndexTrend(String fabId, Long paramId, Long fromdate, Long todate);

    Object getFeatureTrxTrend(String fabId, Long paramId, Long fromdate, Long todate);
}
