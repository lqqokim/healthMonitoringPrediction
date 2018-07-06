package com.bistel.a3.portal.domain.pdm;

public class AlarmClassification {


    private String fault_class;
    private int count;

    public String getFault_class() {
        return fault_class;
    }

    public void setFault_class(String fault_class) {
        this.fault_class = fault_class;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
