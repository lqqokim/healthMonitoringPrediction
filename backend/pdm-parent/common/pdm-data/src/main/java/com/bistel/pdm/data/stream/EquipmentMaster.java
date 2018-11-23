package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class EquipmentMaster {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("areaName")
    private String areaName;

    @JsonProperty("modelName")
    private String modelName;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("offline")
    private Boolean offline;

//    public String toKey(){
//        return this.areaName  + "," + this.equipmentName;
//    }

    public String toKey(){
        return this.equipmentName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public Boolean getOffline() {
        return offline;
    }

    public void setOffline(Boolean offline) {
        this.offline = offline;
    }
}
