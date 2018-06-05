package com.bistel.a3.portal.domain.common;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Created by yohan on 15. 10. 29.
 */
public class WidgetType {
    private Long widgetTypeId;
    private String thumbnail;
    private String title;
    private String name;
    private String description;
    private Integer width;
    private Integer height;
    private String category;
    private JsonNode properties;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getWidgetTypeId() {
        return widgetTypeId;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public void setWidgetTypeId(Long widgetTypeId) {
        this.widgetTypeId = widgetTypeId;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public JsonNode getProperties() {
        return properties;
    }

    public void setProperties(JsonNode properties) {
        this.properties = properties;
    }
}
