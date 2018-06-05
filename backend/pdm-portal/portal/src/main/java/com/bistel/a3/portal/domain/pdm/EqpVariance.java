package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class EqpVariance {
    @JsonProperty("eqpId")
    private Long eqp_id;
    private Double variance;
    private List<ParamVariance> params;

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Double getVariance() {
        return variance;
    }

    public void setVariance(Double variance) {
        this.variance = variance;
    }

    public List<ParamVariance> getParams() {
        return params;
    }

    public void setParams(List<ParamVariance> params) {
        this.params = params;
    }
}
