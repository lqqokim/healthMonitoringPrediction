package com.bistel.a3.portal.domain.pdm;

import java.util.ArrayList;


public class WorstEquipmentList {

    private String eqp_name;
    private Long eqp_id;



    private Double score;
    private Long area_id;
    private String area_name;
    private ArrayList<WorstEqupmentListChartData> datas;




    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Long getArea_id() {
        return area_id;
    }

    public void setArea_id(Long area_id) {
        this.area_id = area_id;
    }

    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    public ArrayList<WorstEqupmentListChartData> getDatas() {
        return datas;
    }

    public void setDatas(ArrayList<WorstEqupmentListChartData> datas) {
        this.datas = datas;
    }
}
