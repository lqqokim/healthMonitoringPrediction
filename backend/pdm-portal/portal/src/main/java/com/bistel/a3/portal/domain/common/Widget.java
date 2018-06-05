package com.bistel.a3.portal.domain.common;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Created by yohan on 15. 10. 29.
 */
public class Widget {
    private Long widgetId;
    private Long dashboardId;
    private String title;
    private Integer x;
    private Integer y;
	private Integer width;
    private Integer height;
    private JsonNode conditions;
    private JsonNode properties;
    private Long widgetTypeId;
    private Integer page;

    public Long getWidgetId() {
        return widgetId;
    }

    public void setWidgetId(Long widgetId) {
        this.widgetId = widgetId;
    }

    public Long getDashboardId() {
        return dashboardId;
    }

    public void setDashboardId(Long dashboardId) {
        this.dashboardId = dashboardId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public JsonNode getConditions() {
        return conditions;
    }

    public void setConditions(JsonNode conditions) {
        this.conditions = conditions;
    }

    public JsonNode getProperties() {
        return properties;
    }

    public void setProperties(JsonNode properties) {
        this.properties = properties;
    }

    public Long getWidgetTypeId() {
        return widgetTypeId;
    }

    public void setWidgetTypeId(Long widgetTypeId) {
        this.widgetTypeId = widgetTypeId;
    }
    
    public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}
}
