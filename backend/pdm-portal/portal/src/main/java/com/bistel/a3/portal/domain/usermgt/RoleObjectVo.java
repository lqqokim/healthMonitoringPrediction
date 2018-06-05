package com.bistel.a3.portal.domain.usermgt;

import java.util.List;

public class RoleObjectVo {
	
	String roleId;
	String description;
	List<String> childRole;
	List<ObjectVo> object;
	
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
	public List<String> getChildRole() {
		return childRole;
	}
	public void setChildRole(List<String> childRole) {
		this.childRole = childRole;
	}
	public List<ObjectVo> getObject() {
		return object;
	}
	public void setObject(List<ObjectVo> object) {
		this.object = object;
	}	
}
