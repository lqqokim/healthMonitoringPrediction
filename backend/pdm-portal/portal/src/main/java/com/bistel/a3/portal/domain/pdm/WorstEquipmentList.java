package com.bistel.a3.portal.domain.pdm;

import java.util.ArrayList;


public class WorstEquipmentList {

    private String eqp_name;
    private String eqp_rawid;
    private Double score;
    private Long area_rawid;
    private String area_name;

    public Long getArea_rawid() {
        return area_rawid;
    }

    public void setArea_rawid(Long area_rawid) {
        this.area_rawid = area_rawid;
    }

    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    private ArrayList<WorstEqupmentListChartData> datas = new ArrayList<>();

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public String getEqp_rawid() {
        return eqp_rawid;
    }

    public void setEqp_rawid(String eqp_rawid) {
        this.eqp_rawid = eqp_rawid;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public ArrayList<WorstEqupmentListChartData> getDatas() {
        return datas;
    }

    public void setDatas(ArrayList<WorstEqupmentListChartData> datas) {
        this.datas = datas;
    }
}
