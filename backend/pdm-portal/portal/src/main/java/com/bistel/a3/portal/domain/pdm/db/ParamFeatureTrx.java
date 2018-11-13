package com.bistel.a3.portal.domain.pdm.db;

import java.util.Date;

public class ParamFeatureTrx {
    private Long rawId;
    private Long paramId;
    private Date beginDtts;
    private Date endDtts;
    private Integer count;
    private Float min;
    private Float max;
    private Float median;
    private Float mean;
    private Float stddev;
    private Float q1;
    private Float q3;
    private Float upperAlarmSpec;
    private Float lowerAlarmSpec;
    private Float upperWarningSpec;
    private Float lowerWarningSpec;
    private Float target;
    private String message_group;

    public Long getRawId() {
        return rawId;
    }

    public void setRawId(Long rawId) {
        this.rawId = rawId;
    }

    public Long getParamId() {
        return paramId;
    }

    public void setParamId(Long paramId) {
        this.paramId = paramId;
    }

    public Date getBeginDtts() {
        return beginDtts;
    }

    public void setBeginDtts(Date beginDtts) {
        this.beginDtts = beginDtts;
    }

    public Date getEndDtts() {
        return endDtts;
    }

    public void setEndDtts(Date endDtts) {
        this.endDtts = endDtts;
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

    public Float getMax() {
        return max;
    }

    public void setMax(Float max) {
        this.max = max;
    }

    public Float getMedian() {
        return median;
    }

    public void setMedian(Float median) {
        this.median = median;
    }

    public Float getMean() {
        return mean;
    }

    public void setMean(Float mean) {
        this.mean = mean;
    }

    public Float getStddev() {
        return stddev;
    }

    public void setStddev(Float stddev) {
        this.stddev = stddev;
    }

    public Float getQ1() {
        return q1;
    }

    public void setQ1(Float q1) {
        this.q1 = q1;
    }

    public Float getQ3() {
        return q3;
    }

    public void setQ3(Float q3) {
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
