package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.pdm.*;

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

    List<EqpHealthIndex> eqpHealthIndex(String fabId, Long areaId, Date from, Date to);

    EqpStatisticsData eqpHealthTrendChartWithAVG(String fabId,Date previous, Date from, Date to, Long paramId, List<List<Object>> eqpHealthTrendData, List<List<Object>> eqpHealthTraceData);

    EqpHealthRUL eqpHealthTrendChartWithRUL(String fabId, Date from, Date to, Long paramId, List<List<Object>> eqpHealthTrendData);

    Long eqpHealthIndexGetWorstParam(String fabId, Long eqpId, Date from, Date to);

    EqpHealthSPC eqpHealthTrendChartWithSPC(String fabId, Long paramId, Long from, Long to, List<List<Object>> eqpHealthTrendData);

    List<List<Object>> getSummaryData(String fabId, Long paramId, Long fromdate, Long todate);

}
