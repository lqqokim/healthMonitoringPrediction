package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class EventMaster {

    @JsonProperty("areaName")
    private String areaName;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("eqpRawId")
    private Long eqpRawId;

    @JsonProperty("eventRawId")
    private Long eventRawId;

    @JsonProperty("eventName")
    private String eventName;

    @JsonProperty("eventTypeCD")
    private String eventTypeCD;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("condition")
    private String condition;

    @JsonProperty("processYN")
    private String processYN;

    @JsonProperty("paramParseIndex")
    private Integer paramParseIndex;

    @JsonProperty("timeIntervalYn")
    private String timeIntervalYn;

    @JsonProperty("intervalTimeMs")
    private Long intervalTimeMs;

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

    public Long getEventRawId() {
        return eventRawId;
    }

    public void setEventRawId(Long eventRawId) {
        this.eventRawId = eventRawId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventTypeCD() {
        return eventTypeCD;
    }

    public void setEventTypeCD(String eventTypeCD) {
        this.eventTypeCD = eventTypeCD;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getProcessYN() {
        return processYN;
    }

    public void setProcessYN(String processYN) {
        this.processYN = processYN;
    }

    public Integer getParamParseIndex() {
        return paramParseIndex;
    }

    public void setParamParseIndex(Integer paramParseIndex) {
        this.paramParseIndex = paramParseIndex;
    }

    public String getTimeIntervalYn() {
        return timeIntervalYn;
    }

    public void setTimeIntervalYn(String timeIntervalYn) {
        this.timeIntervalYn = timeIntervalYn;
    }

    public Long getIntervalTimeMs() {
        return intervalTimeMs;
    }

    public void setIntervalTimeMs(Long intervalTimeMs) {
        this.intervalTimeMs = intervalTimeMs;
    }
}
