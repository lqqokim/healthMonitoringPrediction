package com.bistel.pdm.scheduler.domain;

import java.util.Date;

public class ParamRULSummary {

    private Long param_health_trx_rawid;
    private Long param_mst_rawid;
    private Long param_health_mst_rawid;
    private String status_cd;
    private Long data_count;
    private Double score;
    private Date create_dtts;
    private Date end_dtts;
    private Double mean;
    private Double alarm_spec;
    private Double slope;
    private Double intercept;

    public Date getEnd_dtts() {
        return end_dtts;
    }

    public void setEnd_dtts(Date end_dtts) {
        this.end_dtts = end_dtts;
    }

    public Double getMean() {
        return mean;
    }

    public void setMean(Double mean) {
        this.mean = mean;
    }

    public Double getAlarm_spec() {
        return alarm_spec;
    }

    public void setAlarm_spec(Double alarm_spec) {
        this.alarm_spec = alarm_spec;
    }

    public Double getXvalue() {
        return xvalue;
    }

    public void setXvalue(Double xvalue) {
        this.xvalue = xvalue;
    }

    private Double xvalue;

    public Long getParam_health_trx_rawid() {
        return param_health_trx_rawid;
    }

    public void setParam_health_trx_rawid(Long param_health_trx_rawid) {
        this.param_health_trx_rawid = param_health_trx_rawid;
    }

    public Long getParam_mst_rawid() {
        return param_mst_rawid;
    }

    public void setParam_mst_rawid(Long param_mst_rawid) {
        this.param_mst_rawid = param_mst_rawid;
    }

    public Long getParam_health_mst_rawid() {
        return param_health_mst_rawid;
    }

    public void setParam_health_mst_rawid(Long param_health_mst_rawid) {
        this.param_health_mst_rawid = param_health_mst_rawid;
    }

    public String getStatus_cd() {
        return status_cd;
    }

    public void setStatus_cd(String status_cd) {
        this.status_cd = status_cd;
    }

    public Long getData_count() {
        return data_count;
    }

    public void setData_count(Long data_count) {
        this.data_count = data_count;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Date getCreate_dtts() {
        return create_dtts;
    }

    public void setCreate_dtts(Date create_dtts) {
        this.create_dtts = create_dtts;
    }

    public Double getSlope() {
        return slope;
    }

    public void setSlope(Double slope) {
        this.slope = slope;
    }

    public Double getIntercept() {
        return intercept;
    }

    public void setIntercept(Double intercept) {
        this.intercept = intercept;
    }
}
