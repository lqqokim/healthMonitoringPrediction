package com.bistel.pdm.common.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class FeatureDataSet {

    @JsonProperty("paramRawId")
    private Long paramRawId;

    @JsonProperty("featureRawId")
    private Long featureRawId;

    @JsonProperty("paramName")
    private String paramName;

    @JsonProperty("featureName")
    private String featureName;

    @JsonProperty("mainYN")
    private String mainYN;

    @JsonProperty("aggregateYN")
    private String aggregateYN;

    public Long getParamRawId() {
        return paramRawId;
    }

    public void setParamRawId(Long paramRawId) {
        this.paramRawId = paramRawId;
    }

    public Long getFeatureRawId() {
        return featureRawId;
    }

    public void setFeatureRawId(Long featureRawId) {
        this.featureRawId = featureRawId;
    }

    public String getParamName() {
        return paramName;
    }

    public void setParamName(String paramName) {
        this.paramName = paramName;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public String getMainYN() {
        return mainYN;
    }

    public void setMainYN(String mainYN) {
        this.mainYN = mainYN;
    }

    public String getAggregateYN() {
        return aggregateYN;
    }

    public void setAggregateYN(String aggregateYN) {
        this.aggregateYN = aggregateYN;
    }
}