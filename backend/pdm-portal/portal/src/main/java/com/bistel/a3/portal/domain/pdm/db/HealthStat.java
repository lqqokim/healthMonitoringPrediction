package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class HealthStat {
    @JsonProperty("eqpId")
    private Long eqp_id;
    @JsonProperty("measureDtts")
    private Date measure_dtts;
    private Double score;
    @JsonProperty("totalCnt")
    private Long total_cnt;
    @JsonProperty("alarmCnt")
    private Long alarm_cnt;
    @JsonProperty("warnCnt")
    private Long warn_cnt;
    @JsonProperty("healthVariation")
    private Double health_variation;
    @JsonProperty("expectedAlarm")
    private Long expected_alarm;
    private String cause1;
    private String cause2;
    private String cause3;

    private Integer alarm = 0;
    private Integer warn = 0;

    private Long paramId;
    private Long measureTrxId;

    public Integer getAlarm() {
        return alarm;
    }

    public void setAlarm(Integer alarm) {
        this.alarm = alarm;
    }

    public Integer getWarn() {
        return warn;
    }

    public void setWarn(Integer warn) {
        this.warn = warn;
    }

    public Long getParamId() {
        return paramId;
    }

    public void setParamId(Long paramId) {
        this.paramId = paramId;
    }

    public Long getMeasureTrxId() {
        return measureTrxId;
    }

    public void setMeasureTrxId(Long measureTrxId) {
        this.measureTrxId = measureTrxId;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Date getMeasure_dtts() {
        return measure_dtts;
    }

    public void setMeasure_dtts(Date measure_dtts) {
        this.measure_dtts = measure_dtts;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Long getTotal_cnt() {
        return total_cnt;
    }

    public void setTotal_cnt(Long total_cnt) {
        this.total_cnt = total_cnt;
    }

    public Long getAlarm_cnt() {
        return alarm_cnt;
    }

    public void setAlarm_cnt(Long alarm_cnt) {
        this.alarm_cnt = alarm_cnt;
    }

    public Long getWarn_cnt() {
        return warn_cnt;
    }

    public void setWarn_cnt(Long warn_cnt) {
        this.warn_cnt = warn_cnt;
    }

    public Double getHealth_variation() {
        return health_variation;
    }

    public void setHealth_variation(Double health_variation) {
        this.health_variation = health_variation;
    }

    public Long getExpected_alarm() {
        return expected_alarm;
    }

    public void setExpected_alarm(Long expected_alarm) {
        this.expected_alarm = expected_alarm;
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
}
