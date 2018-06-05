package com.bistel.a3.portal.domain.common;

import java.util.Date;
import java.util.List;

/**
 * Data Structure for MyWorkspaces
 * @author AlanMinjaePark
 *
 */
public class MyWorkspace {
	
    private Long workspaceId;
    private String title;
    private String userId;
    private String userName;
    private Integer workspaceCount;
    private Boolean favorite;
    private String description;
    private String shareType;
    private List<WorkspaceShareMemberInfo> shareInfo;
    private Date createDtts;
    private Date updateDtts;
    
	public Long getWorkspaceId() {
		return workspaceId;
	}
	public void setWorkspaceId(Long workspaceId) {
		this.workspaceId = workspaceId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public Integer getWorkspaceCount() {
		return workspaceCount;
	}
	public void setWorkspaceCount(Integer workspaceCount) {
		this.workspaceCount = workspaceCount;
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
	public String getShareType() {
		return shareType;
	}
	public void setShareType(String shareType) {
		this.shareType = shareType;
	}
	public List<WorkspaceShareMemberInfo> getShareInfo() {
		return shareInfo;
	}
	public void setShareInfo(List<WorkspaceShareMemberInfo> shareInfo) {
		this.shareInfo = shareInfo;
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
