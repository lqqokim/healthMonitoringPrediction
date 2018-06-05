package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class HealthDaily {
    @JsonProperty("eqpId")
    private Long eqp_id;
    @JsonProperty("measureDtts")
    private Date measure_dtts;
    private Double value;
    private Double score;

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Date getMeasure_dtts() {
        return measure_dtts;
    }

    public void setMeasure_dtts(Date measure_dtts) {
        this.measure_dtts = measure_dtts;
    }
}
