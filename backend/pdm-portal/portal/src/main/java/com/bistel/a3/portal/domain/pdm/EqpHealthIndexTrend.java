package com.bistel.a3.portal.domain.pdm;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class EqpHealthIndexTrend {

    private Long area_id;
    private String area_name;
    private Long eqp_id;
    private String eqp_name;
    private double score;
    private int alarm_count;
    private Float upperAlarmSpec;
    private Float upperWarningSpec;
    private String sum_dtts;
    private Long param_id;
    private String param_name;
    private int health_logic_id;
    private String code;

    public String getSum_dtts() {
        return sum_dtts;
    }

    public void setSum_dtts(String sum_dtts) {
        this.sum_dtts = sum_dtts;
    }

    public Float getUpperAlarmSpec() {
        return upperAlarmSpec;
    }

    public void setUpperAlarmSpec(Float upperAlarmSpec) {
        this.upperAlarmSpec = upperAlarmSpec;
    }

    public Float getUpperWarningSpec() {
        return upperWarningSpec;
    }

    public void setUpperWarningSpec(Float upperWarningSpec) {
        this.upperWarningSpec = upperWarningSpec;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

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

    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public int getAlarm_count() {
        return alarm_count;
    }

    public void setAlarm_count(int alarm_count) {
        this.alarm_count = alarm_count;
    }

    public int getHealth_logic_id() {
        return health_logic_id;
    }

    public void setHealth_logic_id(int health_logic_id) {
        this.health_logic_id = health_logic_id;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}