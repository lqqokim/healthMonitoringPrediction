package com.bistel.pdm.common.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class EquipmentMasterDataSet {

    @JsonProperty("areaName")
    private String areaName;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("eqpRawId")
    private Long eqpRawId;

//    public String toKey(){
//        return this.areaName  + "," + this.equipmentName;
//    }

    public String toKey(){
        return this.equipmentName;
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

    public Long getEqpRawId() {
        return eqpRawId;
    }

    public void setEqpRawId(Long eqpRawId) {
        this.eqpRawId = eqpRawId;
    }
}
