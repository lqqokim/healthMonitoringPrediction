package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.service.pdm.IElectricCurrentSerivce;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import com.bistel.a3.portal.service.pdm.ITraceRawDataService;
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
}
