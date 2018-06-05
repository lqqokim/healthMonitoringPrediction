package com.bistel.a3.portal.domain.pdm;

import java.util.List;

public class Overall {
    private Double alarm;
    private Double warn;
    private Long day14;
    private Long day7;
    private Long day3;
    private List<List<Object>> data;

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

    public Long getDay14() {
        return day14;
    }

    public void setDay14(Long day14) {
        this.day14 = day14;
    }

    public Long getDay7() {
        return day7;
    }

    public void setDay7(Long day7) {
        this.day7 = day7;
    }

    public Long getDay3() {
        return day3;
    }

    public void setDay3(Long day3) {
        this.day3 = day3;
    }

    public List<List<Object>> getData() {
        return data;
    }

    public void setData(List<List<Object>> data) {
        this.data = data;
    }
}
