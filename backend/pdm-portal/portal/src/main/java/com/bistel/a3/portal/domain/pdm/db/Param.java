package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Param {
    @JsonProperty("paramId")
    private Long param_id;

    @JsonProperty("eqpId")
    private Long eqp_id;

    @JsonProperty("paramType")
    private Long param_type;

    @JsonProperty("paramName")
    private String name;
    private String description;

    @JsonProperty("sortOrder")
    private Long sort_order;

    private String userName;

    @JsonProperty("param_type_cd")
    private String param_type_cd;

    @JsonProperty("unit_cd")
    private String unit_cd;
    private String unit_name;
    private String param_type_name;
    private Long parts_id;
    private String parts_name;

    public String getParts_name() {
        return parts_name;
    }

    public void setParts_name(String parts_name) {
        this.parts_name = parts_name;
    }

    public Long getParts_id() {
        return parts_id;
    }

    public void setParts_id(Long parts_id) {
        this.parts_id = parts_id;
    }

    public String getUnit_name() {
        return unit_name;
    }

    public void setUnit_name(String unit_name) {
        this.unit_name = unit_name;
    }

    public String getParam_type_name() {
        return param_type_name;
    }

    public void setParam_type_name(String param_type_name) {
        this.param_type_name = param_type_name;
    }

    public String getParam_type_cd() {
        return param_type_cd;
    }

    public void setParam_type_cd(String param_type_cd) {
        this.param_type_cd = param_type_cd;
    }

    public String getUnit_cd() {
        return unit_cd;
    }

    public void setUnit_cd(String unit_cd) {
        this.unit_cd = unit_cd;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }


    //2018-03-28 Allen
    @JsonProperty("alarm")
    private Double alarm;

    @JsonProperty("warning")
    private Double warn;
    /////////////////////////////////////////////////


    public Long getSort_order() {
        return sort_order;
    }

    public void setSort_order(Long sort_order) {
        this.sort_order = sort_order;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Long getParam_type() {
        return param_type;
    }

    public void setParam_type(Long param_type) {
        this.param_type = param_type;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    //2018-03-28 Allen
    public Double getAlarm() { return alarm; }

    public void setAlarm(Double alarm) { this.alarm = alarm; }

    public Double getWarn() { return warn; }

    public void setWarn(Double warn) { this.warn = warn; }


}
