package com.bistel.pdm.common.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ParameterSpecDataSet {

    @JsonProperty("areaName")
    private String areaName;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("alarmSpec")
    private Float alarmSpec;

    @JsonProperty("warningSpec")
    private Float warningSpec;

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

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
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
}
