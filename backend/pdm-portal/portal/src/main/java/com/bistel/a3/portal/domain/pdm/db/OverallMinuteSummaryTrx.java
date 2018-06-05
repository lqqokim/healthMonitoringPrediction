package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class OverallMinuteSummaryTrx {
    @JsonProperty("paramId")
    private Long param_id;
    @JsonProperty("readDtts")
    private Date read_dtts;
    private Double alarm;
    private Double warn;
    @JsonProperty("avgSpec")
    private Double avg_spec;
    @JsonProperty("avgDaily")
    private Double avg_daily;
    @JsonProperty("avgWithAW")
    private Double avg_with_aw;
    private Double variation;
    private String userName;
    private String cause;

    public String getCause() {
        return cause;
    }

    public void setCause(String cause) {
        this.cause = cause;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Date getRead_dtts() {
        return read_dtts;
    }

    public void setRead_dtts(Date read_dtts) {
        this.read_dtts = read_dtts;
    }

    public Double getAlarm() {
        return alarm;
    }

    public void setAlarm(Double alarm) {
        this.alarm = alarm;
    }

    public Double getWarn() {
        return warn;
    }

    public void setWarn(Double warn) {
        this.warn = warn;
    }

    public Double getAvg_spec() {
        return avg_spec;
    }

    public void setAvg_spec(Double avg_spec) {
        this.avg_spec = avg_spec;
    }

    public Double getAvg_daily() {
        return avg_daily;
    }

    public void setAvg_daily(Double avg_daily) {
        this.avg_daily = avg_daily;
    }

    public Double getAvg_with_aw() {
        return avg_with_aw;
    }

    public void setAvg_with_aw(Double avg_with_aw) {
        this.avg_with_aw = avg_with_aw;
    }

    public Double getVariation() {
        return variation;
    }

    public void setVariation(Double variation) {
        this.variation = variation;
    }
}
