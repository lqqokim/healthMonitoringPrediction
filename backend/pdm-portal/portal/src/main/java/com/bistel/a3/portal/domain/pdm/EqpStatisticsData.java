package com.bistel.a3.portal.domain.pdm;

import java.util.Date;
import java.util.List;

public class EqpStatisticsData {

    private double previous_avg;
    private double period_avg;
    private double sigma;
    private Date previous_date;
    private List<List<Object>> eqpHealthTrendData;


    public Date getPrevious_date() {
        return previous_date;
    }

    public void setPrevious_date(Date previous_date) {
        this.previous_date = previous_date;
    }

    public List<List<Object>> getEqpHealthTrendData() {
        return eqpHealthTrendData;
    }

    public void setEqpHealthTrendData(List<List<Object>> eqpHealthTrendData) {
        this.eqpHealthTrendData = eqpHealthTrendData;
    }

    public double getPrevious_avg() {
        return previous_avg;
    }

    public void setPrevious_avg(double previous_avg) {
        this.previous_avg = previous_avg;
    }

    public double getPeriod_avg() {
        return period_avg;
    }

    public void setPeriod_avg(double period_avg) {
        this.period_avg = period_avg;
    }

    public double getSigma() {
        return sigma;
    }

    public void setSigma(double sigma) {
        this.sigma = sigma;
    }
}