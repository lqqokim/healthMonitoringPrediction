package com.bistel.a3.portal.dao.pdm.std.summary;

import com.bistel.a3.portal.domain.pdm.AlarmHistory;
import com.bistel.a3.portal.domain.pdm.AreaFaultCountSummary;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface STDSummaryMapper {


    List<AreaFaultCountSummary> selectStatusCountSummary(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<AlarmHistory> selectAlarmHistoryAll(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    List<AlarmHistory> selectAlarmHistoryByAreaId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id );

    List<AlarmHistory> selectAlarmHistoryByEqpId(@Param("fromdate") Date fromdate, @Param("todate") Date todate, @Param("area_id") Long area_id, @Param("eqp_id") Long eqp_id );

}
