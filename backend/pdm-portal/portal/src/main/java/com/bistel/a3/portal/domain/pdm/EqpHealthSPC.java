package com.bistel.a3.portal.domain.pdm;

import java.util.List;

public class EqpHealthSPC {

    private List<List<Object>> eqpHealthTrendData;

    private List<List<Object>> eqpHealthTrendSPCData;

    public List<List<Object>> getEqpHealthTrendData() {
        return eqpHealthTrendData;
    }

    public void setEqpHealthTrendData(List<List<Object>> eqpHealthTrendData) {
        this.eqpHealthTrendData = eqpHealthTrendData;
    }

    public List<List<Object>> getEqpHealthTrendSPCData() {
        return eqpHealthTrendSPCData;
    }

    public void setEqpHealthTrendSPCData(List<List<Object>> eqpHealthTrendSPCData) {
        this.eqpHealthTrendSPCData = eqpHealthTrendSPCData;
    }
}
