package com.bistel.a3.portal.domain.common;

import java.util.List;

public class FilterTraceRequest {
    private List<Long> eqpIds;
    private List<String> paramNames;
    private List<Long> paramIds;
    private List<FilterCriteriaData> filterCriteriaDatas;
    private FilterAggregation filterAggregation;


    public List<Long> getParamIds() {
        return paramIds;
    }

    public void setParamIds(List<Long> paramIds) {
        this.paramIds = paramIds;
    }

    public FilterAggregation getFilterAggregation() {
        return filterAggregation;
    }

    public void setFilterAggregation(FilterAggregation filterAggregation) {
        this.filterAggregation = filterAggregation;
    }

    public List<FilterCriteriaData> getFilterCriteriaDatas() {
        return filterCriteriaDatas;
    }

    public void setFilterCriteriaDatas(List<FilterCriteriaData> filterCriteriaDatas) {
        this.filterCriteriaDatas = filterCriteriaDatas;
    }

    public List<Long> getEqpIds() {
        return eqpIds;
    }

    public void setEqpIds(List<Long> eqpIds) {
        this.eqpIds = eqpIds;
    }

    public List<String> getParamNames() {
        return paramNames;
    }

    public void setParamNames(List<String> paramNames) {
        this.paramNames = paramNames;
    }

}
