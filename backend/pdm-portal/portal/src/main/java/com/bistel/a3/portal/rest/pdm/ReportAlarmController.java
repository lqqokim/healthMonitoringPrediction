package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.pdm.db.ReportAlarm;
import com.bistel.a3.portal.service.pdm.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class ReportAlarmController {
    @Autowired
    private IReportService reportService;


    @RequestMapping("reportalarm")
    public Object getReportalarm(@PathVariable("fabId") String fabId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return reportService.getAlarms(fabId, fromdate, todate);
    }

    @RequestMapping(value = "reportalarm", method = RequestMethod.PUT)
    public void setReportalarm(@PathVariable("fabId") String fabId, @RequestBody ReportAlarm reportAlarm) {
        reportService.updateAlarm(fabId, reportAlarm);
    }

    @RequestMapping("eqps/{eqpId}/eqpinfo")
    public Object eqpInfo(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId) {
        return reportService.getEqpInfo(fabId, eqpId);
    }
}
