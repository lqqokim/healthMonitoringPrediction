package com.bistel.pdm.common.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class MasterDataSet {

    @JsonProperty("areaName")
    private String areaName;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("parameterRawId")
    private Long parameterRawId;

    public String toKey(){
        return this.areaName  + "," + this.equipmentName  + "," + this.parameterName;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
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

    public Long getParameterRawId() {
        return parameterRawId;
    }

    public void setParameterRawId(Long paramRawId) {
        this.parameterRawId = paramRawId;
    }
}
