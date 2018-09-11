package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.HealthInfo;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

public interface ISummaryDataService {

    List<AreaFaultCountSummary> getAlarmCountSummary(String fabId, Date fromdate, Date todate);

    List<AreaFaultCountSummary> getAlarmCountTrend(String fabId, Long areaId, Date fromdate, Date todate);

    List<AlarmClassification> getAlarmClassificationSummary(String fabId, Long areaId, Date fromdate, Date todate);

    List<AlarmHistory> getAlarmHistory(String fabId,Long areaId, Long eqpId, Date fromdate, Date todate);

    List<AreaFaultCountSummary> lineStatusSummary(String fabId, Date fromdate, Date todate);

    List<AreaFaultCountSummary> lineStatusTrend(String fabId, Long areaId, Date fromdate, Date todate);

    List<WorstEquipmentList> worstEquipmentList(String fabId, Long areaId ,Long eqpId, Date fromdate, Date todate);

    List<FabMonitoringInfo> getFabMonitoringInfo(String fabId, Long eqp_id, String param_name,Date fromdate, Date todate);

    List<EqpHealthIndex> eqpHealthIndex(String fabId, Long areaId, Date from, Date to);

    EqpStatisticsData eqpHealthTrendChartWithAVG(String fabId,Date previous, Date from, Date to, Long paramId, List<List<Object>> eqpHealthTrendData, List<List<Object>> eqpHealthTraceData);

    EqpHealthRUL eqpHealthTrendChartWithRUL(String fabId, Date from, Date to, Long paramId, List<List<Object>> eqpHealthTrendData);

    Long eqpHealthIndexGetWorstParam(String fabId, Long eqpId, Date from, Date to);

    EqpHealthSPC eqpHealthTrendChartWithSPC(String fabId, Long paramId, Long from, Long to, List<List<Object>> eqpHealthTrendData);

    List<List<Object>> getSummaryDataForHealth(String fabId, Long paramId, Long lHealthLogic , Date fromdate, Date todate);

    Object getSummaryData(String fabId,Long paramId, Long fromdate, Long todate, List<String> adHocFucntions);

    List<HealthInfo> getWorstEqpsByHealthIndex(String fabId, Date from, Date to,Integer numberOfWorst);

    List<EqpHealthIndexTrend> getEqpHealthIndexTrend(String fabId, Long area_id, Long eqp_id, Date fromdate, Date todate);

}
