package com.bistel.a3.portal.domain.pdm;

public class FabMonitoringInfo {
    private String locationName;
    private String status;
    private String displayvalue;
    private String info;
    private Double warning_spec;
    private Double alarm_spec;
    private Double value;
    private Double maxvalue;

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDisplayvalue() {
        return displayvalue;
    }

    public void setDisplayvalue(String displayvalue) {
        this.displayvalue = displayvalue;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public Double getWarning_spec() {
        return warning_spec;
    }

    public void setWarning_spec(Double warning_spec) {
        this.warning_spec = warning_spec;
    }

    public Double getAlarm_spec() {
        return alarm_spec;
    }

    public void setAlarm_spec(Double alarm_spec) {
        this.alarm_spec = alarm_spec;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getMaxvalue() {
        return maxvalue;
    }

    public void setMaxvalue(Double maxvalue) {
        this.maxvalue = maxvalue;
    }
}
