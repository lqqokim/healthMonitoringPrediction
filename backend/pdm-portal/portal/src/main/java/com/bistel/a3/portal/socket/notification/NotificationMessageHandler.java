package com.bistel.a3.portal.socket.notification;

import com.bistel.a3.portal.dao.common.NotificationMapper;
import com.bistel.a3.portal.domain.socket.NotificationRequest;
import com.bistel.a3.portal.domain.socket.NotificationUnReadCountResponse;
import com.bistel.a3.portal.domain.socket.PushNotification;
import com.bistel.a3.portal.domain.socket.PushNotificationData;
import com.bistel.a3.portal.socket.PotalTextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/service/socket/notificationData/{userId}")
public class NotificationMessageHandler extends PotalTextWebSocketHandler {
	
	@Autowired
	private NotificationMapper notificationMapper;

	private static Logger logger = LoggerFactory.getLogger(NotificationMessageHandler.class);	
	private static Map<Session, String> sessionUserInfo = new ConcurrentHashMap<Session, String>();	
	private static List<String> connectionUserList = new ArrayList<String>();
//	private Map<Session, String> sessionUserInfo = work ConcurrentHashMap<Session, String>();
//	private List<String> connectionUserList = work ArrayList<String>();
	private String command;
	private String currentUserId;
	private Session currentSession;
	
	
	@OnOpen
    public void onOpen(final Session session, @PathParam("userId") String userId) throws IOException{
		logger.debug("onOpen() session: " + session);
		logger.debug("onOpen() userId: " + userId);
		currentUserId = userId;
		currentSession = session;
		sessionUserInfo.put(session, userId);
		if(!connectionUserList.contains(userId))
			connectionUserList.add(userId);
    }
	
	@OnClose
    public void OnClose(final Session session, @PathParam("userId") String userId) throws IOException{
		logger.debug("OnClose() session: " + session);
		logger.debug("OnClose() userId: " + userId);
    	connectionUserList.remove(userId);
    	sessionUserInfo.remove(currentSession);
		logger.debug("OnClose() session " + session);
		logger.debug("sessionUserInfo size() " + sessionUserInfo.size());
    }

	@OnError
    public void handleError(Throwable t){
		connectionUserList.remove(currentUserId);
    	sessionUserInfo.remove(currentSession);
        logger.info(t.toString());
    }

	
	@OnMessage
    public void handleMessage(String message, Session session) throws IOException{
		NotificationRequest notificationRequest;
		
		// 1. convert json
		try {
			notificationRequest = convertJSON(message);
			command = notificationRequest.getCommand();			
			logger.debug("handleMessage() command: "+ command);
			
			// 2. command 별 분리 처리
			switch (command) {
			case "unread_count" :
	    		logger.debug("call handlTextMessage() unread_count webSocketSessionId ", session);
				userRegistProcess(session, notificationRequest);
				
				break;
			case "notification_exist" :
	    		logger.debug("call handlTextMessage() notification_exist webSocketSession: ", session);
				messagePushProcess();
			default :
				break;
			}
		} catch (Exception ex) {
			logger.error("Notification Exception", ex);
		}
		
    }
	
