package com.bistel.a3.portal.domain.pdm.master;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ParamWithCommonWithRpm extends ParamWithCommon {
//    @JsonProperty("eqpName")
//    private String eqp_name;
    private Integer rpm;

//    public String getEqp_name() {
//        return eqp_name;
//    }
//
//    public void setEqp_name(String eqp_name) {
//        this.eqp_name = eqp_name;
//    }

    public Integer getRpm() {
        return rpm;
    }

    public void setRpm(Integer rpm) {
        this.rpm = rpm;
    }
}
