package com.bistel.a3.portal.domain.pdm.db;

import java.util.Date;

public class FeatureTrx {
    private Long rawid;
    private Long param_mst_rawid;
    private Date begin_dtts;
    private Date end_dtts;
    private Integer count;
    private Float min;
    private float max;
    private float median;
    private float mean;
    private float stddev;
    private float q1;
    private float q3;
    private Float upperAlarmSpec;
    private Float lowerAlarmSpec;
    private Float upperWarningSpec;
    private Float lowerWarningSpec;
    private Float target;
    private String message_group;


    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
    }

    public Long getParam_mst_rawid() {
        return param_mst_rawid;
    }

    public void setParam_mst_rawid(Long param_mst_rawid) {
        this.param_mst_rawid = param_mst_rawid;
    }

    public Date getBegin_dtts() {
        return begin_dtts;
    }

    public void setBegin_dtts(Date begin_dtts) {
        this.begin_dtts = begin_dtts;
    }

    public Date getEnd_dtts() {
        return end_dtts;
    }

    public void setEnd_dtts(Date end_dtts) {
        this.end_dtts = end_dtts;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Float getMin() {
        return min;
    }

    public void setMin(Float min) {
        this.min = min;
    }

    public float getMax() {
        return max;
    }

    public void setMax(float max) {
        this.max = max;
    }

    public float getMedian() {
        return median;
    }

    public void setMedian(float median) {
        this.median = median;
    }

    public float getMean() {
        return mean;
    }

    public void setMean(float mean) {
        this.mean = mean;
    }

    public float getStddev() {
        return stddev;
    }

    public void setStddev(float stddev) {
        this.stddev = stddev;
    }

    public float getQ1() {
        return q1;
    }

    public void setQ1(float q1) {
        this.q1 = q1;
    }

    public float getQ3() {
        return q3;
    }

    public void setQ3(float q3) {
        this.q3 = q3;
    }

    public Float getUpperAlarmSpec() {
        return upperAlarmSpec;
    }

    public void setUpperAlarmSpec(Float upperAlarmSpec) {
        this.upperAlarmSpec = upperAlarmSpec;
    }

    public Float getLowerAlarmSpec() {
        return lowerAlarmSpec;
    }

    public void setLowerAlarmSpec(Float lowerAlarmSpec) {
        this.lowerAlarmSpec = lowerAlarmSpec;
    }

    public Float getUpperWarningSpec() {
        return upperWarningSpec;
    }

    public void setUpperWarningSpec(Float upperWarningSpec) {
        this.upperWarningSpec = upperWarningSpec;
    }

    public Float getLowerWarningSpec() {
        return lowerWarningSpec;
    }

    public void setLowerWarningSpec(Float lowerWarningSpec) {
        this.lowerWarningSpec = lowerWarningSpec;
    }

    public Float getTarget() {
        return target;
    }

    public void setTarget(Float target) {
        this.target = target;
    }

    public String getMessage_group() {
        return message_group;
    }

    public void setMessage_group(String message_group) {
        this.message_group = message_group;
    }
}
