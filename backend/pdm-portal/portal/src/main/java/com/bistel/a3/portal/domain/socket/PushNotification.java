package com.bistel.a3.portal.domain.socket;

import java.util.List;

public class PushNotification {
	
	private String command;
	
	private List<PushNotificationData> push;

	public String getCommand() {
		return command;
	}

	public void setCommand(String command) {
		this.command = command;
	}

	public List<PushNotificationData> getPush() {
		return push;
	}

	public void setPush(List<PushNotificationData> push) {
		this.push = push;
	}	
	
}
