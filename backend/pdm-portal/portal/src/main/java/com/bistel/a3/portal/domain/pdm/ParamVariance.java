package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ParamVariance {
    @JsonProperty("paramId")
    private Long param_id;
    private Double variance;

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Double getVariance() {
        return variance;
    }

    public void setVariance(Double variance) {
        this.variance = variance;
    }
}
