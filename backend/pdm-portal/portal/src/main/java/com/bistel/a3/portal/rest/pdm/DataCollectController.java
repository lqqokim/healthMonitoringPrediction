package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.service.pdm.IDataCollectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("pdm/data/fabs/{fabId}")
public class DataCollectController {

    @Autowired
    IDataCollectService dataCollectService;

    @RequestMapping(method = RequestMethod.POST, value = "/eqps/{eqpId}/params/{paramId}")
    public HashMap<String, Object> serverSaveModel(
            @PathVariable("fabId") String fabId,
            @PathVariable  Long eqpId,
            @PathVariable Long paramId,
            @RequestBody HashMap<String,Object> requestBody
    )
    {

        long date =Long.valueOf(requestBody.get("date").toString());
        int rpm =Integer.valueOf(requestBody.get("rpm").toString());
        double samplingTime =Double.valueOf(requestBody.get("samplingTime").toString());
        int samplingCount =Integer.valueOf(requestBody.get("samplingCount").toString());
        List<Double> dTimewave =(List<Double>)(requestBody.get("timewave"));
        double[] timewave = dTimewave.stream().mapToDouble(Double::doubleValue).toArray();

        Date date1 = new Date(date);

        return dataCollectService.inserData(fabId,eqpId,paramId,date1,timewave,rpm,samplingTime,samplingCount);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/eqps/{eqpId}/params/{paramId}/copyData")
    public HashMap<String, Object> copyData(
            @PathVariable("fabId") String fabId,
            @PathVariable Long eqpId,
            @PathVariable long paramId,
            @RequestParam Map<String, Object> allRequestParams) throws ParseException {

        SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd");

        String sFromDate = ((String) allRequestParams.get("fromdate"));
        Date fromDate = dt.parse(sFromDate);

        String sToDate=((String) allRequestParams.get("todate"));
        Date toDate = dt.parse(sToDate);

        String sTargetDate=((String) allRequestParams.get("targetdate"));
        Date targetDate = dt.parse(sTargetDate);

        //return dataCollectService.deleteAndCopy(fabId,paramId,fromDate,toDate,targetDate);
        return dataCollectService.copyData(fabId,paramId,paramId,fromDate,toDate,targetDate);

    }


    @RequestMapping(method = RequestMethod.POST, value = "/eqps/{fromEqpId}/eqps/{toEqpId}/demoDataCopyByEqp")
    public HashMap<String, Object> demoDataCopyByEqp(
            @PathVariable("fabId") String fabId,
            @PathVariable Long fromEqpId,
            @PathVariable Long toEqpId,
            @RequestParam Map<String, Object> allRequestParams) throws ParseException {

        SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd");

        String sFromDate = ((String) allRequestParams.get("fromdate"));
        Date fromDate = dt.parse(sFromDate);

        String sToDate=((String) allRequestParams.get("todate"));
        Date toDate = dt.parse(sToDate);

        String sTargetDate=((String) allRequestParams.get("targetdate"));
        Date targetDate = dt.parse(sTargetDate);

        return dataCollectService.demoDataCopyByEqp(fabId,fromEqpId,toEqpId,fromDate,toDate,targetDate);

    }
/*
    @RequestMapping(method = RequestMethod.POST, value = "/eqps/sampleRawId/{sampleRawId}/toParamId/{toParamId}/{toEqpId}/demoDataCopyByEqp")
    public HashMap<String, Object> sampleDataCopy(
            @PathVariable("fabId") String fabId,
            @PathVariable Long fromEqpId,
            @PathVariable Long toEqpId,
            @RequestParam Map<String, Object> allRequestParams) throws ParseException {



        return dataCollectService.sampleDataCopy(fabId, sampleRawId,toParamId,targetDate);

    }
*/

    /*
    @RequestMapping(method = RequestMethod.POST, value = "/eqps/{eqpId}/copyData")
    public HashMap<String, Object> copyDataByEqpId(
            @PathVariable("fabId") String fabId,
            @PathVariable Long eqpId,
            @PathVariable long paramId,
            @RequestParam Map<String, Object> allRequestParams,
            Principal user) throws ParseException {

        SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd");

        String sFromDate = ((String) allRequestParams.get("fromdate"));
        Date fromDate = dt.parse(sFromDate);

        String sToDate=((String) allRequestParams.get("todate"));
        Date toDate = dt.parse(sToDate);

        String sTargetDate=((String) allRequestParams.get("targetdate"));
        Date targetDate = dt.parse(sTargetDate);

        return dataCollectService.deleteAndCopyByEqpId(fabId,eqpId,fromDate,toDate,targetDate,user.getName());

    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/eqps/{eqpId}/params/{paramId}/deleteData")
    public HashMap<String, Object> deleteData(
            @PathVariable("fabId") String fabId,
            @PathVariable Long eqpId,
            @PathVariable long paramId,
            @RequestParam Map<String, Object> allRequestParams) throws ParseException {

        SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd");

        String sFromDate = ((String) allRequestParams.get("fromdate"));
        Date fromDate = dt.parse(sFromDate);

        String sToDate=((String) allRequestParams.get("todate"));
        Date toDate = dt.parse(sToDate);

        return dataCollectService.deleteData(fabId,paramId,fromDate,toDate);

    }
  */


}
