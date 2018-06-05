package com.bistel.pdm.serving.json;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Area {
    @JsonProperty("areaId")
    private Long area_id;
    @JsonProperty("areaName")
    private String name;
    private String description;
    @JsonProperty("parentId")
    private Long parent_id;
    @JsonProperty("sortOrder")
    private Long sort_order;

    public Long getSort_order() {
        return sort_order;
    }

    public void setSort_order(Long sort_order) {
        this.sort_order = sort_order;
    }

    public Long getArea_id() {
        return area_id;
    }

    public void setArea_id(Long area_id) {
        this.area_id = area_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getParent_id() {
        return parent_id;
    }

    public void setParent_id(Long parent_id) {
        this.parent_id = parent_id;
    }
}
