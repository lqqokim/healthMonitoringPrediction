package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ParameterMaster {

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("equipmentRawId")
    private Long equipmentRawId;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("modelName")
    private String modelName;

    @JsonProperty("paramParseIndex")
    private Integer paramParseIndex;

    @JsonProperty("parameterRawId")
    private Long parameterRawId;

    @JsonProperty("parameterType")
    private String parameterType;

    @JsonProperty("dataType")
    private String dataType;

    public String toKey() {
        return this.equipmentName;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public Long getEquipmentRawId() {
        return equipmentRawId;
    }

    public void setEquipmentRawId(Long equipmentRawId) {
        this.equipmentRawId = equipmentRawId;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
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

    public void setParameterRawId(Long parameterRawId) {
        this.parameterRawId = parameterRawId;
    }

    public String getParameterType() {
        return parameterType;
    }

    public void setParameterType(String parameterType) {
        this.parameterType = parameterType;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }
}
