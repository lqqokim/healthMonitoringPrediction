package com.bistel.a3.portal.domain.pdm.std.master;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class STDArea {
    private Long rawid;
    private String name;
    private String description;
    private Long parent_rawid;
    private String user_name;
    private List<STDArea> childAreas;

    public List<STDArea> getChildAreas() {
        return childAreas;
    }

    public void setChildAreas(List<STDArea> childAreas) {
        this.childAreas = childAreas;
    }

    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
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

    public Long getParent_rawid() {
        return parent_rawid;
    }

    public void setParent_rawid(Long parent_rawid) {
        this.parent_rawid = parent_rawid;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
}
