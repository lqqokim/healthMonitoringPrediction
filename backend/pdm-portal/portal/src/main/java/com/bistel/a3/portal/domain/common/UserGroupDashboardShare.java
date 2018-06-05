package com.bistel.a3.portal.domain.common;

/**
 * 
 * 
 * @author AlanMinjaePark
 *
 */
public class UserGroupDashboardShare {
	
	private String groupId;
	private Long dashboardId;
	
	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	public Long getDashboardId() {
		return dashboardId;
	}
	public void setDashboardId(Long dashboardId) {
		this.dashboardId = dashboardId;
	}
	
}
