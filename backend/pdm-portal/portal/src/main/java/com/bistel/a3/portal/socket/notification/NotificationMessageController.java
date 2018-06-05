package com.bistel.a3.portal.socket.notification;

import com.bistel.a3.portal.service.impl.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/notificationmessages")
public class NotificationMessageController {
	
	private static Logger logger = LoggerFactory.getLogger(NotificationMessageController.class);
	
	@Autowired
	private NotificationService notificationService;
		
	/**
	 * handler를 호출  
	 * @throws IOException 
	 */
	@RequestMapping(method = RequestMethod.PUT, value="/push")
	public void pushNotification() throws IOException
	{
		notificationService.pushNotification();
		logger.debug("pushNotification(): method = RequestMethod.PUT");
	}

}
