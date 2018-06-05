package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ManualRpm {
    @JsonProperty("paramId")
    private Long param_id;
    private Double rpm;

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Double getRpm() {
        return rpm;
    }

    public void setRpm(Double rpm) {
        this.rpm = rpm;
    }
}
