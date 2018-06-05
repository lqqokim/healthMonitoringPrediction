package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class Feature {
    @JsonProperty("measureTrxId")
    private Long measure_trx_id;
    private Double peak;
    private Double rms;
    private Double skewness;
    private Double kurtosis;
    private Double crest;
    private Double clearance;
    private Double impulse;
    private Double shape;
    private Double overall;
    @JsonProperty("createDtts")
    private Date create_dtts;

    public Long getMeasure_trx_id() {
        return measure_trx_id;
    }

    public void setMeasure_trx_id(Long measure_trx_id) {
        this.measure_trx_id = measure_trx_id;
    }

    public Double getPeak() {
        return peak;
    }

    public void setPeak(Double peak) {
        this.peak = peak;
    }

    public Double getRms() {
        return rms;
    }

    public void setRms(Double rms) {
        this.rms = rms;
    }

    public Double getSkewness() {
        return skewness;
    }

    public void setSkewness(Double skewness) {
        this.skewness = skewness;
    }

    public Double getKurtosis() {
        return kurtosis;
    }

    public void setKurtosis(Double kurtosis) {
        this.kurtosis = kurtosis;
    }

    public Double getCrest() {
        return crest;
    }

    public void setCrest(Double crest) {
        this.crest = crest;
    }

    public Double getClearance() {
        return clearance;
    }

    public void setClearance(Double clearance) {
        this.clearance = clearance;
    }

    public Double getImpulse() {
        return impulse;
    }

    public void setImpulse(Double impulse) {
        this.impulse = impulse;
    }

    public Double getShape() {
        return shape;
    }

    public void setShape(Double shape) {
        this.shape = shape;
    }

    public Double getOverall() {
        return overall;
    }

    public void setOverall(Double overall) {
        this.overall = overall;
    }

    public Date getCreate_dtts() {
        return create_dtts;
    }

    public void setCreate_dtts(Date create_dtts) {
        this.create_dtts = create_dtts;
    }
}
