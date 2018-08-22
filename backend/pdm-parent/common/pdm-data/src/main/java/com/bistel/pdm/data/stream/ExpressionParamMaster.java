package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ExpressionParamMaster {

    @JsonProperty("equipmentRawId")
    private Long equipmentRawId;

    @JsonProperty("eqpName")
    private String eqpName;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("paramParseIndex")
    private Integer paramParseIndex;

    @JsonProperty("parameterRawId")
    private Long parameterRawId;

//    public String toKey(){
//        return this.areaName  + "," + this.equipmentName;
//    }

    public String getEqpName() {
        return eqpName;
    }

    public void setEqpName(String eqpName) {
        this.eqpName = eqpName;
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

}
