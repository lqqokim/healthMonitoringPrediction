package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.pdm.EqpStatusData;
import com.bistel.a3.portal.domain.pdm.db.HealthInfo;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
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
                                       @RequestParam("todate") Long todate) throws ParseException {


        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.getAlarmCountSummary(fabId, from, to);

    }


    @RequestMapping("/alarmCountTrend")
    public Object getAlarmCountTrend(@PathVariable("fabId") String fabId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) throws ParseException {

        Long areaId=null;
        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.getAlarmCountTrend(fabId, areaId, from, to);
    }

    @RequestMapping("areas/{areaId}/alarmCountTrendByAreaId")
    public Object getAlarmCountTrendByAreaId(@PathVariable("fabId") String fabId,
                                             @PathVariable("areaId") Long areaId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) throws ParseException {


        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.getAlarmCountTrend(fabId, areaId, from, to);
    }


    @RequestMapping("/areas/{areaId}/alarmClassificationSummaryByAreaId")
    public Object getAlarmClassificationSummaryByArea(@PathVariable("fabId") String fabId,
                                                     @PathVariable("areaId") Long areaId,
                                                     @RequestParam("fromdate") Long fromdate,
                                                      @RequestParam("todate") Long todate) throws ParseException {
        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.getAlarmClassificationSummary(fabId, areaId, from, to);
    }

    @RequestMapping("/alarmClassificationSummary")
    public Object getAlarmClassificationSummary(@PathVariable("fabId") String fabId,
                                                @RequestParam("fromdate") Long fromdate,
                                                @RequestParam("todate") Long todate) throws ParseException {

        Long areaId=null;
        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

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
    @RequestMapping("eqps/{eqpId}/fabmonitoring")
    public Object getFabMonitoring(@PathVariable("fabId") String fabId,
                                   @PathVariable("eqpId") Long eqp_id,
                                   @RequestParam("param_name") String param_name,
                                  @RequestParam("fromdate") Long fromdate,
                                  @RequestParam("todate") Long todate) {


        Date from = new Date(fromdate);
        Date to = new Date(todate);

        return summaryDataService.getFabMonitoringInfo(fabId, eqp_id, param_name, from, to);

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
                               @RequestParam("todate") Long todate) throws ParseException {

        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.lineStatusSummary(fabId, from, to);
    }

    @RequestMapping("/lineStatusTrend")
    public Object lineStatusTrend(@PathVariable("fabId") String fabId,
                                    @RequestParam("fromdate") Long fromdate,
                                    @RequestParam("todate") Long todate) throws ParseException {

        Long areaId=null;
        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);




        return summaryDataService.lineStatusTrend(fabId,areaId, from, to);
    }

    @RequestMapping("/areas/{areaId}/lineStatusTrendByAreaId")
    public Object lineStatusTrendByAreaId(@PathVariable("fabId") String fabId,
                                          @PathVariable("areaId") Long areaId,
                                  @RequestParam("fromdate") Long fromdate,
                                  @RequestParam("todate") Long todate) throws ParseException {


        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

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
        Integer limit=5;

        return summaryDataService.worstEquipmentList(fabId,areaId,null, from, to, limit);
    }

    @RequestMapping("/areas/{areaId}/worstEquipmentListByAreaId")
    public Object worstEquipmentList(@PathVariable("fabId") String fabId,
                                     @PathVariable("areaId") Long areaId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) {

        Date from = new Date(fromdate);
        Date to = new Date(todate);
        Integer limit=5;

        return summaryDataService.worstEquipmentList(fabId,areaId,null, from, to, limit);
    }

    @RequestMapping("/eqps/{eqpId}/worstEquipmentInfo")
    public Object worstEquipmentInfo(@PathVariable("fabId") String fabId,
                                     @PathVariable("eqpId") Long eqpId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) {

        Long areaId=null;
        Date from = new Date(fromdate);
        Date to = new Date(todate);
        Integer limit=5;
//
        return summaryDataService.worstEquipmentList(fabId,areaId,eqpId, from, to, limit);
    }



    @RequestMapping("/eqpHealthIndex")
    public Object eqpHealthIndex(@PathVariable("fabId") String fabId,
                                     @RequestParam("fromdate") Long fromdate,
                                     @RequestParam("todate") Long todate) throws ParseException {

        Long areaId=null;
        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.eqpHealthIndex(fabId,areaId, from, to);
    }

    @RequestMapping("/areas/{areaId}/eqpHealthIndexByAreaId")
    public Object eqpHealthIndexByAreaId(@PathVariable("fabId") String fabId,
                                         @PathVariable("areaId") Long areaId,
                                 @RequestParam("fromdate") Long fromdate,
                                 @RequestParam("todate") Long todate) throws ParseException {

        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.eqpHealthIndex(fabId,areaId, from, to);
    }


    @RequestMapping("/params/{paramId}/eqpHealthTrendChart")
    public Object eqpHealthTrendChart(@PathVariable("fabId") String fabId,
                                 @PathVariable("paramId") Long paramId,
                                 @RequestParam("fromdate") Long fromdate,
                                 @RequestParam("todate") Long todate) throws ParseException {

        Long lHealthLogic=1L;
        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.getSummaryDataForHealth(fabId, paramId, lHealthLogic, from, to);

    }

    @RequestMapping("/params/{paramId}/eqpHealthTrendChartWithSPC")
    public Object eqpHealthTrendChartWithSPC(@PathVariable("fabId") String fabId,
                                      @PathVariable("paramId") Long paramId,
                                      @RequestParam("fromdate") Long fromdate,
                                      @RequestParam("todate") Long todate) throws ParseException {


        Long lHealthLogic=2L;
        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        List<List<Object>> eqpHealthTrendData= summaryDataService.getSummaryDataForHealth(fabId, paramId, lHealthLogic ,from, to);

        return summaryDataService.eqpHealthTrendChartWithSPC(fabId, paramId, fromdate, todate, eqpHealthTrendData);
    }


    @RequestMapping("/params/{paramId}/eqpHealthTrendChartWithAVG")
    public Object eqpHealthTrendChartWithAVG(@PathVariable("fabId") String fabId,
                                      @PathVariable("paramId") Long paramId,
                                      @RequestParam("fromdate") Long fromdate,
                                      @RequestParam("todate") Long todate) throws ParseException {

        // Variation(3번) Logic에서는  Trend를 보기위해 2번 로직을 사용한다.
        Long lHealthLogic=2L;

        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        Date previous=DateUtils.addDays(from, -90);
        Date lPrevious_date=new Date(previous.getTime());


//        List<List<Object>> eqpHealthTraceData= traceDataService.getTraceData(fabId, paramId, lPrevious_date, todate);
        List<List<Object>> eqpHealthTraceData= null;
        List<List<Object>> eqpHealthFeatureData= summaryDataService.getSummaryDataForHealth(fabId, paramId, lHealthLogic ,lPrevious_date, to);

        return summaryDataService.eqpHealthTrendChartWithAVG(fabId,previous, from, to, paramId , eqpHealthFeatureData, eqpHealthTraceData);

    }

    @RequestMapping("/params/{paramId}/eqpHealthTrendChartWithRUL")
    public Object eqpHealthTrendChartWithRUL(@PathVariable("fabId") String fabId,
                                             @PathVariable("paramId") Long paramId,
                                             @RequestParam("fromdate") Long fromdate,
                                             @RequestParam("todate") Long todate) throws ParseException {

        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        Date previous=DateUtils.addDays(from, -7);
        Date lPrevious=new Date(previous.getTime());

        //RUL(4번) Logic에서는  param health index를 저장하지 않는다. Trend를 보기위해 2번 로직을 사용한다.
        Long lHealthLogic=2L;

        List<List<Object>> eqpHealthFeatureData= summaryDataService.getSummaryDataForHealth(fabId, paramId, lHealthLogic ,lPrevious, to);

        return summaryDataService.eqpHealthTrendChartWithRUL(fabId, from, to, paramId , eqpHealthFeatureData);


    }


    @RequestMapping("eqps/{eqpId}/eqpHealthIndexGetWorstParam")
    public Object eqpHealthIndexWorstParam(@PathVariable("fabId") String fabId,
                                             @PathVariable("eqpId") Long eqpId,
                                             @RequestParam("fromdate") Long fromdate,
                                             @RequestParam("todate") Long todate) throws ParseException {


        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        return summaryDataService.eqpHealthIndexGetWorstParam(fabId, eqpId ,from, to);


    }

    @RequestMapping(method = RequestMethod.POST, value ="/areas/{areaId}/eqps/{eqpId}/params/{paramId}/summarydata")
    public Object getSummaryData(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId,
                                 @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate,
                                 @RequestBody List<String> adHocFucntions) {
        return summaryDataService.getSummaryData(fabId,paramId,fromdate,todate,adHocFucntions);
    }

    @RequestMapping("worstEqps")
    public List<HealthInfo> worstEqps(@PathVariable("fabId") String fabId,
                                      @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate,
                                      @RequestParam("numberOfWorst") Integer numberOfWorst) throws ParseException {
        Date fromDate = new Date(fromdate);
        SimpleDateFormat df = new SimpleDateFormat("yyyyy-MM-dd hh:mm:ss");
        String fromDateStr = df.format(fromDate);
        Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDateStr);

        Date to = new Date(todate);

        List<EqpStatusData> result = Collections.EMPTY_LIST;

        return summaryDataService.getWorstEqpsByHealthIndex(fabId,from,to,numberOfWorst);

    }

}

