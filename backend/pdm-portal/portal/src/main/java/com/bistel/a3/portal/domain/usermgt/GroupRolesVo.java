package com.bistel.a3.portal.domain.usermgt;

/**
 * 
 * Operations: with groups - GET/POST/PUT/DELETE
 * @author AlanMinjaePark
 *
 */

public class GroupRolesVo {

	String condition;
	String roleId;

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}	
}
