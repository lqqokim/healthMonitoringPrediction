package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.service.pdm.IReportService;
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
    public Object getCorrelationTrend(@PathVariable("fabId") String fabId,
                                      @RequestParam("fromdate") Long fromdate,
                                      @RequestParam("todate") Long todate,
                                      @RequestBody Long[] paramIds ) throws ParseException {

        ArrayList<Object> featureListbyParamIds=new ArrayList<>();

        boolean xIsDate=false;
        for (int i = 0; i < paramIds.length; i++) {

            featureListbyParamIds.add(reportService.getFeatureTrxTrend(fabId,paramIds[i],fromdate,todate,xIsDate));
        }
        return featureListbyParamIds;



    }

}

