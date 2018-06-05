package com.bistel.a3.portal.domain.pdm;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class CauseAnalysisResult {
    private Long paramId;
    private Long measureTrxId;
    private List<String> causes = new ArrayList<>();
    private Date measure_dtts;

    public Long getParamId() {
        return paramId;
    }

    public void setParamId(Long paramId) {
        this.paramId = paramId;
    }

    public Long getMeasureTrxId() {
        return measureTrxId;
    }

    public void setMeasureTrxId(Long measureTrxId) {
        this.measureTrxId = measureTrxId;
    }

    public List<String> getCauses() {
        return causes;
    }

    public void addCause(String cause) {
        causes.add(cause);
    }

    public Date getMeasure_dtts() {
        return measure_dtts;
    }

    public void setMeasure_dtts(Date measure_dtts) {
        this.measure_dtts = measure_dtts;
    }

    @Override
    public String toString() {
        return causes.stream().collect(Collectors.joining(", "));
    }
}
