package com.bistel.a3.portal.domain.usermgt;

import java.util.List;

public class RolesVo {
	
	String roleId;
	String description;
	List<RolesVo> childRole;
	
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<RolesVo> getChildRole() {
		return childRole;
	}
	public void setChildRole(List<RolesVo> childRole) {
		this.childRole = childRole;
	}
	
}
