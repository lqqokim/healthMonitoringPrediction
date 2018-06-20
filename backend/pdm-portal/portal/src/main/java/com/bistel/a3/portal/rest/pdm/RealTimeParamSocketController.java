package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.common.SocketMessage;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class RealTimeParamSocketController {
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	public static HashMap<Long,List<String>> monitoringParamAndReplySubjects = new HashMap<>();
	public static HashMap<Long,List<Object>> monitoringParamLastUpdateDate = new HashMap<>(); //key:paramId value;[Date,FabId]

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private ITraceDataService traceDataService;

	@Autowired
	private IReportService reportService;

    @MessageMapping("/realtime_param")
    public void realtimeParam(SocketMessage message) throws Exception {
    	logger.debug("realtime_param");
		realTimeStart = true;

    	List<Object> tempParamRawIds =(List<Object>) message.getParameters().get("parameterIds"); //List
		String fabId = (String)message.getParameters().get("fabId");
		List<Long> paramRawIds = tempParamRawIds.stream()
				.map(element->Long.valueOf( element.toString()))
				.collect(Collectors.toList());

		String replySubject = message.getReplySubject();

		clearParamWithReplySubject(paramRawIds,replySubject);

		Date date = new Date();
		for (int i = 0; i < paramRawIds.size(); i++) {
			ParamWithCommon paramWithCommon = reportService.getParamWithComm(fabId,paramRawIds.get(i));
			if(monitoringParamAndReplySubjects.containsKey(paramRawIds.get(i))){
				monitoringParamAndReplySubjects.get(paramRawIds.get(i)).add(replySubject);
			}else{
				List<String> subjecs = new ArrayList<>();
				subjecs.add(replySubject);
				monitoringParamAndReplySubjects.put(paramRawIds.get(i),subjecs);
			}
			List<Object> values = new ArrayList<>();
			values.add(date);
			values.add(fabId);
			values.add(paramWithCommon);
			monitoringParamLastUpdateDate.put(paramRawIds.get(i),values);
		}

    }

	boolean realTimeStart = false;
	@Scheduled(cron = "0/3 * * * * *")
	public void realtimeDataCreate(){
		if(realTimeStart == false) return;

		Random rand = new Random(System.currentTimeMillis());
		for(Long paramId :monitoringParamAndReplySubjects.keySet()) {
			String fabId =(String) monitoringParamLastUpdateDate.get(paramId).get(1);
			ParamWithCommon paramInfo =(ParamWithCommon) monitoringParamLastUpdateDate.get(paramId).get(2);
			Date fromDate =(Date) monitoringParamLastUpdateDate.get(paramId).get(0);
			Date toDate = new Date();

			//real
//			List<List<Object>> datas = getParamData(fabId,paramId,fromDate,toDate);


			//demo
			Long datetime = new Date().getTime();
			List<List<Object>> datas = new ArrayList<>();
			for (int i = 0; i < 3; i++) {
				List<Object> data = new ArrayList<>();
				data.add(datetime + i * 100);
				data.add(rand.nextFloat());

				datas.add(data);
			}



			realtimeSendData(paramId, datas,paramInfo);
		}
	}

	private List<List<Object>> getParamData(String fabId,Long paramId, Date fromDate, Date toDate) {
		return traceDataService.getTraceData(fabId,paramId,fromDate.getTime(),toDate.getTime());
	}

	public void realtimeSendData(Long paramId,List<List<Object>> timeValues,ParamWithCommon paramInfo){

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
				reply.put("eqpName",paramInfo.getEqp_Name());
				reply.put("paramName",paramInfo.getName());

				replyMessage.setReply(reply);

				messagingTemplate.convertAndSend( subject,replyMessage );
			}

		}


	}
	private void clearParamWithReplySubject(List<Long> paramRawIds,String replySubject) {
		List<Long> keys =new ArrayList<>( monitoringParamAndReplySubjects.keySet()) ;
		for (int j=keys.size()-1;j>=0;j-- ) {
			Long key = keys.get(j);
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
		if(monitoringParamAndReplySubjects.size()==0){
			monitoringParamLastUpdateDate = new HashMap<>();
		}else {
			for (int i = 0; i < paramRawIds.size(); i++) {
				if (monitoringParamLastUpdateDate.containsKey(paramRawIds.get(i))) {
					monitoringParamLastUpdateDate.remove(paramRawIds.get(i));
				}
			}
		}

	}

}
