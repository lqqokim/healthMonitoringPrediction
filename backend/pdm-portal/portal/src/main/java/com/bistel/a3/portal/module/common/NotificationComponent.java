package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.NotificationMapper;
import com.bistel.a3.portal.domain.common.Notification;
import com.bistel.a3.portal.domain.common.UnreadCountMessage;
import com.bistel.a3.portal.socket.notification.NotificationMessageHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

/**
 * 2016.11.xx 기존 common service의 비구조화를 개선하기 위해, 구조적으로 변경하기 위해 생성 
 * (기존 mapper -> controller)
 * (수정 mapper -> component -> service -> controller)
 * @author AlanMinjaePark
 */
@Component
public class NotificationComponent {

	@Autowired
	private NotificationMapper notificationMapper;
	
	@Autowired
	NotificationMessageHandler notificationMessageHandler;


	public List<Notification> selectNotificationByUser(String userId)
	{
		return notificationMapper.selectNotificationByUser(userId);
	}
	
	public void insertNotifications(List<Notification> notifications)
	{
		for(int i=0;i<notifications.size();i++)
		{
			insertNotification(notifications.get(i));			
		}
	}
	
	public void insertNotification(Notification notification) {
		notificationMapper.insertNotification(notification);
	}
	
	public void updateNotification(Long notificationId, Notification notification)
	{
		notificationMapper.updateNotification(notificationId, notification);
	}
		
	public void updateNotificationView(Long notificationId)
	{
		notificationMapper.updateNotificationView(notificationId);
	}
	
	public void updateNotificationReadById(Long notificationId)
	{
		notificationMapper.updateNotificationReadById(notificationId);
	}
	
	public void updateNotificationReadByUser(String userId)
	{
		notificationMapper.updateNotificationReadByUser(userId);
	}
	
	public void pushNotification() throws IOException
	{
		Integer pushDataCount = notificationMapper.selectPushDataCount();
		if(pushDataCount > 0)
		{			
			notificationMessageHandler.sendNotificationMessageToServer();
//			//websoket server로 메시지를 전달 한다.
//			try {
//                URI uri = work URI("ws://localhost:8080/portal/service/socket/notificationData");
//                WebSocketContainer container = ContainerProvider.getWebSocketContainer();
//                container.connectToServer(this, uri);
//                sendNotificationMessageToServer();
//          } catch (Exception e) {
//                e.printStackTrace();
//          }			
		}
	}
	
	public UnreadCountMessage selectUnreadCountMessage(UnreadCountMessage unreadCountMessage)
	{		
		Integer unreadCount = notificationMapper.selectNotificationUnReadCount(unreadCountMessage.getUserId());
		unreadCountMessage.setUnreadCount(unreadCount);
		return unreadCountMessage;
	}
	
    
	
	
}
