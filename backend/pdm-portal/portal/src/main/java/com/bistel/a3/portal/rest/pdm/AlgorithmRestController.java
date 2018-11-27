package com.bistel.a3.portal.rest.pdm;


import BISTel.PeakPerformance.Statistics.Algorithm.Stat.Regression.SimpleLinearRegression;
import BISTel.PeakPerformance.Statistics.Algorithm.Stat.StStat;
import com.bistel.a3.portal.domain.common.SocketMessage;
import com.bistel.a3.portal.domain.pdm.Correlation;
import com.bistel.a3.portal.domain.pdm.ImageChartData;
import com.bistel.a3.portal.domain.pdm.Regression;
import com.bistel.a3.portal.service.pdm.IImageService;
import com.bistel.a3.portal.service.pdm.impl.std.ReportService;
import org.apache.commons.lang3.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("pdm")
public class AlgorithmRestController {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ReportService reportService;

    @Autowired
    private IImageService imageService;

    @RequestMapping(value="/getRegression", method = RequestMethod.GET)
    public Regression getRegression(@RequestParam("sessionId") String sessionId,
                                    @RequestParam("fromdate") Long fromdate,
                                    @RequestParam("todate") Long todate) throws ParseException {



        Regression regressionData=new Regression();

        List<List<Double>> fileFilterData = imageService.getRegressionInput(sessionId, fromdate, todate);



        double[] xValue=new double[fileFilterData.get(0).size()];
        double[] yValue= new double[fileFilterData.get(1).size()];
        for (int i = 0; i < fileFilterData.get(0).size(); i++) {

            xValue[i]=fileFilterData.get(0).get(i);
        }
        for (int i = 0; i < fileFilterData.get(1).size(); i++) {

            yValue[i]=fileFilterData.get(1).get(i);
        }

//        double[] xValue=ArrayUtils.toPrimitive((Double[])fileFilterData.get(0).toArray());
//        double[] yValue=ArrayUtils.toPrimitive((Double[])fileFilterData.get(1).toArray());



        SimpleLinearRegression simpleLinearRegression=new SimpleLinearRegression(xValue, yValue);

        double intercept=simpleLinearRegression.intercept();
        double slope=simpleLinearRegression.slope();
        double r2=simpleLinearRegression.R2();

        double start_yValue=(slope*xValue[0])+intercept;
        double end_yValue=(slope*xValue[xValue.length-1])+intercept;

        regressionData.setStart_xValue(xValue[0]);
        regressionData.setStart_yValue(start_yValue);
        regressionData.setEnd_xValue(xValue[xValue.length-1]);
        regressionData.setEnd_yValue(end_yValue);

        return regressionData;

    }



    @RequestMapping(value="/fabs/{fabId}/getCorrelationHeatMap", method = RequestMethod.POST)
    public Correlation getCorrelationByPivot(@PathVariable("fabId") String fabId,
                                             @RequestParam("fromdate") Long fromdate,
                                             @RequestParam("todate") Long todate,
                                             @RequestBody List<Long> paramList) throws ParseException {


        Correlation c=reportService.getCorrelationWithPivot(fabId, paramList, fromdate, todate);

        double[][] inputData=c.getCorrelationInput();
        double[][] correlation= StStat.correlation(inputData);

        for (int i = 0; i < correlation.length; i++) {

            correlation[i][i]=1;
        }
        Double nan=Double.NaN;
        for (int i = 0; i < correlation.length; i++) {
            for (int j = 0; j < correlation.length; j++) {
                if (Double.isNaN(correlation[i][j])){
                    correlation[i][j]=0.0;
                }
            }
        }

        c.setCorrelationInput(null);
        c.setCorrelationOutput(correlation);
        return c;

    }


}


