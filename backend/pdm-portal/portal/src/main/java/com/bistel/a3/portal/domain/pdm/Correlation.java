package com.bistel.a3.portal.domain.pdm;


import java.util.List;

public class Correlation {

    private double[][] correlationInput;
    private double[][] correlationOutput;
    private List<Long> paramSeq;
    private List<String> paramNames;
    private Object correlationTrend;
    private List<List<Object>> correlationScatter;
    private Regression regression;

    public Regression getRegression() {
        return regression;
    }

    public void setRegression(Regression regression) {
        this.regression = regression;
    }

    public List<List<Object>> getCorrelationScatter() {
        return correlationScatter;
    }

    public void setCorrelationScatter(List<List<Object>> correlationScatter) {
        this.correlationScatter = correlationScatter;
    }

    public Object getCorrelationTrend() {
        return correlationTrend;
    }

    public void setCorrelationTrend(Object correlationTrend) {
        this.correlationTrend = correlationTrend;
    }

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
