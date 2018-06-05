package com.bistel.a3.portal.domain.pdm.work;

import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;

public class MeasureTrxWithBin extends MeasureTrx {
    private Integer eu_type;
    private Double scale_factor;
    private byte[] binary;

    public Integer getEu_type() {
        return eu_type;
    }

    public void setEu_type(Integer eu_type) {
        this.eu_type = eu_type;
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
