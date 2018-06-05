package com.bistel.a3.portal.domain.common;

import java.util.List;

/**
 * Data Structure for WorkspaceShareMember
 * @author AlanMinjaePark
 *
 */
public class WorkspaceShareMember {
	
    private String id;
    private String name;
    private String imageUrl;    
    private String type;
    private String email;
    private List<WorkspaceShareMemberGroupUser> groupUsers;
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public List<WorkspaceShareMemberGroupUser> getGroupUsers() {
		return groupUsers;
	}
	public void setGroupUsers(List<WorkspaceShareMemberGroupUser> groupUsers) {
		this.groupUsers = groupUsers;
	}    
}
