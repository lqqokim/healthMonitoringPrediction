package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class AlarmTrx {
    @JsonProperty("alarmDtts")
    private Date alarm_dtts;
    @JsonProperty("paramId")
    private Long param_id;
    private Long status_cd;
    private Double value;
    private Double lvl;
    private Double alarm;
    private Double warn;
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Date getAlarm_dtts() {
        return alarm_dtts;
    }

    public void setAlarm_dtts(Date alarm_dtts) {
        this.alarm_dtts = alarm_dtts;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Long getStatus_cd() {
        return status_cd;
    }

    public void setStatus_cd(Long status_cd) {
        this.status_cd = status_cd;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getLvl() {
        return lvl;
    }

    public void setLvl(Double lvl) {
        this.lvl = lvl;
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
}
