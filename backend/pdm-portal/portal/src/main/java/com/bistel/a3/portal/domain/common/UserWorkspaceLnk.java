package com.bistel.a3.portal.domain.common;

/**
 * 
 * @author AlanMinjaePark
 * Update a workspace for favorite
 * (request body)
 * Workspace로통합될수 있
 */
public class UserWorkspaceLnk {
	
	String userId;
	long workspaceId;
	Boolean favorite;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public long getWorkspaceId() {
		return workspaceId;
	}
	public void setWorkspaceId(long workspaceId) {
		this.workspaceId = workspaceId;
	}
	public Boolean getFavorite() {
		return favorite;
	}
	public void setFavorite(Boolean favorite) {
		this.favorite = favorite;
	}
}
