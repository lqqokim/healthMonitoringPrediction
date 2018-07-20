package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class ParamHealthRUL {

    private Long paramHealthRul_rawid;
    private Long paramHealthTrx_rawid;
    private Double intercept;
    private Double slope;
    private Date xValue;
    private Date alarm_dtts;

    public Long getParamHealthRul_rawid() {
        return paramHealthRul_rawid;
    }

    public void setParamHealthRul_rawid(Long paramHealthRul_rawid) {
        this.paramHealthRul_rawid = paramHealthRul_rawid;
    }

    public Long getParamHealthTrx_rawid() {
        return paramHealthTrx_rawid;
    }

    public void setParamHealthTrx_rawid(Long paramHealthTrx_rawid) {
        this.paramHealthTrx_rawid = paramHealthTrx_rawid;
    }

    public Double getIntercept() {
        return intercept;
    }

    public void setIntercept(Double intercept) {
        this.intercept = intercept;
    }

    public Double getSlope() {
        return slope;
    }

    public void setSlope(Double slope) {
        this.slope = slope;
    }

    public Date getxValue() {
        return xValue;
    }

    public void setxValue(Date xValue) {
        this.xValue = xValue;
    }

    public Date getAlarm_dtts() {
        return alarm_dtts;
    }

    public void setAlarm_dtts(Date alarm_dtts) {
        this.alarm_dtts = alarm_dtts;
    }
}
