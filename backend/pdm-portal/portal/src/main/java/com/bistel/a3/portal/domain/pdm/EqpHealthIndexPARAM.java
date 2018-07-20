package com.bistel.a3.portal.domain.pdm;

import java.util.List;

public class EqpHealthIndexPARAM {

    private Long area_id;

    private String area_name;

    private Long eqp_id;

    private String eqp_name;

    private double health_index;

    private double logic1;

    private double logic2;

    private double logic3;

    private double logic4;

    private double score;

    private int alarm_count;

    private String description;

    private int health_logic_mst_rawid;


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



    private List<EqpHealthIndexPARAM> eqpHealthIndexInfo;


    public List<EqpHealthIndexPARAM> getEqpHealthIndexInfo() {
        return eqpHealthIndexInfo;
    }

    public void setEqpHealthIndexInfo(List<EqpHealthIndexPARAM> eqpHealthIndexInfo) {
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


}
