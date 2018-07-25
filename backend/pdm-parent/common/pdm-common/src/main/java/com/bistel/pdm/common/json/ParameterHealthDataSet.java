package com.bistel.pdm.common.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ParameterHealthDataSet {

    @JsonProperty("paramRawId")
    private Long paramRawId;

    @JsonProperty("paramHealthRawId")
    private Long paramHealthRawId;

    @JsonProperty("healthLogicRawId")
    private Long healthLogicRawId;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("healthCode")
    private String healthCode;

    @JsonProperty("alarmCondition")
    private String alarmCondition;

    @JsonProperty("warningCondition")
    private String warningCondition;

    @JsonProperty("optionName")
    private String optionName;

    @JsonProperty("optionValue")
    private Integer optionValue;

    @JsonProperty("applyLogicYN")
    private String applyLogicYN;

    public Long toKey() {
        return this.paramRawId;
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

    public Long getHealthLogicRawId() {
        return healthLogicRawId;
    }

    public void setHealthLogicRawId(Long healthLogicRawId) {
        this.healthLogicRawId = healthLogicRawId;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getHealthCode() {
        return healthCode;
    }

    public void setHealthCode(String healthCode) {
        this.healthCode = healthCode;
    }

    public String getAlarmCondition() {
        return alarmCondition;
    }

    public void setAlarmCondition(String alarmCondition) {
        this.alarmCondition = alarmCondition;
    }

    public String getWarningCondition() {
        return warningCondition;
    }

    public void setWarningCondition(String warningCondition) {
        this.warningCondition = warningCondition;
    }

    public String getOptionName() {
        return optionName;
    }

    public void setOptionName(String optionName) {
        this.optionName = optionName;
    }

    public Integer getOptionValue() {
        return optionValue;
    }

    public void setOptionValue(Integer optionValue) {
        this.optionValue = optionValue;
    }

    public String getApplyLogicYN() {
        return applyLogicYN;
    }

    public void setApplyLogicYN(String applyLogicYN) {
        this.applyLogicYN = applyLogicYN;
    }
}
