package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class MaintenanceHst {
    @JsonProperty("eqpId")
    private Long eqp_id;
    private Date eventdate;
    private String failuretype;
    private String failurecomments1;
    private String failurecomments2;

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Date getEventdate() {
        return eventdate;
    }

    public void setEventdate(Date eventdate) {
        this.eventdate = eventdate;
    }

    public String getFailuretype() {
        return failuretype;
    }

    public void setFailuretype(String failuretype) {
        this.failuretype = failuretype;
    }

    public String getFailurecomments1() {
        return failurecomments1;
    }

    public void setFailurecomments1(String failurecomments1) {
        this.failurecomments1 = failurecomments1;
    }

    public String getFailurecomments2() {
        return failurecomments2;
    }

    public void setFailurecomments2(String failurecomments2) {
        this.failurecomments2 = failurecomments2;
    }
}