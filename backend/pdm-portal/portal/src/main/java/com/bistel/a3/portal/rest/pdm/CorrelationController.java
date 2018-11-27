package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.dao.pdm.std.master.STDParamMapper;
import com.bistel.a3.portal.dao.pdm.std.report.STDReportMapper;
import com.bistel.a3.portal.domain.pdm.Correlation;
import com.bistel.a3.portal.domain.pdm.Regression;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class CorrelationController {

    @Autowired
    private IReportService reportService;


    @RequestMapping(method = RequestMethod.POST, value="/getCorrelationTrend")
    public Correlation getCorrelationTrend(@PathVariable("fabId") String fabId,
                                           @RequestParam("fromdate") Long fromdate,
                                           @RequestParam("todate") Long todate,
                                           @RequestBody Long[] paramIds ) throws ParseException {


        ArrayList<Object> trendListbyParamIds=new ArrayList<>();
        List<List<Object>> scatterDatas=new ArrayList<>();
        Regression scatterRegression=new Regression();
        List<String> paramNames=new ArrayList<>();

        Correlation c=new Correlation();
        Correlation scatter=new Correlation();
        boolean xIsDate=false;
        for (int i = 0; i < paramIds.length; i++) {

            trendListbyParamIds.add(reportService.getFeatureTrxTrend(fabId,paramIds[i],fromdate,todate,xIsDate));
            paramNames.add(reportService.getParamWithComm(fabId,paramIds[i]).getName());
        }

        scatter=reportService.getScatter(fabId, paramIds, fromdate, todate);
        scatterDatas=scatter.getCorrelationScatter();
        scatterRegression=scatter.getRegression();

        c.setCorrelationTrend(trendListbyParamIds);
        c.setParamNames(paramNames);
        c.setCorrelationScatter(scatterDatas);
        c.setRegression(scatterRegression);
        return c;
    }

}

