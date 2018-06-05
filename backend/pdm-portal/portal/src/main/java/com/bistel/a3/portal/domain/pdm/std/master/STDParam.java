package com.bistel.a3.portal.domain.pdm.std.master;

import com.fasterxml.jackson.annotation.JsonProperty;

public class STDParam {
    private Long rawid;
    private Long eqp_mst_rawid;
    private Long parts_mst_rawid;
    private String name;
    private String description;
    private String param_type_cd;
    private String unit_cd;
    private String user_name;
    private String eqp_name;
    private String parts_name;
    private String param_type_name;
    private String unit_name;


    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public String getParts_name() {
        return parts_name;
    }

    public void setParts_name(String parts_name) {
        this.parts_name = parts_name;
    }

    public String getParam_type_name() {
        return param_type_name;
    }

    public void setParam_type_name(String param_type_name) {
        this.param_type_name = param_type_name;
    }

    public String getUnit_name() {
        return unit_name;
    }

    public void setUnit_name(String unit_name) {
        this.unit_name = unit_name;
    }

    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
    }

    public Long getEqp_mst_rawid() {
        return eqp_mst_rawid;
    }

    public void setEqp_mst_rawid(Long eqp_mst_rawid) {
        this.eqp_mst_rawid = eqp_mst_rawid;
    }

    public Long getParts_mst_rawid() {
        return parts_mst_rawid;
    }

    public void setParts_mst_rawid(Long parts_mst_rawid) {
        this.parts_mst_rawid = parts_mst_rawid;
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

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
}
