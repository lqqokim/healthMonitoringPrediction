package com.bistel.a3.portal.enums;

/**
 * Created by yslee on 2017-02-09.
 */
public enum NOTIFICATION_TYPE {
	
	WS("WS"), DS("DS");
	
	private String value;
	
	public static String getValue(NOTIFICATION_TYPE notificationType) {
		return notificationType.value;
	}
	
	private NOTIFICATION_TYPE(String value) {
		this.value = value;
	}
}
