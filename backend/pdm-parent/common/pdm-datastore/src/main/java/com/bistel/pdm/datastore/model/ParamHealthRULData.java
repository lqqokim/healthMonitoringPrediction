package com.bistel.pdm.datastore.model;

public class ParamHealthRULData {
    private Long time;
    private Long paramHealthTrxRawId;
    private Double intercept;
    private Double slope;
    private Double x;

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public Long getParamHealthTrxRawId() {
        return paramHealthTrxRawId;
    }

    public void setParamHealthTrxRawId(Long paramHealthTrxRawId) {
        this.paramHealthTrxRawId = paramHealthTrxRawId;
    }

    public Double getIntercept() {
        return intercept;
    }

    public void setIntercept(Double intercept) {
        this.intercept = intercept;
    }

    public Double getSlope() {
        return slope;
    }

    public void setSlope(Double slope) {
        this.slope = slope;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }
}
