package com.bistel.pdm.datastore.model;

public class ParamHealthData {
    private Long rawId;
    private Long time;
    private Long eqpRawId;
    private Long paramRawId;
    private Long paramHealthRawId;
    private String status;
    private Integer dataCount;
    private Double index;
    private Long healthLogicRawId;

    private Float upperAlarmSpec;
    private Float upperWarningSpec;
    private Float target;
    private Float lowerAlarmSpec;
    private Float lowerWarningSpec;

    public Long getRawId() {
        return rawId;
    }

    public void setRawId(Long rawId) {
        this.rawId = rawId;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public Long getEqpRawId() {
        return eqpRawId;
    }

    public void setEqpRawId(Long eqpRawId) {
        this.eqpRawId = eqpRawId;
    }

    public Long getParamRawId() {
        return paramRawId;
    }

    public void setParamRawId(Long paramRawId) {
        this.paramRawId = paramRawId;
    }

    public Long getParamHealthRawId() {
        return paramHealthRawId;
    }

    public void setParamHealthRawId(Long paramHealthRawId) {
        this.paramHealthRawId = paramHealthRawId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getDataCount() {
        return dataCount;
    }

    public void setDataCount(Integer dataCount) {
        this.dataCount = dataCount;
    }

    public Double getIndex() {
        if(index.isNaN())
            return 0D;

        return index;
    }

    public void setIndex(Double index) {
        this.index = index;
    }

    public Long getHealthLogicRawId() {
        return healthLogicRawId;
    }

    public void setHealthLogicRawId(Long healthLogicRawId) {
        this.healthLogicRawId = healthLogicRawId;
    }

    public Float getUpperAlarmSpec() {
        return upperAlarmSpec;
    }

    public void setUpperAlarmSpec(Float upperAlarmSpec) {
        this.upperAlarmSpec = upperAlarmSpec;
    }

    public Float getUpperWarningSpec() {
        return upperWarningSpec;
    }

    public void setUpperWarningSpec(Float upperWarningSpec) {
        this.upperWarningSpec = upperWarningSpec;
    }

    public Float getTarget() {
        return target;
    }

    public void setTarget(Float target) {
        this.target = target;
    }

    public Float getLowerAlarmSpec() {
        return lowerAlarmSpec;
    }

    public void setLowerAlarmSpec(Float lowerAlarmSpec) {
        this.lowerAlarmSpec = lowerAlarmSpec;
    }

    public Float getLowerWarningSpec() {
        return lowerWarningSpec;
    }

    public void setLowerWarningSpec(Float lowerWarningSpec) {
        this.lowerWarningSpec = lowerWarningSpec;
    }
}
