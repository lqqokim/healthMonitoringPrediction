package com.bistel.a3.portal.domain.pdm.std.master;

import com.fasterxml.jackson.annotation.JsonProperty;

public class STDRpm {
    private Long rawid;
    private Long param_mst_rawid;
    private Double rpm;
    private String user_name;
    private String param_name;

    public String getParam_name() {
        return param_name;
    }

    public void setParam_name(String param_name) {
        this.param_name = param_name;
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

    public Double getRpm() {
        return rpm;
    }

    public void setRpm(Double rpm) {
        this.rpm = rpm;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
}
