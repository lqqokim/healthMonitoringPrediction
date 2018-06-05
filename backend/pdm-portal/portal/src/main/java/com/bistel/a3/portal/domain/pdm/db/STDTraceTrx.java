package com.bistel.a3.portal.domain.pdm.db;

import java.util.Date;

public class STDTraceTrx {

    private Long rawid;
    private Long param_mst_rawid;
    private Double value;
    private int rpm;
    private Double alarm_spec;
    private Double warning_spec;
    private Date event_dtts;
    private String reserved_col1="";
    private String reserved_col2="";
    private String reserved_col3="";
    private String reserved_col4="";
    private String reserved_col5="";

    private String eqpName;
    private String paramName;

    public String getEqpName() {
        return eqpName;
    }

    public void setEqpName(String eqpName) {
        this.eqpName = eqpName;
    }

    public String getParamName() {
        return paramName;
    }

    public void setParamName(String paramName) {
        this.paramName = paramName;
    }

    public int getRpm() {
        return rpm;
    }

    public void setRpm(int rpm) {
        this.rpm = rpm;
    }

    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
    }

    public Long getParam_mst_rawid() {
        return param_mst_rawid;
    }

    public void setParam_mst_rawid(Long param_mst_rawid) {
        this.param_mst_rawid = param_mst_rawid;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getAlarm_spec() {
        return alarm_spec;
    }

    public void setAlarm_spec(Double alarm_spec) {
        this.alarm_spec = alarm_spec;
    }

    public Double getWarning_spec() {
        return warning_spec;
    }

    public void setWarning_spec(Double warning_spec) {
        this.warning_spec = warning_spec;
    }

    public Date getEvent_dtts() {
        return event_dtts;
    }

    public void setEvent_dtts(Date event_dtts) {
        this.event_dtts = event_dtts;
    }

    public String getReserved_col1() {
        return reserved_col1;
    }

    public void setReserved_col1(String reserved_col1) {
        this.reserved_col1 = reserved_col1;
    }

    public String getReserved_col2() {
        return reserved_col2;
    }

    public void setReserved_col2(String reserved_col2) {
        this.reserved_col2 = reserved_col2;
    }

    public String getReserved_col3() {
        return reserved_col3;
    }

    public void setReserved_col3(String reserved_col3) {
        this.reserved_col3 = reserved_col3;
    }

    public String getReserved_col4() {
        return reserved_col4;
    }

    public void setReserved_col4(String reserved_col4) {
        this.reserved_col4 = reserved_col4;
    }

    public String getReserved_col5() {
        return reserved_col5;
    }

    public void setReserved_col5(String reserved_col5) {
        this.reserved_col5 = reserved_col5;
    }
}
