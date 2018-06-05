package com.bistel.a3.portal.domain.socket;

public class NotificationRequest {

	private String command;
	
	private String userId;

	public String getCommand() {
		return command;
	}

	public void setCommand(String command) {
		this.command = command;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
	
}
