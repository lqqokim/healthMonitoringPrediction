package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class AlarmHistory {

    private Date time;
    private String eqp_name;
    private String eqp_rawid;
    private String param;
    private String param_id;
    private String category;
    private String fault_class;
    private String description;
    private String area_name;
    private Long area_rawid;


    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    public Long getArea_rawid() {
        return area_rawid;
    }

    public void setArea_rawid(Long area_rawid) {
        this.area_rawid = area_rawid;
    }



    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public String getEqp_rawid() {
        return eqp_rawid;
    }

    public void setEqp_rawid(String eqp_rawid) {
        this.eqp_rawid = eqp_rawid;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    public String getParam_id() {
        return param_id;
    }

    public void setParam_id(String param_id) {
        this.param_id = param_id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
