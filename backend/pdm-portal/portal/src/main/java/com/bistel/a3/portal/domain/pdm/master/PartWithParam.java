package com.bistel.a3.portal.domain.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.Part;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PartWithParam extends Part {
    @JsonProperty("eqpId")
    private Long eqp_id;
    @JsonProperty("eqpName")
    private String eqp_name;
    @JsonProperty("paramId")
    private Long param_id;
    @JsonProperty("paramName")
    private String param_name;

    @Override
    public Long getEqp_id() {
        return eqp_id;
    }

    @Override
    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public String getParam_name() {
        return param_name;
    }

    public void setParam_name(String param_name) {
        this.param_name = param_name;
    }
}
