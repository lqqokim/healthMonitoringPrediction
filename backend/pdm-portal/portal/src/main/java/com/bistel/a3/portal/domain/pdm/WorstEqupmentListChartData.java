package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class WorstEqupmentListChartData {

    private Long eqp_id;
    private String status;
    private Date start_dtts;
    private Date end_dtts;


    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getStart_dtts() {
        return start_dtts;
    }

    public void setStart_dtts(Date start_dtts) {
        this.start_dtts = start_dtts;
    }

    public Date getEnd_dtts() {
        return end_dtts;
    }

    public void setEnd_dtts(Date end_dtts) {
        this.end_dtts = end_dtts;
    }
}
