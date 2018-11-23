package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ToolAlarmMaster {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("alarmId")
    private String alarmId;

    @JsonProperty("alarmCode")
    private String alarmCode;

    @JsonProperty("alarmText")
    private String alarmText;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlarmId() {
        return alarmId;
    }

    public void setAlarmId(String alarmId) {
        this.alarmId = alarmId;
    }

    public String getAlarmCode() {
        return alarmCode;
    }

    public void setAlarmCode(String alarmCode) {
        this.alarmCode = alarmCode;
    }

    public String getAlarmText() {
        return alarmText;
    }

    public void setAlarmText(String alarmText) {
        this.alarmText = alarmText;
    }
}
