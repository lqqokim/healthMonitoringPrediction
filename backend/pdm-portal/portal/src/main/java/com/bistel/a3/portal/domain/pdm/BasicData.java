package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class BasicData {
    private Date x;
    private Double y;
    private Double alarm;
    private Double warn;

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
