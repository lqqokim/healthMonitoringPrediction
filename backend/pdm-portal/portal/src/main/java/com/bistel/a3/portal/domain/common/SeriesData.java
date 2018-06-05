package com.bistel.a3.portal.domain.common;

import com.bistel.a3.portal.domain.pdm.BasicData;

import java.util.ArrayList;
import java.util.List;

public class SeriesData {
    private String name;
    private Double target;
    private Double upper;
    private Double lower;
    private List<Object[]> data = new ArrayList<>();

    public SeriesData(String name) {
        this.name = name;
    }

    public Double getTarget() {
        return target;
    }

    public void setTarget(Double target) {
        this.target = target;
    }

    public Double getUpper() {
        return upper;
    }

    public void setUpper(Double upper) {
        this.upper = upper;
    }

    public Double getLower() {
        return lower;
    }

    public void setLower(Double lower) {
        this.lower = lower;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Object[]> getData() {
        return data;
    }

    public void addData(List<BasicData> data) {
        for(BasicData d : data) {
            this.data.add(new Object[] { d.getX(), d.getY() });
        }
    }
}
