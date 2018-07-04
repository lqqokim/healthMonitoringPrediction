package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.pdm.AlarmClassification;
import com.bistel.a3.portal.domain.pdm.AlarmHistory;
import com.bistel.a3.portal.domain.pdm.AreaFaultCountSummary;
import com.bistel.a3.portal.domain.pdm.WorstEquipmentList;

import java.util.Date;
import java.util.List;

public interface ISummaryDataService {

    List<AreaFaultCountSummary> getAlarmCountSummary(String fabId, Date fromdate, Date todate);

    List<AreaFaultCountSummary> getAlarmCountTrend(String fabId, String areaId, Date from, Date to);

    AlarmClassification getAlarmClassificationSummary(String fabId, Date from, Date to);

    List<AlarmHistory> getAlarmHistory(String fabId, Date from, Date to);


    List<AreaFaultCountSummary> lineStatusSummary(String fabId, Date from, Date to);

    List<AreaFaultCountSummary> lineStatusTrend(String fabId, String areaId, Date from, Date to);

    List<WorstEquipmentList> worstEquipmentList(String fabId, Date from, Date to);
}
