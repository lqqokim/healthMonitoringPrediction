package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.dao.pdm.std.master.STDEtcMapper;
import com.bistel.a3.portal.domain.pdm.db.Area;
import com.bistel.a3.portal.domain.pdm.master.Monitoring;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.service.pdm.impl.std.EtcService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs")
public class MonitoringController {
    @Autowired
    private IReportService reportService;

    @Autowired
    private EtcService etcService;

    @RequestMapping
    public Object getFabs() {
        return reportService.getFabs();
    }

    @RequestMapping("{fabId}/areastatus")
    public Object getAreaStatus(
            @PathVariable("fabId") String fabId,
            @RequestParam(value = "fromdate") Long fromdate,
            @RequestParam(value = "todate") Long todate) {
        return reportService.getAreaStatus(fabId, fromdate, todate);
    }

    @RequestMapping("{fabId}/areas/{areaId}/eqpstatus")
    public Object getEqpStatus(
            @PathVariable("fabId") String fabId,
            @PathVariable("areaId") Long areaId,
            @RequestParam(value = "fromdate") Long fromdate,
            @RequestParam(value = "todate") Long todate,
            @RequestParam(value = "regressionDays", defaultValue = "7") Integer regressionDays) {
        return reportService.getEqpStatus(fabId, areaId, fromdate, todate, regressionDays);
    }

    @RequestMapping("{fabId}/areas/{areaId}/variance")
    public Object variance(
            @PathVariable("fabId") String fabId,
            @PathVariable("areaId") Long areaId,
            @RequestParam(value = "date", required = false) Long date,
            @RequestParam(value = "day", defaultValue = "30") Integer day) {

        Date now = date == null ? new Date() : new Date(date);
        now = DateUtils.truncate(now, Calendar.HOUR);
        Date baseEnd = DateUtils.truncate(now, Calendar.DATE);
        Date baseStart = DateUtils.addDays(baseEnd, day * -1);

        return reportService.getVariances(fabId, areaId, baseStart, baseEnd, now);
    }

    @RequestMapping("{fabId}/areas/{areaId}/eqps/{eqpId}/variance")
    public Object eqpVariance(
            @PathVariable("fabId") String fabId,
            @PathVariable("areaId") Long areaId,
            @PathVariable(value = "eqpId") Long eqpId,
            @RequestParam(value = "date", required = false) Long date,
            @RequestParam(value = "day", defaultValue = "30") Integer day) {

        Date now = date == null ? new Date() : new Date(date);
        now = DateUtils.truncate(now, Calendar.HOUR);
        Date baseEnd = DateUtils.truncate(now, Calendar.DATE);
        Date baseStart = DateUtils.addDays(baseEnd, day * -1);
        return reportService.getVariance(fabId, areaId, eqpId, baseStart, baseEnd, now);
    }

    @RequestMapping("{fabId}/areas/{areaId}/eqps/{eqpId}/paramstatus")
    public Object paramstatus(
            @PathVariable("fabId") String fabId,
            @PathVariable("eqpId") Long eqpId,
            @RequestParam(value = "fromdate") Long fromdate,
            @RequestParam(value = "todate") Long todate) {
        return reportService.getParamStatus(fabId, eqpId, fromdate, todate);
    }

    @RequestMapping("{fabId}/tree")
    public Object tree(@PathVariable("fabId") String fabId) {
        return reportService.getEqpTree(fabId);
    }



    @RequestMapping("{fabId}/monitorings")
    public List<Monitoring> getMonitorings(
            @PathVariable("fabId") String fabId) {
        return etcService.getMonitoring(fabId,null );
    }
    @RequestMapping(value = "{fabId}/monitorings",method = RequestMethod.POST)
    public void createMonitoring(Principal user, @PathVariable String fabId, @RequestBody Monitoring monitoring) {
        monitoring.setUserName(user.getName());
        etcService.CreateMonitoring(fabId,monitoring);
    }

    @RequestMapping(value = "{fabId}/monitorings",method = RequestMethod.PUT)
    public void updateMonitoring(Principal user, @PathVariable String fabId, @RequestBody Monitoring monitoring) {
        monitoring.setUserName(user.getName());
        etcService.UpdateMonitoring(fabId,monitoring);
    }

    @RequestMapping(value = "{fabId}/monitorings/{rawId}", method = RequestMethod.DELETE)
    public void removeMonitoring(@PathVariable String fabId, @PathVariable Long rawId) {

        etcService.DeleteMonitoring(fabId,rawId);
    }

}
