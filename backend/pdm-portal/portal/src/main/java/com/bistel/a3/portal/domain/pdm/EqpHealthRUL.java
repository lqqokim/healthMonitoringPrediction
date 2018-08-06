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


    private Long param_id;
    private String param_name;
    private Double intercept;
    private Double slope;
    private Date create_dtts;

    public Date getCreate_dtts() {
        return create_dtts;
    }

    public void setCreate_dtts(Date create_dtts) {
        this.create_dtts = create_dtts;
    }

    private Long xValue;

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public String getParam_name() {
        return param_name;
    }

    public void setParam_name(String param_name) {
        this.param_name = param_name;
    }

    public Double getIntercept() {
        return intercept;
    }

    public void setIntercept(Double intercept) {
        this.intercept = intercept;
    }

    public Double getSlope() {
        return slope;
    }

    public void setSlope(Double slope) {
        this.slope = slope;
    }



    public Long getxValue() {
        return xValue;
    }

    public void setxValue(Long xValue) {
        this.xValue = xValue;
    }
}
