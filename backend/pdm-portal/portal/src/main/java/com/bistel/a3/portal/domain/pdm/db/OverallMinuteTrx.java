package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class OverallMinuteTrx {

    @JsonProperty("problem_data_rawid")
    private Long problem_data_rawid;



    @JsonProperty("paramId")
    private Long param_id;
    @JsonProperty("readDtts")
    private Date read_dtts;
    private Double value;
    private Long rpm;
    private Double alarm;
    private Double warn;


    private Long rawid;
    private String reserved_col1;
    private String reserved_col2;
    private String reserved_col3;
    private String reserved_col4;
    private String reserved_col5;


    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
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

    public Long getProblem_data_rawid() {
        return problem_data_rawid;
    }

    public void setProblem_data_rawid(Long problem_data_rawid) {
        this.problem_data_rawid = problem_data_rawid;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Date getRead_dtts() {
        return read_dtts;
    }

    public void setRead_dtts(Date read_dtts) {
        this.read_dtts = read_dtts;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Long getRpm() {
        return rpm;
    }

    public void setRpm(Long rpm) {
        this.rpm = rpm;
    }

    public Double getAlarm() {
        return alarm;
    }

    public void setAlarm(Double alarm) {
        this.alarm = alarm;
    }

    public Double getWarn() {
        return warn;
    }

    public void setWarn(Double warn) {
        this.warn = warn;
    }

    @Override
    public String toString() {
        return "OverallMinuteTrx{" +
                "param_id=" + param_id +
                ", read_dtts=" + read_dtts +
                ", value=" + value +
                ", rpm=" + rpm +
                ", alarm=" + alarm +
                ", warn=" + warn +
                '}';
    }
}
