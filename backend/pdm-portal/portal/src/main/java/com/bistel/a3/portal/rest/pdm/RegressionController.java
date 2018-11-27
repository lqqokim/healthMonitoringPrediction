package com.bistel.a3.portal.rest.pdm;


import BISTel.PeakPerformance.Statistics.Algorithm.Stat.Regression.SimpleLinearRegression;
import com.bistel.a3.portal.domain.common.SocketMessage;
import com.bistel.a3.portal.domain.pdm.ImageChartData;
import com.bistel.a3.portal.domain.pdm.Regression;
import com.bistel.a3.portal.service.pdm.IImageService;
import com.bistel.a3.portal.service.pdm.impl.std.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.*;
import java.util.List;
import java.util.ArrayList;

@Controller
public class RegressionController {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ReportService reportService;

    @Autowired
    private IImageService imageService;

    @MessageMapping("/getRegressionTrend")
    public void realtimeParam(SocketMessage message, SimpMessageHeaderAccessor headerAccessor) throws Exception {

        String conditon = (String)message.getParameters().get("type");
        String replySubject = message.getReplySubject();
        int height =  (int)message.getParameters().get("imageHeight");
        int width =  (int)message.getParameters().get("imageWidth");


        Map<String, Object> replyMessage = new HashMap<>();

        if(conditon.equals("Origin")){
            String sessionId = (String)message.getParameters().get("sessionId");
            List<List<Object>> originData = imageService.getOriginData(sessionId);
            ImageChartData imageChartData = imageService.drawImageChart(width,height,0,2, originData, sessionId);
            replyMessage = imageService.createSendMessages(imageChartData,conditon, sessionId);

        }else{
            Long fromdate = (Long)message.getParameters().get("fromdate");
            Long todate = (Long)message.getParameters().get("todate");
            int days = imageService.diffdays(fromdate,todate);
            int trendDataSize = 100000;
            if(conditon.equals("Zoom")){
                String sessionId = (String)message.getParameters().get("sessionId");
                List<List<Object>> fileFilterData = imageService.getData(sessionId, fromdate, todate);

                if(fileFilterData.size() >= trendDataSize){
                    ImageChartData imageChartData = imageService.drawImageChart(width,height,0,2, fileFilterData, sessionId);
                    replyMessage = imageService.createSendMessages(imageChartData,conditon,sessionId);
                }else {
                    conditon = "trend";
                    replyMessage = imageService.createSendMessages(fileFilterData,conditon,sessionId);
                }

            }else{ // default
                String sessionId = (String)message.getParameters().get("sessionId");
//                String simpSessionId = headerAccessor.getHeader("simpSessionId").toString();
                //값추출
                String fabId = (String)message.getParameters().get("fabId");
                Long paramId= ((Integer) message.getParameters().get("paramId")).longValue();

                boolean xIsDate=true;
                List<List<Object>> regressionTrend = reportService.getFeatureTrxTrend(fabId,paramId,fromdate,todate,true);

//                String sessionId = simpSessionId;

                List<String[]> data = new ArrayList<String[]>();
                for(int i=0;i<regressionTrend.size();i++){
                    List<Object> rowData = regressionTrend.get(i);
                    String csvVal1 = rowData.get(0).toString(); //TimeStamp
                    String csvVal2 = rowData.get(1).toString(); //Data
                    data.add(new String[] {csvVal1,csvVal2});
                }
                imageService.writeCsv(data, sessionId);

                if(regressionTrend.size() >= trendDataSize){
                    ImageChartData imageChartData = imageService.drawImageChart(width,height,0,2, regressionTrend, sessionId);
                    replyMessage = imageService.createSendMessages(imageChartData,conditon,sessionId);
                }else {
                    conditon = "trend";
                    replyMessage = imageService.createSendMessages(regressionTrend,conditon,sessionId);
                }

            }
        }
        messagingTemplate.convertAndSend(replySubject, replyMessage);
    }









}

