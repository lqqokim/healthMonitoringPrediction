package com.bistel.a3.portal.domain.pdm;

public class Regression {


    private double intercept;
    private double slope;
    private double r2;
    private double start_xValue;
    private double start_yValue;
    private double end_xValue;
    private double end_yValue;
    private boolean regressionPosibility;

    public boolean isRegressionPosibility() {
        return regressionPosibility;
    }

    public void setRegressionPosibility(boolean regressionPosibility) {
        this.regressionPosibility = regressionPosibility;
    }

    public double getIntercept() {
        return intercept;
    }

    public void setIntercept(double intercept) {
        this.intercept = intercept;
    }

    public double getSlope() {
        return slope;
    }

    public void setSlope(double slope) {
        this.slope = slope;
    }

    public double getR2() {
        return r2;
    }

    public void setR2(double r2) {
        this.r2 = r2;
    }

    public double getStart_xValue() {
        return start_xValue;
    }

    public void setStart_xValue(double start_xValue) {
        this.start_xValue = start_xValue;
    }

    public double getStart_yValue() {
        return start_yValue;
    }

    public void setStart_yValue(double start_yValue) {
        this.start_yValue = start_yValue;
    }

    public double getEnd_xValue() {
        return end_xValue;
    }

    public void setEnd_xValue(double end_xValue) {
        this.end_xValue = end_xValue;
    }

    public double getEnd_yValue() {
        return end_yValue;
    }

    public void setEnd_yValue(double end_yValue) {
        this.end_yValue = end_yValue;
    }
}
