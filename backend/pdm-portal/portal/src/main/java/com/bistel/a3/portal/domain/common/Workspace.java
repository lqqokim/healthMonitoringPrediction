package com.bistel.a3.portal.domain.common;

import java.util.Date;

/**
 * Created by yohan on 15. 11. 3.
 * modified by alan
 */
public class Workspace {
	
    private Long workspaceId;
    private String userId;
    private String title;
    private Boolean favorite;
    private String description;
    private Date createDtts;
    private Date updateDtts;
    
	public Long getWorkspaceId() {
		return workspaceId;
	}
	public void setWorkspaceId(Long workspaceId) {
		this.workspaceId = workspaceId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Boolean getFavorite() {
		return favorite;
	}
	public void setFavorite(Boolean favorite) {
		this.favorite = favorite;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
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
