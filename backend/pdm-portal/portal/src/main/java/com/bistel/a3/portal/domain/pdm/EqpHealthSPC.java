package com.bistel.a3.portal.domain.pdm;

import java.util.List;

public class EqpHealthSPC {

    private List<List<Object>> eqpHealthTrendData;

    private List<List<Object>> scpPeriod;

    public List<List<Object>> getScpPeriod() {
        return scpPeriod;
    }

    public void setScpPeriod(List<List<Object>> scpPeriod) {
        this.scpPeriod = scpPeriod;
    }

    public List<List<Object>> getEqpHealthTrendData() {
        return eqpHealthTrendData;
    }

    public void setEqpHealthTrendData(List<List<Object>> eqpHealthTrendData) {
        this.eqpHealthTrendData = eqpHealthTrendData;
    }


}
