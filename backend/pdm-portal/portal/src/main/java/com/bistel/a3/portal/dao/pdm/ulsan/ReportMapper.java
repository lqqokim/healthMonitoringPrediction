package com.bistel.a3.portal.dao.pdm.ulsan;

import com.bistel.a3.portal.domain.pdm.MaintenanceHst;
import com.bistel.a3.portal.domain.pdm.db.ReportAlarm;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface ReportMapper {
    List<ReportAlarm> selectReportAlarm(@Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void updateReportAlarm(ReportAlarm reportAlarm);

    List<MaintenanceHst> selectReportAlarmByEqpId(@Param("eqp_id") Long eqp_id, @Param("fromdate") Date fromdate, @Param("todate") Date todate);

    void insertReportAlarm(ReportAlarm reportAlarm);

    void deleteReportAlarm(ReportAlarm reportAlarm);
}
