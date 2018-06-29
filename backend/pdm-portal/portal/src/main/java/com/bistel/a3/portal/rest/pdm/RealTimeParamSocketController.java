package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.common.SocketMessage;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import com.bistel.a3.portal.socket.WebSocketEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class RealTimeParamSocketController {
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	//paramId1: 	reaplySubject1 : simpSessionId1
    //				reaplySubject2 : simpSessionId2
	//paramId2: 	reaplySubject1 : simpSessionId1
	//				reaplySubject2	 simpSessionId2

	public static HashMap<Long,List<List<String>>> monitoringParamAndReplySubjects = new HashMap<>();
	public static HashMap<Long,List<Object>> monitoringParamLastUpdateDate = new HashMap<>(); //key:paramId value;[Date,FabId]

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private ITraceDataService traceDataService;

	@Autowired
	private IReportService reportService;

    @MessageMapping("/realtime_param")
    public void realtimeParam(SocketMessage message,SimpMessageHeaderAccessor headerAccessor) throws Exception {
    	String simpSessionId = headerAccessor.getHeader("simpSessionId").toString();
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
				List<String> replySubjectAndSimpSessionId = new ArrayList<>();
				replySubjectAndSimpSessionId.add(replySubject);
				replySubjectAndSimpSessionId.add(simpSessionId);
				monitoringParamAndReplySubjects.get(paramRawIds.get(i)).add(replySubjectAndSimpSessionId);
			}else{
				List<List<String>> subjecs = new ArrayList<>();
				List<String> replySubjectAndSimpSessionId = new ArrayList<>();
				replySubjectAndSimpSessionId.add(replySubject);
				replySubjectAndSimpSessionId.add(simpSessionId);
				subjecs.add(replySubjectAndSimpSessionId);
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

		clearParamWithNotExistSimpSessionId(WebSocketEventListener.simpSessionIds);


		Random rand = new Random(System.currentTimeMillis());
		for(Long paramId :monitoringParamAndReplySubjects.keySet()) {
			String fabId =(String) monitoringParamLastUpdateDate.get(paramId).get(1);
			ParamWithCommon paramInfo =(ParamWithCommon) monitoringParamLastUpdateDate.get(paramId).get(2);
			Date fromDate =(Date) monitoringParamLastUpdateDate.get(paramId).get(0);
			Date toDate = new Date();

			//real
			List<List<Object>> datas = getParamData(fabId,paramId,fromDate,toDate);

			List<Object>  info = monitoringParamLastUpdateDate.get(paramId);
			info.set(0,toDate);



//			//demo
//			Long datetime = new Date().getTime();
//			List<List<Object>> datas = new ArrayList<>();
//			for (int i = 0; i < 3; i++) {
//				List<Object> data = new ArrayList<>();
//				data.add(datetime + i * 100);
//				data.add(rand.nextFloat());
//
//				datas.add(data);
//			}



			realtimeSendData(paramId, datas,paramInfo);
		}
	}

	private List<List<Object>> getParamData(String fabId,Long paramId, Date fromDate, Date toDate) {
		return traceDataService.getTraceData(fabId,paramId,fromDate.getTime(),toDate.getTime());
	}

	public void realtimeSendData(Long paramId,List<List<Object>> timeValues,ParamWithCommon paramInfo){

    	List<List<String>> subjectAndSimptSessionIds = monitoringParamAndReplySubjects.get(paramId);

    	if(subjectAndSimptSessionIds!=null && subjectAndSimptSessionIds.size()>0){

			for (int i = 0; i < subjectAndSimptSessionIds.size(); i++) {
				String subject = subjectAndSimptSessionIds.get(i).get(0);
				SocketMessage replyMessage = new SocketMessage();
				replyMessage.setStatus(SocketMessage.Status.Response.toString());
				replyMessage.setType(SocketMessage.Type.Progress.toString());
				HashMap<String,Object> reply = new HashMap<String,Object>();
				reply.put("type", "info");
				reply.put("paramId",paramId);
				reply.put("datas",timeValues);
				reply.put("eqpName",paramInfo.getEqp_Name());
				reply.put("paramName",paramInfo.getName());
				reply.put("alarm_spec",paramInfo.getAlarm());
				reply.put("warning_spec",paramInfo.getWarn());

				replyMessage.setReply(reply);

				messagingTemplate.convertAndSend( subject,replyMessage );
			}

		}


	}
	private void clearParamWithReplySubject(List<Long> paramRawIds,String replySubject) {
		List<Long> keys =new ArrayList<>( monitoringParamAndReplySubjects.keySet()) ;
		for (int j=keys.size()-1;j>=0;j-- ) {
			Long key = keys.get(j);
			List<List<String>> subjecAndSimpSessionId = monitoringParamAndReplySubjects.get(key);
			for (int i = subjecAndSimpSessionId.size()-1; i >=0 ; i--) {
				if(subjecAndSimpSessionId.get(i).get(0).equals(replySubject)){
					subjecAndSimpSessionId.remove(i);
				}
			}
			if(subjecAndSimpSessionId.size()==0){
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
	private void clearParamWithNotExistSimpSessionId(List<String> simpSessionIds)  {


		List<String> removeSimpSessionIds =  getRemoveSimpSessionIds(simpSessionIds);

		for (int k = 0; k < removeSimpSessionIds.size(); k++) {
			String simpSessionId = removeSimpSessionIds.get(k);

			List<Long> keys =new ArrayList<>( monitoringParamAndReplySubjects.keySet()) ;
			for (int j=keys.size()-1;j>=0;j-- ) {
				Long key = keys.get(j);
				List<List<String>> subjecAndSimpSessionId = monitoringParamAndReplySubjects.get(key);
				for (int i = subjecAndSimpSessionId.size()-1; i >=0 ; i--) {
					if(subjecAndSimpSessionId.get(i).get(1).equals(simpSessionId)){
						subjecAndSimpSessionId.remove(i);
					}
				}
				if(subjecAndSimpSessionId.size()==0){
					monitoringParamAndReplySubjects.remove(key);
				}
			}
			if(monitoringParamAndReplySubjects.size()==0){
				monitoringParamLastUpdateDate = new HashMap<>();
			}else {

				List<Long> removeKeys = new ArrayList<>();
				for (Long key : monitoringParamLastUpdateDate.keySet()) {
					if(!monitoringParamAndReplySubjects.containsKey(key)){
						//monitoringParamLastUpdateDate.remove(key);
						removeKeys.add(key);
					}
				}
				for (int i = 0; i < removeKeys.size(); i++) {
					monitoringParamLastUpdateDate.remove(removeKeys.get(i));
				}
			}
		}

	}

	private List<String> getRemoveSimpSessionIds(List<String> simpSessionIds) {
		List<String> removeSimpSessionIds = new ArrayList<>();
		for (Long key :monitoringParamAndReplySubjects.keySet()) {
			for (int j = 0; j < monitoringParamAndReplySubjects.get(key).size(); j++) {
				String simpSessionId = monitoringParamAndReplySubjects.get(key).get(j).get(1);
				if(simpSessionIds.indexOf(simpSessionId)<0){
					removeSimpSessionIds.add(simpSessionId);
				}
			}
		}
		return removeSimpSessionIds;
	}

}
