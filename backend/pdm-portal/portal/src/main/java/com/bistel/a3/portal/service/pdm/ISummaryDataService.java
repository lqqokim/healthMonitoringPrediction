package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.pdm.AlarmClassification;
import com.bistel.a3.portal.domain.pdm.AlarmHistory;
import com.bistel.a3.portal.domain.pdm.AreaFaultCountSummary;
import com.bistel.a3.portal.domain.pdm.WorstEquipmentList;

import java.util.Date;
import java.util.List;

public interface ISummaryDataService {

    List<AreaFaultCountSummary> getAlarmCountSummary(String fabId, Date fromdate, Date todate);

    List<AreaFaultCountSummary> getAlarmCountTrend(String fabId, Long areaId, Date fromdate, Date todate);

    AlarmClassification getAlarmClassificationSummary(String fabId,Long areaId, Date fromdate, Date todate);

    List<AlarmHistory> getAlarmHistory(String fabId,Long areaId, Date fromdate, Date todate);

    List<AreaFaultCountSummary> lineStatusSummary(String fabId, Date fromdate, Date todate);

    List<AreaFaultCountSummary> lineStatusTrend(String fabId, Long areaId, Date fromdate, Date todate);

    List<WorstEquipmentList> worstEquipmentList(String fabId, Long areaId , Date fromdate, Date todate);
}
