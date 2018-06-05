package com.bistel.a3.portal.domain.common;

import java.util.Date;

/**
 * Created by yohan on 15. 10. 29.
 */
public class Dashboard {
	private Long dashboardId;
	private Boolean home;
	private Integer dashboardOrder;
	private String title;
	private String userId;
	private Boolean favorite;
	private Date createDtts;
	private Boolean predefined;

	public Boolean getFavorite() {
		return favorite;
	}

	public void setFavorite(Boolean favorite) {
		this.favorite = favorite;
	}

	public Date getCreateDtts() {
		return createDtts;
	}

	public void setCreateDtts(Date createDtts) {
		this.createDtts = createDtts;
	}

	public Long getDashboardId() {
		return dashboardId;
	}

	public void setDashboardId(Long dashboardId) {
		this.dashboardId = dashboardId;
	}

	public Boolean getHome() {
		return home;
	}

	public void setHome(Boolean home) {
		this.home = home;
	}

	public Integer getDashboardOrder() {
		return dashboardOrder;
	}

	public void setDashboardOrder(Integer dashboardOrder) {
		this.dashboardOrder = dashboardOrder;
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

	public Boolean getPredefined() {
		return predefined;
	}

	public void setPredefined(Boolean predefined) {
		this.predefined = predefined;
	}
}
