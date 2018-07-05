package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class AlarmHistory {

    private Date alarm_dtts;
    private Long area_id;
    private String area_name;
    private Long eqp_id;
    private String eqp_name;
    private Long param_id;
    private String param_name;
    private String category;
    private String fault_class;


    public Date getAlarm_dtts() {
        return alarm_dtts;
    }

    public void setAlarm_dtts(Date alarm_dtts) {
        this.alarm_dtts = alarm_dtts;
    }

    public Long getArea_id() {
        return area_id;
    }

    public void setArea_id(Long area_id) {
        this.area_id = area_id;
    }

    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFault_class() {
        return fault_class;
    }

    public void setFault_class(String fault_class) {
        this.fault_class = fault_class;
    }





}
