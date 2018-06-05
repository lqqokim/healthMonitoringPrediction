package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class STDTraceRawTrx {

    private Long rawid;
    private Long param_mst_rawid;
    private Long trace_trx_rawid;
    private String data_type_cd;
    private Long max_freq;
    private int freq_count;
    private Double rpm;
    private Double sampling_time;
    private byte[] binary;
    private Date event_dtts;
    private String reserved_col1="";
    private String reserved_col2="";
    private String reserved_col3="";
    private String reserved_col4="";
    private String reserved_col5="";

    public int getFreq_count() {
        return freq_count;
    }

    public void setFreq_count(int freq_count) {
        this.freq_count = freq_count;
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

    public Long getTrace_trx_rawid() {
        return trace_trx_rawid;
    }

    public void setTrace_trx_rawid(Long trace_trx_rawid) {
        this.trace_trx_rawid = trace_trx_rawid;
    }

    public String getData_type_cd() {
        return data_type_cd;
    }

    public void setData_type_cd(String data_type_cd) {
        this.data_type_cd = data_type_cd;
    }

    public Long getMax_freq() {
        return max_freq;
    }

    public void setMax_freq(Long max_freq) {
        this.max_freq = max_freq;
    }

    public Double getRpm() {
        return rpm;
    }

    public void setRpm(Double rpm) {
        this.rpm = rpm;
    }

    public Double getSampling_time() {
        return sampling_time;
    }

    public void setSampling_time(Double sampling_time) {
        this.sampling_time = sampling_time;
    }

    public byte[] getBinary() {
        return binary;
    }

    public void setBinary(byte[] binary) {
        this.binary = binary;
    }

    public Date getEvent_dtts() {
        return event_dtts;
    }

    public void setEvent_dtts(Date event_dtts) {
        this.event_dtts = event_dtts;
    }

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
}
