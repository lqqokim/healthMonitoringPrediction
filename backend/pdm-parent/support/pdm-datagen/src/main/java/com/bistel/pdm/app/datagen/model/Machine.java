package com.bistel.pdm.app.datagen.model;

import java.util.ArrayList;
import java.util.List;

public class Machine {

    private final String fab = "fab1";
    private final String area;
    private final String eqpName;
    private String filePath;

    private final String dataTypeCode;
    private final int maxFrequency = 100;
    private final int frequencyCount = 10;
    private final int rpm = 3000;

    private final List<String> parameters = new ArrayList<>();

    public Machine(String area, String eqpName, String filePath, String type){
        this. area = area;
        this.eqpName = eqpName;
        this.filePath = filePath;
        this.dataTypeCode = type;

        this.parameters.add("velocity");
        this.parameters.add("acceleration");
        this.parameters.add("enveloping");
        //this.parameters.add("temperature");
        //this.parameters.add("pressure");
    }

    public String getFab() {
        return fab;
    }

    public String getArea() {
        return area;
    }

    public String getEqpName() {
        return eqpName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public List<String> getParameters() {
        return parameters;
    }

    public String getDataTypeCode() {
        return dataTypeCode;
    }

    public int getMaxFrequency() {
        return maxFrequency;
    }

    public int getFrequencyCount() {
        return frequencyCount;
    }

    public int getRpm() {
        return rpm;
    }

    public String metaString(){
        return fab + "," + area + "," + eqpName;
    }
}
