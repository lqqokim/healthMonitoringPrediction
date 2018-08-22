package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ParameterWithSpecMaster {

    @JsonProperty("areaName")
    private String areaName;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("equipmentRawId")
    private Long equipmentRawId;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("paramParseIndex")
    private Integer paramParseIndex;

    @JsonProperty("parameterRawId")
    private Long parameterRawId;

    @JsonProperty("parameterType")
    private String parameterType;

    @JsonProperty("conditionName")
    private String conditionName;

    @JsonProperty("expression")
    private String expression;

    @JsonProperty("expressionValue")
    private String expressionValue;

    @JsonProperty("useYn")
    private String useYn;

    @JsonProperty("specType")
    private String specType;

    @JsonProperty("dataType")
    private String dataType;

    @JsonProperty("upperWarningSpec")
    private Float upperWarningSpec;

    @JsonProperty("upperAlarmSpec")
    private Float upperAlarmSpec;

    @JsonProperty("target")
    private Float target;

    @JsonProperty("lowerWarningSpec")
    private Float lowerWarningSpec;

    @JsonProperty("lowerAlarmSpec")
    private Float lowerAlarmSpec;

//    public String toKey(){
//        return this.areaName  + "," + this.equipmentName;
//    }

    public String toKey() {
        return this.equipmentName;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public Long getEquipmentRawId() {
        return equipmentRawId;
    }

    public void setEquipmentRawId(Long equipmentRawId) {
        this.equipmentRawId = equipmentRawId;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String eqpName) {
        this.equipmentName = eqpName;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String paramName) {
        this.parameterName = paramName;
    }

    public Integer getParamParseIndex() {
        return paramParseIndex;
    }

    public void setParamParseIndex(Integer paramParseIndex) {
        this.paramParseIndex = paramParseIndex;
    }

    public Long getParameterRawId() {
        return parameterRawId;
    }

    public void setParameterRawId(Long paramRawId) {
        this.parameterRawId = paramRawId;
    }

    public String getParameterType() {
        return parameterType;
    }

    public void setParameterType(String parameterType) {
        this.parameterType = parameterType;
    }

    public String getConditionName() {
        return conditionName;
    }

    public void setConditionName(String conditionName) {
        this.conditionName = conditionName;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getExpressionValue() {
        return expressionValue;
    }

    public void setExpressionValue(String expressionValue) {
        this.expressionValue = expressionValue;
    }

    public String getUseYn() {
        return useYn;
    }

    public void setUseYn(String useYn) {
        this.useYn = useYn;
    }

    public String getSpecType() {
        return specType;
    }

    public void setSpecType(String specType) {
        this.specType = specType;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public Float getUpperWarningSpec() {
        return upperWarningSpec;
    }

    public void setUpperWarningSpec(Float upperWarningSpec) {
        this.upperWarningSpec = upperWarningSpec;
    }

    public Float getUpperAlarmSpec() {
        return upperAlarmSpec;
    }

    public void setUpperAlarmSpec(Float upperAlarmSpec) {
        this.upperAlarmSpec = upperAlarmSpec;
    }

    public Float getTarget() {
        return target;
    }

    public void setTarget(Float target) {
        this.target = target;
    }

    public Float getLowerWarningSpec() {
        return lowerWarningSpec;
    }

    public void setLowerWarningSpec(Float lowerWarningSpec) {
        this.lowerWarningSpec = lowerWarningSpec;
    }

    public Float getLowerAlarmSpec() {
        return lowerAlarmSpec;
    }

    public void setLowerAlarmSpec(Float lowerAlarmSpec) {
        this.lowerAlarmSpec = lowerAlarmSpec;
    }
}
