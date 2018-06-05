package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class MeasureTrx {

    private Long problem_data_rawid;



    private Long param_id;
    @JsonProperty("measureDtts")
    private Date measure_dtts;
    private Double value;
    private Double rpm;
    @JsonProperty("endFreq")
    private Long end_freq;
    @JsonProperty("spectraLine")
    private Integer spectra_line;
    @JsonProperty("measurementId")
    private Long measure_trx_id;
    @JsonProperty("paramId")

    private Double sampling_time;
    private String reserved_col1;
    private String reserved_col2;
    private String reserved_col3;
    private String reserved_col4;
    private String reserved_col5;


    public String getReserved_col1() {
        return reserved_col1;
    }

    public void setReserved_col1(String reserved_col1) {
        this.reserved_col1 = reserved_col1;
    }

    public String getReserved_col2() {
        return reserved_col2;
    }

    public void setReserved_col2(String reserved_col2) {
        this.reserved_col2 = reserved_col2;
    }

    public String getReserved_col3() {
        return reserved_col3;
    }

    public void setReserved_col3(String reserved_col3) {
        this.reserved_col3 = reserved_col3;
    }

    public String getReserved_col4() {
        return reserved_col4;
    }

    public void setReserved_col4(String reserved_col4) {
        this.reserved_col4 = reserved_col4;
    }

    public String getReserved_col5() {
        return reserved_col5;
    }

    public void setReserved_col5(String reserved_col5) {
        this.reserved_col5 = reserved_col5;
    }

    public Double getSampling_time() {
        return sampling_time;
    }

    public void setSampling_time(Double sampling_time) {
        this.sampling_time = sampling_time;
    }

    public Long getProblem_data_rawid() {
        return problem_data_rawid;
    }

    public void setProblem_data_rawid(Long problem_data_rawid) {
        this.problem_data_rawid = problem_data_rawid;
    }


    public Double getRpm() {
        return rpm;
    }

    public void setRpm(Double rpm) {
        this.rpm = rpm;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Date getMeasure_dtts() {
        return measure_dtts;
    }

    public void setMeasure_dtts(Date measure_dtts) {
        this.measure_dtts = measure_dtts;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Long getEnd_freq() {
        return end_freq;
    }

    public void setEnd_freq(Long end_freq) {
        this.end_freq = end_freq;
    }

    public Integer getSpectra_line() {
        return spectra_line;
    }

    public void setSpectra_line(Integer spectra_line) {
        this.spectra_line = spectra_line;
    }

    public Long getMeasure_trx_id() {
        return measure_trx_id;
    }

    public void setMeasure_trx_id(Long measure_trx_id) {
        this.measure_trx_id = measure_trx_id;
    }

    @Override
    public String toString() {
        return "MeasureTrx{" +
                "param_id=" + param_id +
                ", measure_dtts=" + measure_dtts +
                ", value=" + value +
                ", rpm=" + rpm +
                ", end_freq=" + end_freq +
                ", spectra_line=" + spectra_line +
                ", measure_trx_id=" + measure_trx_id +
                '}';
    }
}
