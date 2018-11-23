package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class SpecRuleExpressionMaster {

    @JsonProperty("equipmentRawId")
    private Long equipmentRawId;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("ruleName")
    private String ruleName;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("svid")
    private String svid;

    @JsonProperty("parameterRawId")
    private Long parameterRawId;

//    public String toKey(){
//        return this.areaName  + "," + this.equipmentName;
//    }


    public Long getEquipmentRawId() {
        return equipmentRawId;
    }

    public void setEquipmentRawId(Long equipmentRawId) {
        this.equipmentRawId = equipmentRawId;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getSvid() {
        return svid;
    }

    public void setSvid(String svid) {
        this.svid = svid;
    }

    public Long getParameterRawId() {
        return parameterRawId;
    }

    public void setParameterRawId(Long parameterRawId) {
        this.parameterRawId = parameterRawId;
    }
}
