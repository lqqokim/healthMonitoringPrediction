package com.bistel.a3.portal.domain.common;

/**
 * Created by alan on 16. 12. 28.
 */
public class UnreadCountMessage {
	
    private String command;
    private String userId;
    private Integer unreadCount;
    
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
	public Integer getUnreadCount() {
		return unreadCount;
	}
	public void setUnreadCount(Integer unreadCount) {
		this.unreadCount = unreadCount;
	}
	
}
