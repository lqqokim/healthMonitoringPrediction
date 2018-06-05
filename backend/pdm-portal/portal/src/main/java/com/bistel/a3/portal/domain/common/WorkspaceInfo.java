package com.bistel.a3.portal.domain.common;

public class WorkspaceInfo {
	
	private long id;
	private String title;
	private String nodeType;
	private int score;
	private String permission;
	private String parentId;
	private String workspaceId;
	private String workspaceCreateDtts;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getNodeType() {
		return nodeType;
	}
	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
	}
	public String getPermission() {
		return permission;
	}
	public void setPermission(String permission) {
		this.permission = permission;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public String getWorkspaceId() {
		return workspaceId;
	}
	public void setWorkspaceId(String workspaceId) {
		this.workspaceId = workspaceId;
	}
	public String getWorkspaceCreateDtts() {
		return workspaceCreateDtts;
	}
	public void setWorkspaceCreateDtts(String workspaceCreateDtts) {
		this.workspaceCreateDtts = workspaceCreateDtts;
	}
}
