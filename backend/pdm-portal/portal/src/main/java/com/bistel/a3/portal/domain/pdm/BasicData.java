package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class BasicData {
    private Date x;
    private Double y;
    private Double alarm;
    private Double warn;
    private Double upper_alarm;
    private Double upper_warn;
    private Double lower_alarm;
    private Double lower_warn;

    public Double getUpper_alarm() {
        return upper_alarm;
    }

    public void setUpper_alarm(Double upper_alarm) {
        this.upper_alarm = upper_alarm;
    }

    public Double getUpper_warn() {
        return upper_warn;
    }

    public void setUpper_warn(Double upper_warn) {
        this.upper_warn = upper_warn;
    }

    public Double getLower_alarm() {
        return lower_alarm;
    }

    public void setLower_alarm(Double lower_alarm) {
        this.lower_alarm = lower_alarm;
    }

    public Double getLower_warn() {
        return lower_warn;
    }

    public void setLower_warn(Double lower_warn) {
        this.lower_warn = lower_warn;
    }

    public Date getX() {
        return x;
    }

    public void setX(Date x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
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
