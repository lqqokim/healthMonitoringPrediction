package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.pdm.AreaFaultCountSummary;
import com.bistel.a3.portal.domain.pdm.EqpStatisticsData;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class SummaryDataController {
    @Autowired
    private ISummaryDataService summaryDataService;

    @Autowired
    private ITraceDataService traceDataService;



    //Done
    @RequestMapping("alarmCountSummary")
    public Object getAlarmCountSummary(@PathVariable("fabId") String fabId,
                                       @RequestParam("fromdate") Long fromdate,
                                       @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getAlarmCountSummary(fabId, from, to);

    }


    @RequestMapping("/alarmCountTrend")
    public Object getAlarmCountTrend(@PathVariable("fabId") String fabId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) {

        Long areaId=null;
        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getAlarmCountTrend(fabId, areaId, from, to);
    }

    @RequestMapping("areas/{areaId}/alarmCountTrendByAreaId")
    public Object getAlarmCountTrendByAreaId(@PathVariable("fabId") String fabId,
                                             @PathVariable("areaId") Long areaId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getAlarmCountTrend(fabId, areaId, from, to);
    }


    @RequestMapping("/areas/{areaId}/alarmClassificationSummaryByAreaId")
    public Object getAlarmClassificationSummaryByArea(@PathVariable("fabId") String fabId,
                                                     @PathVariable("areaId") Long areaId,
                                                     @RequestParam("fromdate") Long fromdate,
                                                      @RequestParam("todate") Long todate) {
        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getAlarmClassificationSummary(fabId, areaId, from, to);
    }

    @RequestMapping("/alarmClassificationSummary")
    public Object getAlarmClassificationSummary(@PathVariable("fabId") String fabId,
                                                @RequestParam("fromdate") Long fromdate,
                                                @RequestParam("todate") Long todate) {

        Long areaId=null;
        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getAlarmClassificationSummary(fabId, areaId, from, to);
    }

    @RequestMapping("/alarmHistory")
    public Object alarmHistoryAll(@PathVariable("fabId") String fabId,
                                                     @RequestParam("fromdate") Long fromdate,
                                                     @RequestParam("todate") Long todate) {

            Long areaId=null;
            Long eqpId=null;

            Date from = new Date(fromdate);
            Date to = new Date(todate);

            return summaryDataService.getAlarmHistory(fabId, areaId,eqpId, from, to);


    }

    @RequestMapping("/areas/{areaId}/alarmHistoryByAreaId")
    public Object alarmHistory(@PathVariable("fabId") String fabId,
                               @PathVariable("areaId") Long areaId,
                               @RequestParam("fromdate") Long fromdate,
                               @RequestParam("todate") Long todate) {


            Long eqpId=null;

            Date from = new Date(fromdate);
            Date to = new Date(todate);

            return summaryDataService.getAlarmHistory(fabId, areaId,eqpId, from, to);


    }

    @RequestMapping("/areas/{areaId}/eqps/{eqpId}/alarmHistoryByEqpId")
    public Object alarmHistoryByEqpId(@PathVariable("fabId") String fabId,
                                      @PathVariable("areaId") Long areaId,
                                      @PathVariable("eqpId") Long eqpId,
                                      @RequestParam("fromdate") Long fromdate,
                                      @RequestParam("todate") Long todate) {

            Date from = new Date(fromdate);
            Date to = new Date(todate);

            return summaryDataService.getAlarmHistory(fabId, areaId, eqpId,from, to);


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

    @RequestMapping("/lineStatusTrend")
    public Object lineStatusTrend(@PathVariable("fabId") String fabId,
                                    @RequestParam("fromdate") Long fromdate,
                                    @RequestParam("todate") Long todate) {

        Long areaId=null;
        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.lineStatusTrend(fabId,areaId, from, to);
    }

    @RequestMapping("/areas/{areaId}/lineStatusTrendByAreaId")
    public Object lineStatusTrendByAreaId(@PathVariable("fabId") String fabId,
                                          @PathVariable("areaId") Long areaId,
                                  @RequestParam("fromdate") Long fromdate,
                                  @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.lineStatusTrend(fabId,areaId, from, to);
    }


    @RequestMapping("/worstEquipmentList")
    public Object worstEquipmentList(@PathVariable("fabId") String fabId,

                                  @RequestParam("fromdate") Long fromdate,
                                  @RequestParam("todate") Long todate) {

        Long areaId=null;
        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.worstEquipmentList(fabId,areaId,null, from, to);
    }
    @RequestMapping("/eqps/{eqpId}/worstEquipmentInfo")
    public Object worstEquipmentInfo(@PathVariable("fabId") String fabId,
                                     @PathVariable("eqpId") Long eqpId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) {

        Long areaId=null;
        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.worstEquipmentList(fabId,areaId,eqpId, from, to);
    }

    @RequestMapping("/areas/{areaId}/worstEquipmentListByAreaId")
    public Object worstEquipmentList(@PathVariable("fabId") String fabId,
                                     @PathVariable("areaId") Long areaId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) {

        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.worstEquipmentList(fabId,areaId,null, from, to);
    }

    @RequestMapping("/eqpHealthIndex")
    public Object eqpHealthIndex(@PathVariable("fabId") String fabId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) {

        Long areaId=null;
        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.eqpHealthIndex(fabId,areaId, from, to);
    }

    @RequestMapping("/areas/{areaId}/eqpHealthIndexByAreaId")
    public Object eqpHealthIndexByAreaId(@PathVariable("fabId") String fabId,
                                         @PathVariable("areaId") Long areaId,
                                 @RequestParam("fromdate") Long fromdate,
                                 @RequestParam("todate") Long todate) {

        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.eqpHealthIndex(fabId,areaId, from, to);
    }

    @RequestMapping("/params/{paramId}/eqpHealthTrendChart")
    public Object eqpHealthTrendChart(@PathVariable("fabId") String fabId,
                                 @PathVariable("paramId") Long paramId,
                                 @RequestParam("fromdate") Long fromdate,
                                 @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return traceDataService.getTraceData(fabId, paramId, fromdate, todate);
    }

    @RequestMapping("/params/{paramId}/eqpHealthTrendChartWithSPC")
    public Object eqpHealthTrendChartWithSPC(@PathVariable("fabId") String fabId,
                                      @PathVariable("paramId") Long paramId,
                                      @RequestParam("fromdate") Long fromdate,
                                      @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        List<List<Object>> eqpHealthTrendData= traceDataService.getTraceData(fabId, paramId, fromdate, todate);

        return summaryDataService.eqpHealthTrendChartWithSPC(fabId, paramId, fromdate, todate, eqpHealthTrendData);
    }


    @RequestMapping("/params/{paramId}/eqpHealthTrendChartWithAVG")
    public Object eqpHealthTrendChartWithAVG(@PathVariable("fabId") String fabId,
                                      @PathVariable("paramId") Long paramId,
                                      @RequestParam("fromdate") Long fromdate,
                                      @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        Date previous=DateUtils.addDays(from, -90);
        Long lPrevious_date=previous.getTime();


        List<List<Object>> eqpHealthTrendData= traceDataService.getTraceData(fabId, paramId, lPrevious_date, todate);

        return summaryDataService.eqpHealthTrendChartWithAVG(fabId,previous, from, to, paramId , eqpHealthTrendData);
    }

    @RequestMapping("/params/{paramId}/eqpHealthTrendChartWithRUL")
    public Object eqpHealthTrendChartWithRUL(@PathVariable("fabId") String fabId,
                                             @PathVariable("paramId") Long paramId,
                                             @RequestParam("fromdate") Long fromdate,
                                             @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);



        List<List<Object>> eqpHealthTrendData= traceDataService.getTraceData(fabId, paramId, fromdate, todate);

        return summaryDataService.eqpHealthTrendChartWithRUL(fabId, from, to, paramId , eqpHealthTrendData);


    }


    @RequestMapping("eqps/{eqpId}/eqpHealthIndexGetWorstParam")
    public Object eqpHealthIndexWorstParam(@PathVariable("fabId") String fabId,
                                             @PathVariable("eqpId") Long eqpId,
                                             @RequestParam("fromdate") Long fromdate,
                                             @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.eqpHealthIndexGetWorstParam(fabId, eqpId ,from, to);


    }


}

