package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.Notification;
import com.bistel.a3.portal.domain.socket.PushNotificationData;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by myyuk on 2016. 6. 13..
 */
public interface NotificationMapper {
	List<Notification> selectNotificationByUser(@Param("userId") String userId);
	void insertNotification(Notification notification);
	void updateNotification(@Param("notificationId") Long notificationId, Notification notification);

	void updateNotificationView(@Param("notificationId") Long notificationId);
	
	void updateNotificationReadById(@Param("notificationId") Long notificationId);
	void updateNotificationReadByUser(@Param("userId") String userId);
	
	Integer selectPushDataCount();
	List<PushNotificationData> selectPushNotificationData(@Param("userId") String userId);
	Integer selectNotificationUnReadCount(@Param("userId") String userId);
	void updateReadStatus(@Param("userId") String userId, @Param("readStatus") String readStatus);
	
//	List<Notification> selectByUser(@Param("userId") String userId);
//	Notification selectById(@Param("notificationId") Long notificationId);
//	Integer update(Notification notification);
//	Integer delete(@Param("notificationId") Long notificationId);
}
