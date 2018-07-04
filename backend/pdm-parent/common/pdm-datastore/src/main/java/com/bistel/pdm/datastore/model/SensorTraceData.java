package com.bistel.pdm.datastore.model;

public class SensorTraceData {
    public long rawid;
    public long param_mst_rawid;
    public float value;
    public Float upperAlarmSpec;
    public Float upperWarningSpec;
    public Float target;
    public Float lowerAlarmSpec;
    public Float lowerWarningSpec;
    public long event_dtts;
    public String reserved_col1;
    public String reserved_col2;
    public String reserved_col3;
    public String reserved_col4;
    public String reserved_col5;

    public long getRawid() {
        return rawid;
    }

    public void setRawid(long rawid) {
        this.rawid = rawid;
    }

    public long getParamMstRawid() {
        return param_mst_rawid;
    }

    public void setParamMstRawid(long param_mst_rawid) {
        this.param_mst_rawid = param_mst_rawid;
    }

    public float getValue() {
        return value;
    }

    public void setValue(float value) {
        this.value = value;
    }

    public Float getUpperAlarmSpec() {
        return upperAlarmSpec;
    }

    public void setUpperAlarmSpec(Float upperAlarmSpec) {
        this.upperAlarmSpec = upperAlarmSpec;
    }

    public Float getUpperWarningSpec() {
        return upperWarningSpec;
    }

    public void setUpperWarningSpec(Float upperWarningSpec) {
        this.upperWarningSpec = upperWarningSpec;
    }

    public Float getTarget() {
        return target;
    }

    public void setTarget(Float target) {
        this.target = target;
    }

    public Float getLowerAlarmSpec() {
        return lowerAlarmSpec;
    }

    public void setLowerAlarmSpec(Float lowerAlarmSpec) {
        this.lowerAlarmSpec = lowerAlarmSpec;
    }

    public Float getLowerWarningSpec() {
        return lowerWarningSpec;
    }

    public void setLowerWarningSpec(Float lowerWarningSpec) {
        this.lowerWarningSpec = lowerWarningSpec;
    }

    public long getEventDtts() {
        return event_dtts;
    }

    public void setEventDtts(long event_dtts) {
        this.event_dtts = event_dtts;
    }

    public String getReservedCol1() {
        return reserved_col1;
    }

    public void setReservedCol1(String reserved_col1) {
        this.reserved_col1 = reserved_col1;
    }

    public String getReservedCol2() {
        return reserved_col2;
    }

    public void setReservedCol2(String reserved_col2) {
        this.reserved_col2 = reserved_col2;
    }

    public String getReservedCol3() {
        return reserved_col3;
    }

    public void setReservedCol3(String reserved_col3) {
        this.reserved_col3 = reserved_col3;
    }

    public String getReservedCol4() {
        return reserved_col4;
    }

    public void setReservedCol4(String reserved_col4) {
        this.reserved_col4 = reserved_col4;
    }

    public String getReservedCol5() {
        return reserved_col5;
    }

    public void setReservedCol5(String reserved_col5) {
        this.reserved_col5 = reserved_col5;
    }
}
