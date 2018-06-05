package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.db.OverallMinuteSummaryTrx;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ParamClassificationData extends OverallMinuteSummaryTrx {
    @JsonProperty("paramName")
    private String name;
    @JsonIgnore
    private String type;
    private List<String> classifications;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getClassifications() {
        return classifications;
    }

    public void setClassifications(List<String> classifications) {
        this.classifications = classifications;
    }
}
