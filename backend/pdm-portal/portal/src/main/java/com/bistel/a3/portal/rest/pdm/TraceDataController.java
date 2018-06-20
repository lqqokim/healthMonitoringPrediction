package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.service.pdm.IElectricCurrentSerivce;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import com.bistel.a3.portal.service.pdm.ITraceRawDataService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("pdm/fabs/{fabId}/areas/{areaId}/eqps/{eqpId}")
public class TraceDataController {
    @Autowired
    private ITraceDataService traceDataService;

    @Autowired
    private ITraceRawDataService traceRawDataService;


    @Autowired
    private BeanFactory factory;



    @RequestMapping("params/{paramId}/tracedata")
    public Object getTraceData(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId, @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return traceDataService.getTraceData(fabId, paramId, fromdate, todate);
    }

    @RequestMapping("params/{paramId}/eventsimulation")
    public Object getTraceData(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId,
                               @RequestParam("condition") Float condition,
                               @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return traceDataService.getEventSimulation(fabId, paramId, fromdate, todate,condition);
    }
    @RequestMapping(method = RequestMethod.POST, value ="params/{paramId}/eventsimulationbyconditionvalue")
    public Object getTraceDataSimulationByEvent(@PathVariable("fabId") String fabId, @PathVariable("paramId") Long paramId,
                                                @RequestParam("conditionParamId") Long conditionParamId,@RequestParam("conditionValue") Float conditionValue,
                                                @RequestParam("eventType") String eventType,@RequestParam("adHocTime") Integer adHocTime,
                                                @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate,
                                                @RequestBody List<String> adHocFucntions) {
        return traceDataService.getEventSimulationByConditionValue(fabId, paramId, fromdate, todate,conditionParamId,conditionValue,eventType,adHocFucntions,adHocTime);
    }
}
