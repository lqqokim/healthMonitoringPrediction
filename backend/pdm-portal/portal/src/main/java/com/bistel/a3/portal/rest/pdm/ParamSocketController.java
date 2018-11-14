package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.common.util.imageChart.ImageChart;
import com.bistel.a3.portal.domain.common.SocketMessage;
import com.bistel.a3.portal.domain.pdm.AreaFaultCountSummary;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.service.pdm.IHealthService;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import com.bistel.a3.portal.service.pdm.impl.std.HealthService;
import com.bistel.a3.portal.service.pdm.impl.std.ReportService;
import com.bistel.a3.portal.socket.WebSocketEventListener;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;



@Controller
public class ParamSocketController {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private IHealthService iHealthService;

    @Autowired
    private ISummaryDataService summaryDataService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ReportService reportService;

    @MessageMapping("/getRegressionTrend")
    public void realtimeParam(SocketMessage message, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        String simpSessionId = headerAccessor.getHeader("simpSessionId").toString();

        //값추출
        String fabId = (String)message.getParameters().get("fabId");
        Long paramId= ((Integer) message.getParameters().get("paramId")).longValue();
        Long fromdate = (Long)message.getParameters().get("fromdate");
        Long todate = (Long)message.getParameters().get("todate");

        String replySubject = message.getReplySubject();

        Map<String,Object> replyMessage = new HashMap<String,Object>();

        int days=diffdays(fromdate,todate);

//        if(days>5)
//        {
//            replyMessage.put("chartFlag", "image");
//            replyMessage.put("replyConditon","finish");
//        }
//        else{
            //List<List<Object>> regressionTrend=reportService.getHealthIndexTrend(fabId,paramId,fromdate,todate);
        boolean xIsDate=true;
        List<List<Object>> regressionTrend=reportService.getFeatureTrxTrend(fabId,paramId,fromdate,todate,xIsDate);

            replyMessage.put("chartFlag", "trand");
            replyMessage.put("datas", regressionTrend);
            replyMessage.put("replyConditon","finish");
//        }

        messagingTemplate.convertAndSend(replySubject, replyMessage);
    }

    private int diffdays(Long from, Long to)
    {

        long diff = to-from;
        int diffDays = (int) (diff / (24 * 60 * 60 * 1000));

        return diffDays;
    }



}