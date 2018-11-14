package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.common.SocketMessage;
import com.bistel.a3.portal.domain.pdm.EqpHealthIndexTrend;
import com.bistel.a3.portal.domain.pdm.EqpStatusData;
import com.bistel.a3.portal.domain.pdm.db.HealthInfo;
import com.bistel.a3.portal.domain.pdm.std.master.STDConditionalSpec;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class RegressionController {

    @Autowired
    private IReportService reportService;

    @RequestMapping(value="params/{paramId}/getRegressionTrend", method = RequestMethod.GET)
    public Object getRegressionTrend(@PathVariable("fabId") String fabId,
                                   @PathVariable("paramId") Long paramId,
                                   @RequestParam("fromdate") Long fromdate,
                                   @RequestParam("todate") Long todate) throws ParseException {

        boolean xIsDate=true;

        return reportService.getFeatureTrxTrend(fabId,paramId,fromdate,todate,true);

    }



}

