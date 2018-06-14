package com.bistel.a3.portal.rest.pdm;



import com.bistel.a3.portal.domain.analysis.AnalysisFilterData;
import com.bistel.a3.portal.domain.common.SocketMessage;
import com.bistel.a3.portal.util.date.DateUtil;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Controller
public class RealTimeParamSocketController {
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	public static HashMap<Long,List<String>> monitoringParamAndReplySubjects = new HashMap<>();

	@Autowired
	private SimpMessagingTemplate messagingTemplate;



    @MessageMapping("/realtime_param")
    public void realtimeParam(SocketMessage message) throws Exception {
    	logger.debug("realtime_param");

    	List<Object> tempParamRawIds =(List<Object>) message.getParameters().get("parameterIds"); //List

		List<Long> paramRawIds = tempParamRawIds.stream()
				.map(element->Long.valueOf( element.toString()))
				.collect(Collectors.toList());

		String replySubject = message.getReplySubject();

		clearParamWithReplySubject(replySubject);


		for (int i = 0; i < paramRawIds.size(); i++) {
			if(monitoringParamAndReplySubjects.containsKey(paramRawIds.get(i))){
				monitoringParamAndReplySubjects.get(paramRawIds.get(i)).add(replySubject);
			}else{
				List<String> subjecs = new ArrayList<>();
				subjecs.add(replySubject);
				monitoringParamAndReplySubjects.put(paramRawIds.get(i),subjecs);
			}
		}



		

    }


//	@Scheduled(cron = "0/1 * * * * *")
	public void realtimeDataCreate(){
		Long paramId = 95l;

		Long datetime = new Date().getTime();
		List<List<Object>> timeValue = new ArrayList<>();
		Random rn = new Random();
		for (int i = 0; i < 3; i++) {
			List<Object> data = new ArrayList<>();
			data.add(datetime+i*100);
			data.add(rn.nextFloat());

			timeValue.add(data);
		}

		realtimeSendData(paramId,timeValue);
	}
	public void realtimeSendData(Long paramId,List<List<Object>> timeValues){

    	List<String> subjects = monitoringParamAndReplySubjects.get(paramId);

    	if(subjects!=null && subjects.size()>0){

			for (int i = 0; i < subjects.size(); i++) {
				String subject = subjects.get(i);
				SocketMessage replyMessage = new SocketMessage();
				replyMessage.setStatus(SocketMessage.Status.Response.toString());
				replyMessage.setType(SocketMessage.Type.Progress.toString());
				HashMap<String,Object> reply = new HashMap<String,Object>();
				reply.put("type", "info");
				reply.put("paramId",paramId);
				reply.put("datas",timeValues);

				replyMessage.setReply(reply);

				messagingTemplate.convertAndSend( subject,replyMessage );
			}

		}


	}
	private void clearParamWithReplySubject(String replySubject) {
		for (Long key : monitoringParamAndReplySubjects.keySet()) {
			List<String> subjecs = monitoringParamAndReplySubjects.get(key);
			for (int i = subjecs.size()-1; i >=0 ; i--) {
				if(subjecs.get(i).equals(replySubject)){
					subjecs.remove(i);
				}
			}
			if(subjecs.size()==0){
				monitoringParamAndReplySubjects.remove(key);
			}
		}
	}

}
