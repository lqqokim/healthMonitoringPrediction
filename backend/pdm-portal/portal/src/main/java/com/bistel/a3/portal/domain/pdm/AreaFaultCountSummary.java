package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class AreaFaultCountSummary {

    private String area_name;
    private Long area_id;
    private int alarm_count;
    private int warning_count;
    private int normal_count;
    private int failure_count;
    private int offline_count;
    private int total_count;
    private String day;

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public Long getArea_id() {
        return area_id;
    }

    public void setArea_id(Long area_id) {
        this.area_id = area_id;
    }
    public int getTotal_count() {
        return total_count;
    }

    public void setTotal_count(int total_count) {
        this.total_count = total_count;
    }

    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    public int getAlarm_count() {
        return alarm_count;
    }

    public void setAlarm_count(int alarm_count) {
        this.alarm_count = alarm_count;
    }

    public int getWarning_count() {
        return warning_count;
    }

    public void setWarning_count(int warning_count) {
        this.warning_count = warning_count;
    }

    public int getNormal_count() {
        return normal_count;
    }

    public void setNormal_count(int normal_count) {
        this.normal_count = normal_count;
    }

    public int getFailure_count() {
        return failure_count;
    }

    public void setFailure_count(int failure_count) {
        this.failure_count = failure_count;
    }

    public int getOffline_count() {
        return offline_count;
    }

    public void setOffline_count(int offline_count) {
        this.offline_count = offline_count;
    }
}
