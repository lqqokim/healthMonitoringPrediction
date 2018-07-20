package com.bistel.a3.portal.domain.pdm;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class EqpHealthRUL {



    private List<List<Object>> eqpHealthTrendData;



    private Long rulStartTime;
    private Double rulStartValue;
    private Long rulEndTime;
    private Double rulEndValue;

    public Long getRulStartTime() {
        return rulStartTime;
    }

    public void setRulStartTime(Long rulStartTime) {
        this.rulStartTime = rulStartTime;
    }

    public Double getRulStartValue() {
        return rulStartValue;
    }

    public void setRulStartValue(Double rulStartValue) {
        this.rulStartValue = rulStartValue;
    }

    public Long getRulEndTime() {
        return rulEndTime;
    }

    public void setRulEndTime(Long rulEndTime) {
        this.rulEndTime = rulEndTime;
    }

    public Double getRulEndValue() {
        return rulEndValue;
    }

    public void setRulEndValue(Double rulEndValue) {
        this.rulEndValue = rulEndValue;
    }

    public List<List<Object>> getEqpHealthTrendData() {
        return eqpHealthTrendData;
    }

    public void setEqpHealthTrendData(List<List<Object>> eqpHealthTrendData) {
        this.eqpHealthTrendData = eqpHealthTrendData;
    }
}
