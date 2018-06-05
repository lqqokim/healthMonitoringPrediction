package com.bistel.a3.portal.domain.common;

import java.util.Date;

/**
 * Created by myyuk on 2016. 6. 13..
 * Modified by Alan on 2016. 12. 12.
 */
public class Notification {
	
	private Long notificationId;
	private String sourceUserId;
	private String targetUserId;	
	private String notificationType;	
	private String message;
	private String linkUrl;
	private Boolean detailViewYN;
	private Date detailViewDtts;
	private Boolean readYN;
	private Date readDtts;
	private Date createDtts;
	private Date updateDtts;
	
	public Notification() {
		
	}
	
	public Long getNotificationId() {
		return notificationId;
	}
	public void setNotificationId(Long notificationId) {
		this.notificationId = notificationId;
	}
	public String getSourceUserId() {
		return sourceUserId;
	}
	public void setSourceUserId(String sourceUserId) {
		this.sourceUserId = sourceUserId;
	}
	public String getTargetUserId() {
		return targetUserId;
	}
	public void setTargetUserId(String targetUserId) {
		this.targetUserId = targetUserId;
	}
	public String getNotificationType() {
		return notificationType;
	}
	public void setNotificationType(String notificationType) {
		this.notificationType = notificationType;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getLinkUrl() {
		return linkUrl;
	}
	public void setLinkUrl(String linkUrl) {
		this.linkUrl = linkUrl;
	}
	public Boolean getDetailViewYN() {
		return detailViewYN;
	}
	public void setDetailViewYN(Boolean detailViewYN) {
		this.detailViewYN = detailViewYN;
	}
	public Date getDetailViewDtts() {
		return detailViewDtts;
	}
	public void setDetailViewDtts(Date detailViewDtts) {
		this.detailViewDtts = detailViewDtts;
	}
	public Boolean getReadYN() {
		return readYN;
	}
	public void setReadYN(Boolean readYN) {
		this.readYN = readYN;
	}
	public Date getReadDtts() {
		return readDtts;
	}
	public void setReadDtts(Date readDtts) {
		this.readDtts = readDtts;
	}
	public Date getCreateDtts() {
		return createDtts;
	}
	public void setCreateDtts(Date createDtts) {
		this.createDtts = createDtts;
	}
	public Date getUpdateDtts() {
		return updateDtts;
	}
	public void setUpdateDtts(Date updateDtts) {
		this.updateDtts = updateDtts;
	}
	
}
