package com.bistel.a3.portal.domain.pdm;

import java.util.ArrayList;
import java.util.List;

public class STDTraceData {
    private Long eqp_id;
    private Long param_id;
    private Double alarm_spec;
    private Double warning_spec;
    private String param_name;
    private String eqp_name;
    private List<List<Object>> datas = new ArrayList<>();

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Double getAlarm_spec() {
        return alarm_spec;
    }

    public void setAlarm_spec(Double alarm_spec) {
        this.alarm_spec = alarm_spec;
    }

    public Double getWarning_spec() {
        return warning_spec;
    }

    public void setWarning_spec(Double warning_spec) {
        this.warning_spec = warning_spec;
    }

    public String getParam_name() {
        return param_name;
    }

    public void setParam_name(String param_name) {
        this.param_name = param_name;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public List<List<Object>> getDatas() {
        return datas;
    }

    public void setDatas(List<List<Object>> datas) {
        this.datas = datas;
    }
}
