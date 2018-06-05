package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.service.pdm.IHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class HealthContoller {
    @Autowired
    private IHealthService healthIndexService;

    @RequestMapping("areas/{areaId}/eqps/{eqpId}/healthindex")
    public Object healthindex(
            @PathVariable("fabId") String fabId,
            @PathVariable("eqpId") Long eqpId,
            @RequestParam(value = "fromdate", required = false) Long fromdate,
            @RequestParam(value = "todate", required = false) Long todate) throws IOException, ParseException, ExecutionException, InterruptedException {
        return healthIndexService.getDailyHealth(fabId, eqpId, fromdate, todate);
    }

    @RequestMapping("healthmodels")
    public Object healthmodels(@PathVariable("fabId") String fabId) {
        return healthIndexService.getEqpsWithModel(fabId);
    }
    @RequestMapping("eqps/{eqpId}/healthmodel")
    public Object healthmodel(@PathVariable("fabId") String fabId,@PathVariable("eqpId") long eqpId) {
        return healthIndexService.getModelDataByEqpId(fabId,eqpId);
    }


    @RequestMapping("areas/{areaId}/eqps/{eqpId}/contribute")
    public Object contribute(
            @PathVariable("fabId") String fabId,
            @PathVariable("eqpId") Long eqpId,
            @RequestParam(value = "fromdate", required = false) Long fromdate,
            @RequestParam(value = "todate", required = false) Long todate) throws IOException, ParseException, ExecutionException, InterruptedException {
        return healthIndexService.getContribution(fabId, eqpId, fromdate, todate);
    }



    @RequestMapping(method = RequestMethod.POST, value = "/automodeler")
    public HashMap<String, Object> autoModeler(
            Principal user,
            @PathVariable("fabId") String fabId,
            @RequestParam Map<String, Object> allRequestParams) throws ParseException {

        Date fromDate =  new SimpleDateFormat("yyyy-MM-dd").parse( (String)allRequestParams.get("fromdate"));
        Date toDate = new SimpleDateFormat("yyyy-MM-dd").parse( (String) allRequestParams.get("todate"));
        Boolean unModelOnly = Boolean.valueOf((String)allRequestParams.get("UnModelOnly"));
        int monthRange =Integer.valueOf ((String)allRequestParams.get("monthRange"));
        return healthIndexService.autoModeler(user,fabId,fromDate,toDate,unModelOnly,monthRange);

    }
    @RequestMapping(method = RequestMethod.GET, value = "/automodelerstatus")
    public HashMap<String, Object> autoModelerStatus(
            Principal user,
            @PathVariable("fabId") String fabId) throws ParseException {

        return healthIndexService.autoModelerStatus(user,fabId);
    }
    //=========================//
    //Modeller Image Chart 적용 //
    //=========================//
    @RequestMapping(method = RequestMethod.GET, value = "/eqps/{eqpId}/ServerAnalysisData")
    public HashMap<String, Object> getServerAnalysisData(
            @PathVariable("fabId") String fabId,
            @PathVariable Long eqpId,
            @RequestParam Map<String, Object> allRequestParams) {

        long lFromDate = Long.valueOf((String) allRequestParams.get("fromdate"));
        long lToDate = Long.valueOf((String) allRequestParams.get("todate"));
        Date fromDate = new Date(lFromDate);
        Date toDate = new Date(lToDate);

        return healthIndexService.getServerAnalysisData(fabId,eqpId,fromDate,toDate);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/eqps/{eqpId}/ServerBuildAndHealth")
    public HashMap<String, Object> getServerBuildAndHealth(
            @PathVariable("fabId") String fabId,
            @PathVariable Long eqpId,
            @RequestParam Map<String, Object> allRequestParams,
            @RequestBody HashMap<String, Object> keyValues
            ) {

        long lFromDate = Long.valueOf((String) allRequestParams.get("fromdate"));
        long lToDate = Long.valueOf((String) allRequestParams.get("todate"));
        String dataId = (String) allRequestParams.get("dataId");
        int width = Integer.valueOf( (String)allRequestParams.get("width"));
        int height = Integer.valueOf( (String)allRequestParams.get("height"));

        List<String> parameters =(List<String>) keyValues.get("parameters");

        return healthIndexService.getServerBuildAndHealth(fabId,eqpId,dataId,lFromDate,lToDate,parameters,width,height);

    }

    @RequestMapping(method = RequestMethod.GET, value = "/ServerPCA")
    public HashMap<String, Object> getServerPCA(
            @PathVariable("fabId") String fabId,
            @RequestParam Map<String, Object> allRequestParams)  {
        long a_fromDate = Long.valueOf((String) allRequestParams.get("a_fromdate"));
        long a_toDate = Long.valueOf((String) allRequestParams.get("a_todate"));
        long b_fromDate = Long.valueOf((String) allRequestParams.get("b_fromdate"));
        long b_toDate = Long.valueOf((String) allRequestParams.get("b_todate"));
        String dataId = (String)allRequestParams.get("dataId");

        return healthIndexService.getServerPCA(dataId,fabId,a_fromDate,a_toDate,b_fromDate ,b_toDate);
    }
    @RequestMapping(method = RequestMethod.GET, value = "/ServerAnalysis")
    public HashMap<String, Object> getServerAnalysis(
            @PathVariable("fabId") String fabId,
            @RequestParam Map<String, Object> allRequestParams)  {
        long a_fromDate = Long.valueOf((String) allRequestParams.get("a_fromdate"));
        long a_toDate = Long.valueOf((String) allRequestParams.get("a_todate"));
        long b_fromDate = Long.valueOf((String) allRequestParams.get("b_fromdate"));
        long b_toDate = Long.valueOf((String) allRequestParams.get("b_todate"));
        String dataId = (String)allRequestParams.get("dataId");

        return healthIndexService.getServerAnalysis(dataId,a_fromDate,a_toDate,b_fromDate ,b_toDate);
    }
    @RequestMapping(method = RequestMethod.POST, value = "/eqps/{eqpId}/ServerSaveModel")
    public HashMap<String, Object> serverSaveModel(
            @PathVariable("fabId") String fabId,
            @PathVariable Long eqpId,
            @RequestParam Map<String, Object> allRequestParams)  {

        String dataId = (String) allRequestParams.get("dataId");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        return healthIndexService.saveSeverModel(fabId,userId,dataId);

    }

    @RequestMapping(method = RequestMethod.POST, value = "/ServerChart")
    public HashMap<String, Object> getServerChart(
            @PathVariable("fabId") String fabId,
            @RequestParam Map<String, Object> allRequestParams,
            @RequestBody HashMap<String, Object> keyValues) {

        long lFromDate = Long.valueOf((String) allRequestParams.get("fromdate"));
        long lToDate = Long.valueOf((String) allRequestParams.get("todate"));
        int width = Integer.valueOf((String) allRequestParams.get("width"));
        int height =Integer.valueOf((String)allRequestParams.get("height"));
        String chartType =(String)allRequestParams.get("charttype");

        List<String> parameters =(List<String>) keyValues.get("parameters");

        String dataId = (String) allRequestParams.get("dataId");
//        String chartType ="normal";//normal,scale
        return healthIndexService.getServerChart(dataId,chartType,lFromDate,lToDate,parameters,width,height);
    }
    @RequestMapping(method = RequestMethod.POST, value = "/ServerHealthIndexChart")
    public HashMap<String, Object> getServerHealthIndexChart(
            @PathVariable("fabId") String fabId,
            @RequestParam Map<String, Object> allRequestParams,
            @RequestBody HashMap<String, Object> keyValues) {

        long lFromDate = Long.valueOf((String) allRequestParams.get("fromdate"));
        long lToDate = Long.valueOf((String) allRequestParams.get("todate"));
        int width = Integer.valueOf((String) allRequestParams.get("width"));
        int height =Integer.valueOf((String)allRequestParams.get("height"));
        String chartType =(String)allRequestParams.get("charttype");

        Double yMin=null;
        Double yMax = null;
        if(allRequestParams.get("yMin")!=null) {
            yMin =Double.valueOf((String)allRequestParams.get("yMin"));
        }
        if(allRequestParams.get("yMax")!=null){
            yMax  =Double.valueOf((String)allRequestParams.get("yMax"));
        }


        List<String> parameters =(List<String>) keyValues.get("parameters");

        String dataId = (String) allRequestParams.get("dataId");
//        String chartType ="normal";//normal,scale
        return healthIndexService.getServerHealthIndexChart(dataId,lFromDate,lToDate,width,height,yMin,yMax);
    }
    @RequestMapping(method = RequestMethod.GET, value = "/eqps/{eqpId}/ServerHealthIndexChartByModel")
    public HashMap<String, Object> getServerHealthIndexChartByModel(
            @PathVariable("fabId") String fabId,
            @PathVariable Long eqpId,
            @RequestParam Map<String, Object> allRequestParams) {

        long lFromDate = Long.valueOf((String) allRequestParams.get("fromdate"));
        long lToDate = Long.valueOf((String) allRequestParams.get("todate"));
        int width = Integer.valueOf((String) allRequestParams.get("width"));
        int height =Integer.valueOf((String)allRequestParams.get("height"));

        String dataId = (String) allRequestParams.get("dataId");

//        String chartType ="normal";//normal,scale
        return healthIndexService.getServerHealthIndexChartByModel(fabId, eqpId,dataId,lFromDate,lToDate,width,height);
    }
    @RequestMapping(method = RequestMethod.POST, value = "/ServerOutlier")
    public HashMap<String, Object> getServerOutlier(
            @PathVariable("fabId") String fabId,
            @RequestParam Map<String, Object> allRequestParams,
            @RequestBody HashMap<String, Object> keyValues) {

        long lFromDate = Long.valueOf((String) allRequestParams.get("fromdate"));
        long lToDate = Long.valueOf((String) allRequestParams.get("todate"));


        String dataId = (String) allRequestParams.get("dataId");
        int width = Integer.valueOf((String) allRequestParams.get("width"));
        int height = Integer.valueOf((String)allRequestParams.get("height"));
        long startX = Long.valueOf((String) allRequestParams.get("startX"));
        long endX = Long.valueOf ((String)allRequestParams.get("endX"));
        double startY = Double.valueOf((String)allRequestParams.get("startY"));
        double endY =Double.valueOf ( (String)allRequestParams.get("endY"));
        List<String> parameters =(List<String>) keyValues.get("parameters");
        String outlierType=(String) allRequestParams.get("outliertype"); //copy,delete
        String chartType =(String) allRequestParams.get("charttype");//normal,scale

        return healthIndexService.getServerOutlier(dataId,outlierType,lFromDate,lToDate,parameters,width,height,startX,endX,startY,endY);
    }

}
