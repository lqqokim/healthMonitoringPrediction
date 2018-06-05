package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class EqpStatusData {
    @JsonProperty("eqpId")
    private Long eqp_id;
    private String name;
    @JsonProperty("startDtts")
    private Date start_dtts;
    @JsonIgnore
    private Integer status;
    private String type;
    private Long area_id;

    public Long getArea_id() {
        return area_id;
    }

    public void setArea_id(Long area_id) {
        this.area_id = area_id;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getStart_dtts() {
        return start_dtts;
    }

    public void setStart_dtts(Date start_dtts) {
        this.start_dtts = start_dtts;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
