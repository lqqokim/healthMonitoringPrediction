package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MeasureTrxBin {
    @JsonProperty("measureTrxId")
    private Long measure_trx_id;
    @JsonProperty("binDataTypeCd")
    private String bin_data_type_cd;
    @JsonProperty("scaleFactor")
    private Double scale_factor;
    private byte[] binary;

    public Long getMeasure_trx_id() {
        return measure_trx_id;
    }

    public void setMeasure_trx_id(Long measure_trx_id) {
        this.measure_trx_id = measure_trx_id;
    }

    public String getBin_data_type_cd() {
        return bin_data_type_cd;
    }

    public void setBin_data_type_cd(String bin_data_type_cd) {
        this.bin_data_type_cd = bin_data_type_cd;
    }

    public Double getScale_factor() {
        return scale_factor;
    }

    public void setScale_factor(Double scale_factor) {
        this.scale_factor = scale_factor;
    }

    public byte[] getBinary() {
        return binary;
    }

    public void setBinary(byte[] binary) {
        this.binary = binary;
    }
}
