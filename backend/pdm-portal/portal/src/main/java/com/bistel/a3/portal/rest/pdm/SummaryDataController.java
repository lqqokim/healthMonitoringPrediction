package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.pdm.AreaFaultCountSummary;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class SummaryDataController {
    @Autowired
    private ISummaryDataService summaryDataService;

    //Done
    @RequestMapping("alarmCountSummary")
    public Object getAlarmCountSummary(@PathVariable("fabId") String fabId,
                                       @RequestParam("fromdate") Long fromdate,
                                       @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        List<AreaFaultCountSummary> alarmCountSummary=summaryDataService.getAlarmCountSummary(fabId, from, to);
        return summaryDataService.getAlarmCountSummary(fabId, from, to);
    }


    @RequestMapping("alarmCountTrend")
    public Object getAlarmCountTrend(@PathVariable("fabId") String fabId,
                                     @PathVariable("areaId") String areaId,
                                       @RequestParam("fromdate") Long fromdate,
                                       @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getAlarmCountTrend(fabId, areaId, from, to);
    }

    @RequestMapping("alarmClassificationSummary")
    public Object getAlarmClassificationSummary(@PathVariable("fabId") String fabId,
                                                     @RequestParam("fromdate") Long fromdate,
                                                      @RequestParam("todate") Long todate) {

        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getAlarmClassificationSummary(fabId, from, to);
    }

    @RequestMapping("alarmHistory")
    public Object alarmHistory(@PathVariable("fabId") String fabId,
                                                     @RequestParam("fromdate") Long fromdate,
                                                     @RequestParam("todate") Long todate) {

        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getAlarmHistory(fabId, from, to);
    }

    //Done
    @RequestMapping("lineStatusSummary")
    public Object lineStatusSummary(@PathVariable("fabId") String fabId,
                               @RequestParam("fromdate") Long fromdate,
                               @RequestParam("todate") Long todate) {

        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.lineStatusSummary(fabId, from, to);
    }

    @RequestMapping("lineStatusTrend")
    public Object lineStatusTrend(@PathVariable("fabId") String fabId,
                                  @PathVariable("areaId") String areaId,
                                    @RequestParam("fromdate") Long fromdate,
                                    @RequestParam("todate") Long todate) {

        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.lineStatusTrend(fabId,areaId, from, to);
    }

    @RequestMapping("worstEquipmentList")
    public Object worstEquipmentList(@PathVariable("fabId") String fabId,
                                  @RequestParam("fromdate") Long fromdate,
                                  @RequestParam("todate") Long todate) {

        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.worstEquipmentList(fabId, from, to);
    }

}
