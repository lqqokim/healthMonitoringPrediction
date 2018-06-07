package com.bistel.pdm.common.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ParameterSpecDataSet {

    @JsonProperty("paramRawId")
    private Long paramRawId;

    @JsonProperty("featureName")
    private String featureName;

    @JsonProperty("warningSpec")
    private Float warningSpec;

    @JsonProperty("alarmSpec")
    private Float alarmSpec;

    public Long toKey() {
        return this.paramRawId;
    }

    public Long getParamRawId() {
        return paramRawId;
    }

    public void setParamRawId(Long paramRawId) {
        this.paramRawId = paramRawId;
    }

    public Float getAlarmSpec() {
        return alarmSpec;
    }

    public void setAlarmSpec(Float alarmSpec) {
        this.alarmSpec = alarmSpec;
    }

    public Float getWarningSpec() {
        return warningSpec;
    }

    public void setWarningSpec(Float warningSpec) {
        this.warningSpec = warningSpec;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }
}
