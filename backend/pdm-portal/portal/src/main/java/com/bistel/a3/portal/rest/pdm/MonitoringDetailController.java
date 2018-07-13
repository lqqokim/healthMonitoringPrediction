package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.service.pdm.*;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("pdm/fabs/{fabId}/areas/{areaId}/eqps/{eqpId}")
public class MonitoringDetailController {
    @Autowired
    private ITraceDataService traceDataService;

    @Autowired
    private ITraceRawDataService traceRawDataService;

    @Autowired
    private IReportService reportService;

    @Autowired
    private IElectricCurrentSerivce electricCurrentSerivce;

    @Autowired
    private BeanFactory factory;


    @RequestMapping("params/{paramId}/detail")
    public Object paramInfo(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId) {
        return reportService.getParamWithComm(fabId, paramId);
    }

    @RequestMapping("params/{paramId}/overallminute")
    public Object overallminute(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return traceDataService.getTraceData(fabId, paramId, fromdate, todate);
    }

    @RequestMapping("params/{paramId}/paramfeature")
    public Object paramFeature(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return traceDataService.getFeatureData(fabId, paramId, fromdate, todate);
    }

    @RequestMapping("params/{paramId}/paramfeaturewithrul")
    public Object paramFeatureWithRUL(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId, @PathVariable("paramId") Long paramId,
                                      @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return reportService.getFeatureDataWithRUL(fabId, eqpId, paramId, fromdate, todate);
    }


    @RequestMapping("params/{paramId}/overallminutespec")
    public Object overallminutespec(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return reportService.getOverallMinuteTrxSpec(fabId, paramId, fromdate, todate);
    }

    @RequestMapping("params/{paramId}/overallminutespecconfig")
    public Object overallminutespecconfig(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId) {
        return reportService.getOverallMinuteTrxSpecConfig(fabId, paramId);
    }

    @RequestMapping("maintenance")
    public Object maintenance(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return reportService.getAlarmsByEqpId(fabId, eqpId, fromdate, todate);
    }

    @RequestMapping("params/{paramId}/measuretrx")
    public Object measuretrx(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return traceDataService.getMeasureTrxData(fabId, paramId, fromdate, todate);
    }

    @RequestMapping("measuretrxbin/{measureTrxId}/rpm")
    public Object measuretrxbinRpm(@PathVariable("fabId") String fabId, @PathVariable("measureTrxId") Long measureTrxId) {
        return traceDataService.getRpmData(fabId, measureTrxId);
    }

    @RequestMapping("measuretrxbin/{measureTrxId}/timewave")
    public Object measuretrxbinTimewave(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId, @PathVariable("measureTrxId") Long measureTrxId) {
        return traceRawDataService.getTimewaveData(fabId, measureTrxId);
    }

    @RequestMapping("measuretrxbin/{measureTrxId}/spectrum")
    public Object measuretrxbinSpectrum(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId, @PathVariable("measureTrxId") Long measureTrxId) {
        return traceRawDataService.getSpectrumData(fabId, measureTrxId);
    }

    @RequestMapping("measuretrxbin/{measureTrxId}/analysis")
    public Object causeAnalysis(@PathVariable("fabId") String fabId, @PathVariable("measureTrxId") Long measureTrxId) {
        return traceDataService.getCauseAnalysis(fabId, null, measureTrxId);
    }
    @RequestMapping("/params/{paramId}/analysisInfo")
    public  HashMap<String, Object> analysisInfo(
            @PathVariable("fabId") String fabId,
            @PathVariable("eqpId") Long eqpId,
            @PathVariable("paramId") Long paramId,
            @RequestParam(value = "fromdate", required = false) Long fromdate,
            @RequestParam(value = "todate", required = false) Long todate,
            @RequestParam(value = "rate", required = false) Double rate
            ) throws IOException, ParseException, ExecutionException, InterruptedException {


        HashMap<String,Object> result = new HashMap<>();

        try {
            result.put("result", "success");
            result.put("data", traceDataService.getCauseAnalysisByParamId(fabId, paramId, new Date(fromdate), new Date(todate), rate));
        } catch (Exception err) {
            result.put("result", "fail");
            result.put("data", err.getMessage());
        }
        return result;
    }
    @RequestMapping("/createmeasuredata")
    public  HashMap<String, Object> createmeasuredata(
            @PathVariable("fabId") String fabId,
            @PathVariable("eqpId") Long eqpId,
            @RequestParam(value = "fromdate", required = false) String fromdate,
            @RequestParam(value = "todate", required = false) String todate,HttpServletRequest request) throws IOException, ParseException, ExecutionException, InterruptedException {


        HashMap<String,Object> result = new HashMap<>();
        try {
            result.put("result", "success");
            result.put("data", traceDataService.createMeasureData(request, fabId, eqpId, DateUtil.createDate(fromdate), DateUtil.createDate(todate)));
        } catch (Exception err) {
            result.put("result", "fail");
            result.put("data", err.getMessage());
        }
        return result;
    }

    @RequestMapping("measuretrxbin/{measureTrxId}/modelmeasuretrx")
    public Object modelmeasuretrx(@PathVariable("fabId") String fabId, @PathVariable("measureTrxId") Long measureTrxId) {
        return traceDataService.getModelMeasureTrx(fabId, measureTrxId);
    }

    @RequestMapping("electriccurrent")
    public Object electriccurrent(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return electricCurrentSerivce.getElectriccurrent(fabId, eqpId, fromdate, todate);
    }

    @RequestMapping("univariatevariation")
    public Object univariatevariation(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId, @RequestParam("time") Long time) {
        Date end = new Date(time);
        Date start = DateUtils.truncate(end, Calendar.DATE);

        return reportService.getUnivariatevariation(fabId, eqpId, start, end);
    }
    @RequestMapping("tracedata")
    public Object tracedata(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate, @RequestParam("normalizeType") String normalizeType) {

        return reportService.getTraceData(fabId, eqpId, new Date(fromdate),new Date(todate),normalizeType); //normalizeType:alarm,warning
    }

}
