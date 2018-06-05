package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.Notification;
import com.bistel.a3.portal.domain.common.UnreadCountMessage;
import com.bistel.a3.portal.module.common.NotificationComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class NotificationService {

	@Autowired
	private NotificationComponent notificationComponent;
	
	public List<Notification> selectNotificationByUser(String userId)
	{
		return notificationComponent.selectNotificationByUser(userId);
	}
	
	public void insertNotifications(List<Notification> notifications)
	{
		notificationComponent.insertNotifications(notifications);
	}
	
	public void updateNotification(Long notificationId, Notification notification)
	{
		notificationComponent.updateNotification(notificationId, notification);
	}
	
	public void updateNotificationView(Long notificationId)
	{
		notificationComponent.updateNotificationView(notificationId);
	}
	
	public void updateNotificationReadById(Long notificationId)
	{
		notificationComponent.updateNotificationReadById(notificationId);
	}
	
	public void updateNotificationReadByUser(String userId)
	{
		notificationComponent.updateNotificationReadByUser(userId);
	}
	
	public void pushNotification() throws IOException
	{
		notificationComponent.pushNotification();
	}
	
	public UnreadCountMessage selectUnreadCountMessage(UnreadCountMessage unreadCountMessage)
	{
		return notificationComponent.selectUnreadCountMessage(unreadCountMessage);
	}	
}
