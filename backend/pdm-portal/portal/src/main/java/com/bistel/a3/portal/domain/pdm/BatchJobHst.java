package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class BatchJobHst {
    private Date job_dtts;
    private String job_cd;
    private String job_name;
    private Long eqp_id;
    private String eqp_name;
    private String job_status_cd;
    private String job_status_name;
    private String job_type_cd;
    private String job_type_name;
    private Date update_dtts;
    private String update_user_id;

    public BatchJobHst() {}

    public BatchJobHst(Date job_dtts, String job_cd, Long eqp_id, String job_status_cd, String job_type_cd, String user_id) {
        this.job_dtts = job_dtts;
        this.job_cd = job_cd;
        this.eqp_id = eqp_id;
        this.job_status_cd = job_status_cd;
        this.job_type_cd = job_type_cd;
        this.update_user_id = user_id;
    }

    public String getJob_name() {
        return job_name;
    }

    public void setJob_name(String job_name) {
        this.job_name = job_name;
    }

    public String getJob_status_name() {
        return job_status_name;
    }

    public void setJob_status_name(String job_status_name) {
        this.job_status_name = job_status_name;
    }

    public String getJob_type_name() {
        return job_type_name;
    }

    public void setJob_type_name(String job_type_name) {
        this.job_type_name = job_type_name;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public String getJob_type_cd() {
        return job_type_cd;
    }

    public void setJob_type_cd(String job_type_cd) {
        this.job_type_cd = job_type_cd;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public Date getJob_dtts() {
        return job_dtts;
    }

    public void setJob_dtts(Date job_dtts) {
        this.job_dtts = job_dtts;
    }

    public String getJob_cd() {
        return job_cd;
    }

    public void setJob_cd(String job_cd) {
        this.job_cd = job_cd;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public String getJob_status_cd() {
        return job_status_cd;
    }

    public void setJob_status_cd(String job_status_cd) {
        this.job_status_cd = job_status_cd;
    }

    public Date getUpdate_dtts() {
        return update_dtts;
    }

    public void setUpdate_dtts(Date update_dtts) {
        this.update_dtts = update_dtts;
    }

    public String getUpdate_user_id() {
        return update_user_id;
    }

    public void setUpdate_user_id(String update_user_id) {
        this.update_user_id = update_user_id;
    }
}
