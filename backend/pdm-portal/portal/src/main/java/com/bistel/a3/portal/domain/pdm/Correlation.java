package com.bistel.a3.portal.domain.pdm;


import java.util.List;

public class Correlation {

    private double[][] correlationInput;
    private double[][] correlationOutput;
    private List<Long> paramSeq;
    private List<String> paramNames;

    public double[][] getCorrelationInput() {
        return correlationInput;
    }

    public void setCorrelationInput(double[][] correlationOutput) {
        this.correlationInput = correlationOutput;
    }

    public List<Long> getParamSeq() {
        return paramSeq;
    }

    public void setParamSeq(List<Long> paramSeq) {
        this.paramSeq = paramSeq;
    }

    public double[][] getCorrelationOutput() {
        return correlationOutput;
    }

    public void setCorrelationOutput(double[][] correlationOutput) {
        this.correlationOutput = correlationOutput;
    }

    public List<String> getParamNames() {
        return paramNames;
    }

    public void setParamNames(List<String> paramNames) {
        this.paramNames = paramNames;
    }
}
