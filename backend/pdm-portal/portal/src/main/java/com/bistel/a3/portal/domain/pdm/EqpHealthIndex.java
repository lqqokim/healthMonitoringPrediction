package com.bistel.a3.portal.domain.pdm;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class EqpHealthIndex {

    private Long area_id;

    private String area_name;

    private Long eqp_id;

    private String eqp_name;

    private double health_index;

    private double logic1;

    private double logic2;

    private double logic3;

    private double logic4;

    private Long logic1Param;
    private Long logic2Param;
    private Long logic3Param;
    private Long logic4Param;

    private String logic1param_name;
    private String logic2param_name;
    private String logic3param_name;
    private String logic4param_name;

    private double score;

    private int alarm_count;

    private String description;

    private int health_logic_mst_rawid;

    private Float upperAlarmSpec;
    private Float upperWarningSpec;

    private Date sum_dtts;

    public Date getSum_dtts() {
        return sum_dtts;
    }

    public void setSum_dtts(Date sum_dtts) {
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
    public String getLogic1param_name() {
        return logic1param_name;
    }

    public void setLogic1param_name(String logic1param_name) {
        this.logic1param_name = logic1param_name;
    }

    public String getLogic2param_name() {
        return logic2param_name;
    }

    public void setLogic2param_name(String logic2param_name) {
        this.logic2param_name = logic2param_name;
    }

    public String getLogic3param_name() {
        return logic3param_name;
    }

    public void setLogic3param_name(String logic3param_name) {
        this.logic3param_name = logic3param_name;
    }

    public String getLogic4param_name() {
        return logic4param_name;
    }

    public void setLogic4param_name(String logic4param_name) {
        this.logic4param_name = logic4param_name;
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

    public int getHealth_logic_mst_rawid() {
        return health_logic_mst_rawid;
    }

    public void setHealth_logic_mst_rawid(int health_logic_mst_rawid) {
        this.health_logic_mst_rawid = health_logic_mst_rawid;
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

    public double getHealth_index() {
        return health_index;
    }

    public void setHealth_index(double health_index) {
        this.health_index = health_index;
    }

    public double getLogic1() {
        return logic1;
    }

    public void setLogic1(double logic1) {
        this.logic1 = logic1;
    }

    public double getLogic2() {
        return logic2;
    }

    public void setLogic2(double logic2) {
        this.logic2 = logic2;
    }

    public double getLogic3() {
        return logic3;
    }

    public void setLogic3(double logic3) {
        this.logic3 = logic3;
    }

    public double getLogic4() {
        return logic4;
    }

    public void setLogic4(double logic4) {
        this.logic4 = logic4;
    }

    public int getAlarm_count() {
        return alarm_count;
    }

    public void setAlarm_count(int alarm_count) {
        this.alarm_count = alarm_count;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }



    private Long param_id;
    private String param_name;
    private int health_logic_id;
    private String code;
    private List<EqpHealthIndex> eqpHealthIndexParam = new ArrayList<>();
    private List<EqpHealthIndex> eqpHealthIndexInfo = new ArrayList<>();

    public List<EqpHealthIndex> getEqpHealthIndexParam() {
        return eqpHealthIndexParam;
    }

    public void setEqpHealthIndexParam(List<EqpHealthIndex> eqpHealthIndexParam) {
        this.eqpHealthIndexParam = eqpHealthIndexParam;
    }

    public List<EqpHealthIndex> getEqpHealthIndexInfo() {
        return eqpHealthIndexInfo;
    }

    public void setEqpHealthIndexInfo(List<EqpHealthIndex> eqpHealthIndexInfo) {
        this.eqpHealthIndexInfo = eqpHealthIndexInfo;
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

    public Long getLogic1Param() {
        return logic1Param;
    }

    public void setLogic1Param(Long logic1Param) {
        this.logic1Param = logic1Param;
    }

    public Long getLogic2Param() {
        return logic2Param;
    }

    public void setLogic2Param(Long logic2Param) {
        this.logic2Param = logic2Param;
    }

    public Long getLogic3Param() {
        return logic3Param;
    }

    public void setLogic3Param(Long logic3Param) {
        this.logic3Param = logic3Param;
    }

    public Long getLogic4Param() {
        return logic4Param;
    }

    public void setLogic4Param(Long logic4Param) {
        this.logic4Param = logic4Param;
    }
}
