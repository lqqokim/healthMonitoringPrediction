package com.bistel.a3.portal.domain.usermgt;

import java.util.List;

/**
 * 
 * Operations: groups - GET/POST/PUT/DELETE
 * Related Tables: group_a3, group_role_lnk_a3
 * @author AlanMinjaePark
 *
 */

public class GroupsVo {
	
	String groupId;
	String imageUrl;
	String description;
	String type;
	List<GroupRolesVo> role;
	
	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<GroupRolesVo> getRole() {
		return role;
	}
	public void setRole(List<GroupRolesVo> role) {
		this.role = role;
	}
	
}
