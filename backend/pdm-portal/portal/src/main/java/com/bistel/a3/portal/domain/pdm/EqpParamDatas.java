package com.bistel.a3.portal.domain.pdm;

import java.util.ArrayList;
import java.util.List;

public class EqpParamDatas {
    String eqpName;
    String paramName;
    List<List<Double>> timesValue = new ArrayList<>();

    public String getEqpName() {
        return eqpName;
    }

    public void setEqpName(String eqpName) {
        this.eqpName = eqpName;
    }

    public String getParamName() {
        return paramName;
    }

    public void setParamName(String paramName) {
        this.paramName = paramName;
    }

    public List<List<Double>> getTimesValue() {
        return timesValue;
    }

    public void setTimesValue(List<List<Double>> timesValue) {
        this.timesValue = timesValue;
    }
}