	/**
	 * Connection 후 호출되는 function --> 호출을 안\
	 *Tomcat 구동시 안되서, 따로 구현 
	 */
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {		
	}
	
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    }
	
	//::세션 유지가 안되는 경우, 다시 확인해야함 
    public void sendNotificationMessageToServer() throws IOException {
    	
    	if(sessionUserInfo != null){
    		String message = 
        			"{"+
        			" \"command\" : \"notification_exist\""+
        			"}"
        			;
    		
    		Set<Session> sessionSet = (Set<Session>) sessionUserInfo.keySet();
    		Iterator<Session> iSessionSet = sessionSet.iterator();
    		while(iSessionSet.hasNext())
    		{
    			handleMessage(message, iSessionSet.next()); //:::    			
    		}
    	}
    }

	/**
	 * Message를 수신한 후  호출되는 function
	 */
	@Override
	protected void handlTextMessage(WebSocketSession session, String payload) throws IOException {
		
	}
	
	private void messagePushProcess() throws Exception {
		//getPushData();
		List<PushNotificationData> pushNotificationList = null;
		String sendMessage = null;
		
		for(int i=0; i<connectionUserList.size();i++)
		{
			String userId = connectionUserList.get(i);
			//TO userId 단위로 message get
			pushNotificationList = getPushNotificationData(userId);
			if (pushNotificationList != null && pushNotificationList.size() > 0) {
				sendMessage = makePushNotificationsMessage(pushNotificationList);				
				for (Session session : sessionUserInfo.keySet() ) {
					if (sessionUserInfo.get(session).equals(userId)) {
						sendMessage(session, sendMessage, userId);
						logger.info("messagePushProcess() sendMessage() userId: "+ userId);
						
					}
				}
			}
		}	
	}
	
	private String makePushNotificationsMessage(List<PushNotificationData> pushNotificationList) throws Exception {
		PushNotification pushNotification = new PushNotification();
		
		pushNotification.setCommand("notifications");
		pushNotification.setPush(pushNotificationList);
		
		ObjectMapper mapper = new ObjectMapper();
		String sendMessage = mapper.writeValueAsString(pushNotification);
		
		return sendMessage;
	}
	
	private List<PushNotificationData> getPushNotificationData(String userId) {

		//TODO DB에서 Data 가져오는 부분 구현 필요 //target user 값으로 검색해 온다.
		List<PushNotificationData> pushNotificationDataList = notificationMapper.selectPushNotificationData(userId);		
		return pushNotificationDataList;
	}
	
	private void userRegistProcess(Session session, NotificationRequest notificationRequest) throws Exception{
		
		String userId = notificationRequest.getUserId(); 		
		addSession(session, userId);

		// data 검색
		NotificationUnReadCountResponse sendJSON = getUnreadNotification(userId);
		
		ObjectMapper mapper = new ObjectMapper();
		String sendMessage = mapper.writeValueAsString(sendJSON);
		
		// Send Unread Count
		sendMessage(session, sendMessage, userId);
		
	}
	
	private NotificationRequest convertJSON(String payload) throws Exception {
		
		ObjectMapper mapper = new ObjectMapper();
		
		NotificationRequest notificationRequest = mapper.readValue(payload, NotificationRequest.class);
		
		return notificationRequest;
	}
	
	/**
	 * Count 검색하는 로직 추가
	 * @param userId
	 * @return
	 */
	private NotificationUnReadCountResponse getUnreadNotification(String userId) {
		
		NotificationUnReadCountResponse notificationUnReadCountResponse = new NotificationUnReadCountResponse();
 
		notificationUnReadCountResponse.setUserId(userId);
		notificationUnReadCountResponse.setCommand("unread_count");
		int unreadCount = notificationMapper.selectNotificationUnReadCount(userId);
		notificationUnReadCountResponse.setUnreadCount(unreadCount);
		
		return notificationUnReadCountResponse;		
	}
	
	
	private void sendMessage(Session session, String message, String userId ) {
		try {			
			session.getBasicRemote().sendText(message);
			notificationMapper.updateReadStatus(userId, "Y"); //확인할 것 
			logger.debug("sendMessage(): updateReadStatus to Y");
		} catch (IOException e) {
			logger.error("Notification Messsage send Error(Socket)", e);
			deleteSession(session, userId);
		}
	}
	
	private void addSession(Session session, String userId ) {
		// Session add
		if (!sessionUserInfo.containsKey(session)) {
			sessionUserInfo.put(session, userId);
		} 
		
		if (!connectionUserList.contains(userId)) {
			connectionUserList.add(userId);
		}
	}
	
	private void deleteSession(Session session, String userId ) {
		// Session delete
		if (!sessionUserInfo.containsKey(session)) {
			sessionUserInfo.remove(session, userId);
		} 
		
		if (!connectionUserList.contains(userId)) {
			connectionUserList.remove(userId);
		}
	}
}
