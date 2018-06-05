package com.bistel.a3.portal.domain.common;

/**
 * 
 * 
 * @author AlanMinjaePark
 *
 */
public class UserDashboardLnk {
	
	private String userId;
	private Long dashboardId;
	private String home;
	private String favorite;
	private String dashboardOrder;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Long getDashboardId() {
		return dashboardId;
	}
	public void setDashboardId(Long dashboardId) {
		this.dashboardId = dashboardId;
	}
	public String getHome() {
		return home;
	}
	public void setHome(String home) {
		this.home = home;
	}
	public String getFavorite() {
		return favorite;
	}
	public void setFavorite(String favorite) {
		this.favorite = favorite;
	}
	public String getDashboardOrder() {
		return dashboardOrder;
	}
	public void setDashboardOrder(String dashboardOrder) {
		this.dashboardOrder = dashboardOrder;
	}
	
}
