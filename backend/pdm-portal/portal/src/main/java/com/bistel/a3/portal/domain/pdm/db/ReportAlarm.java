package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class ReportAlarm {
    @JsonProperty("eqpId")
    private Long eqp_id;
    @JsonProperty("eqpName")
    private String eqp_name;
    @JsonProperty("occurDtts")
    private Date occur_dtts;
    private Double score;
    @JsonProperty("writeDtts")
    private Date write_dtts;
    @JsonProperty("completeDtts")
    private Date complete_dtts;
    @JsonProperty("completeUserId")
    private String complete_user_id;
    @JsonProperty("requestDtts")
    private Date request_dtts;
    @JsonProperty("stateCd")
    private String state_cd;
    @JsonProperty("stateName")
    private String state_name;
    @JsonProperty("requestUserId")
    private String request_user_id;
    private String cause1;
    private String cause2;
    private String cause3;
    @JsonProperty("causeUpdate")
    private String cause_update;
    @JsonProperty("paramId")
    private Long param_id;
    @JsonProperty("measureTrxId")
    private Long measure_trx_id;
    private String content;

    public String getComplete_user_id() {
        return complete_user_id;
    }

    public void setComplete_user_id(String complete_user_id) {
        this.complete_user_id = complete_user_id;
    }

    public String getCause_update() {
        return cause_update;
    }

    public void setCause_update(String cause_update) {
        this.cause_update = cause_update;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public String getState_name() {
        return state_name;
    }

    public void setState_name(String state_name) {
        this.state_name = state_name;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Date getOccur_dtts() {
        return occur_dtts;
    }

    public void setOccur_dtts(Date occur_dtts) {
        this.occur_dtts = occur_dtts;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Date getWrite_dtts() {
        return write_dtts;
    }

    public void setWrite_dtts(Date write_dtts) {
        this.write_dtts = write_dtts;
    }

    public Date getComplete_dtts() {
        return complete_dtts;
    }

    public void setComplete_dtts(Date complete_dtts) {
        this.complete_dtts = complete_dtts;
    }

    public Date getRequest_dtts() {
        return request_dtts;
    }

    public void setRequest_dtts(Date request_dtts) {
        this.request_dtts = request_dtts;
    }

    public String getState_cd() {
        return state_cd;
    }

    public void setState_cd(String state_cd) {
        this.state_cd = state_cd;
    }

    public String getRequest_user_id() {
        return request_user_id;
    }

    public void setRequest_user_id(String request_user_id) {
        this.request_user_id = request_user_id;
    }

    public String getCause1() {
        return cause1;
    }

    public void setCause1(String cause1) {
        this.cause1 = cause1;
    }

    public String getCause2() {
        return cause2;
    }

    public void setCause2(String cause2) {
        this.cause2 = cause2;
    }

    public String getCause3() {
        return cause3;
    }

    public void setCause3(String cause3) {
        this.cause3 = cause3;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public Long getMeasure_trx_id() {
        return measure_trx_id;
    }

    public void setMeasure_trx_id(Long measure_trx_id) {
        this.measure_trx_id = measure_trx_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
