package com.bistel.a3.portal.domain.pdm.db;

import java.util.Date;

public class TestTraceRawTrx {

    private Long rawid;
    private Long param_mst_rawid;
    private Long trace_trx_rawid;
    private String data_type_cd;
    private Long max_freq;
    private Long freq_count;
    private Double rpm;
    private Double sampling_time;
    private byte[] binary_data;
    private Date event_dtts;

    public byte[] getBinary_data() {
        return binary_data;
    }

    public void setBinary_data(byte[] binary_data) {
        this.binary_data = binary_data;
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

    public Long getFreq_count() {
        return freq_count;
    }

    public void setFreq_count(Long freq_count) {
        this.freq_count = freq_count;
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



    public Date getEvent_dtts() {
        return event_dtts;
    }

    public void setEvent_dtts(Date event_dtts) {
        this.event_dtts = event_dtts;
    }
}
