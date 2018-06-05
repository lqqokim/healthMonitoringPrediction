package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.Notification;
import com.bistel.a3.portal.domain.common.UnreadCountMessage;
import com.bistel.a3.portal.service.impl.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
	
	private static Logger logger = LoggerFactory.getLogger(NotificationController.class);
	
	@Autowired
	private NotificationService notificationService;
	
	
	@RequestMapping(method = RequestMethod.GET)
	public List<Notification> selectNotificationByUser(Principal user)
	{
		return notificationService.selectNotificationByUser(user.getName());
	}	
	
	@RequestMapping(method = RequestMethod.PUT)
	public void insertNotification(@RequestBody List<Notification> notifications)
	{
		notificationService.insertNotifications(notifications);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="/{notificationId}")
	public void updateNotification(@PathVariable("notificationId") Long notificationId, @RequestBody Notification notification)
	{
		notificationService.updateNotification(notificationId, notification);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="/{notificationId}/view")
	public void updateNotificationView(@PathVariable("notificationId") Long notificationId)
	{
		notificationService.updateNotificationView(notificationId);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="/read")	
	public void updateNotificationReadByUser(Principal user)
	{
		notificationService.updateNotificationReadByUser(user.getName());
	}

	@RequestMapping(method = RequestMethod.PUT, value="/{notificationId}/read")
	public void updateNotificationReadById(@PathVariable("notificationId")Long notificationId)
	{
		notificationService.updateNotificationReadById(notificationId);
	}

	/**
	 * scheduler에서 호출 
	 * @throws IOException 
	 */
	@RequestMapping(method = RequestMethod.PUT, value="/push")
	public void pushNotification() throws IOException
	{
		notificationService.pushNotification();
		logger.debug("pushNotification(): method = RequestMethod.PUT");
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="/unreadcount")
	public UnreadCountMessage updateNotificationReadById(@RequestBody UnreadCountMessage unreadCountMessage)
	{
		return notificationService.selectUnreadCountMessage(unreadCountMessage);
	}

	
//	PUT /service/notifications/{notificationId}/view
	//PUT /service/notifications/read
//PUT /service/notifications/{notificationId}/read
	 
//
//	@RequestMapping(method = RequestMethod.GET)	
//	public List<Notification> getNotifications(Principal user) {
//		return notificationService.getNotificationsByUserId(user.getName());
//	}
//	
//	
//
////	@RequestMapping(method = RequestMethod.PUT, value = "/{notificationId}/confirm")
////	public void confirmNotification(@PathVariable Long notificationId) {
////		notificationService.confirmNotification(notificationId);
////	}
//
//	@RequestMapping(method = RequestMethod.DELETE, value = "/{notificationId}")
//	public void deleteNotification(@PathVariable Long notificationId) {
//		notificationService.deleteNotification(notificationId);
//	}
}
