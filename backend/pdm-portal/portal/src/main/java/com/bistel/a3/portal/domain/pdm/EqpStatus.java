package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.db.Eqp;

public class EqpStatus extends Eqp {
    private String areaName;
    private Double score;
    private Float healthVariation;
    private AlarmCount multiVariant;
    private Double warningSpec;
    private Double alarmSpec;
    private Long expectedAlarm;
    private String cause1;
    private String cause2;
    private String cause3;
    private String alarm = "-";
    private String warning = "-";
    private String inactive = "-";
    private String normal = "O";

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public String getAlarm() {
        return alarm;
    }

    public void setAlarm(String alarm) {
        this.alarm = alarm;
    }

    public String getWarning() {
        return warning;
    }

    public void setWarning(String warning) {
        this.warning = warning;
    }

    public String getInactive() {
        return inactive;
    }

    public void setInactive(String inactive) {
        this.inactive = inactive;
    }

    public String getNormal() {
        return normal;
    }

    public void setNormal(String normal) {
        this.normal = normal;
    }

    public Double getWarningSpec() {
        return warningSpec;
    }

    public void setWarningSpec(Double warningSpec) {
        this.warningSpec = warningSpec;
    }

    public Double getAlarmSpec() {
        return alarmSpec;
    }

    public void setAlarmSpec(Double alarmSpec) {
        this.alarmSpec = alarmSpec;
    }

    public Long getExpectedAlarm() {
        return expectedAlarm;
    }

    public void setExpectedAlarm(Long expectedAlarm) {
        this.expectedAlarm = expectedAlarm;
    }

    public Float getHealthVariation() {
        return healthVariation;
    }

    public void setHealthVariation(Float healthVariation) {
        this.healthVariation = healthVariation;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public AlarmCount getMultiVariant() {
        return multiVariant;
    }

    public void setMultiVariant(AlarmCount multiVariant) {
        this.multiVariant = multiVariant;
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
