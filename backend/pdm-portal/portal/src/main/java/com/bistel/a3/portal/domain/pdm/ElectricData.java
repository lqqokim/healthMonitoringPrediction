package com.bistel.a3.portal.domain.pdm;

import java.util.Date;

public class ElectricData {
    private Date datasavedtime;
    private Integer millisecond;
    private Double data;

    public Date getDatasavedtime() {
        return datasavedtime;
    }

    public void setDatasavedtime(Date datasavedtime) {
        this.datasavedtime = datasavedtime;
    }

    public Integer getMillisecond() {
        return millisecond;
    }

    public void setMillisecond(Integer millisecond) {
        this.millisecond = millisecond;
    }

    public Double getData() {
        return data;
    }

    public void setData(Double data) {
        this.data = data;
    }
}
