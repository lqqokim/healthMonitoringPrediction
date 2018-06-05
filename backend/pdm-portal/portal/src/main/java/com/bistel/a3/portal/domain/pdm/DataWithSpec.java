package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class DataWithSpec {
    @JsonProperty("warning")
    private Double warn;
    private Double alarm;
    private List<List<Object>> data;

    public Double getWarn() {
        return warn;
    }

    public void setWarn(Double warn) {
        this.warn = warn;
    }

    public Double getAlarm() {
        return alarm;
    }

    public void setAlarm(Double alarm) {
        this.alarm = alarm;
    }

    public List<List<Object>> getData() {
        return data;
    }

    public void setData(List<List<Object>> data) {
        this.data = data;
    }
}
