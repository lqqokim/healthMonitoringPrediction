package com.bistel.a3.portal.domain.pdm;

import java.util.Date;
import java.util.List;

public class EqpHealthRUL {


    private List<Object> rul_data;

    private List<List<Object>> eqpHealthTrendData;

    public List<Object> getRul_data() {
        return rul_data;
    }

    public void setRul_data(List<Object> rul_data) {
        this.rul_data = rul_data;
    }

    public List<List<Object>> getEqpHealthTrendData() {
        return eqpHealthTrendData;
    }

    public void setEqpHealthTrendData(List<List<Object>> eqpHealthTrendData) {
        this.eqpHealthTrendData = eqpHealthTrendData;
    }
}
