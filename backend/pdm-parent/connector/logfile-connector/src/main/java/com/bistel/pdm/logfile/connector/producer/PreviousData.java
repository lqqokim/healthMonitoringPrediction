package com.bistel.pdm.logfile.connector.producer;

public class PreviousData {

    private String time;
    private Double value;

    public PreviousData(String time, Double value){
        this.time = time;
        this.value = value;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }
}
