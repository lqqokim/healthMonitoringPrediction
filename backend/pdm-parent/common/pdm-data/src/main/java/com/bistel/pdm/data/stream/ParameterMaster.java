package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ParameterMaster {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("eqpRawId")
    private Long eqpRawId;

    @JsonProperty("modelName")
    private String modelName;

    @JsonProperty("equipmentName")
    private String equipmentName;

    @JsonProperty("svid")
    private String svid;

    @JsonProperty("parameterName")
    private String parameterName;

    @JsonProperty("paramTypeCode")
    private String paramTypeCode;

    @JsonProperty("timewaveTypeCode")
    private String timewaveTypeCode;

    @JsonProperty("dataTypeCode")
    private String dataTypeCode;

    @JsonProperty("summaryYN")
    private String summaryYN;

    @JsonProperty("useYN")
    private String useYN;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEqpRawId() {
        return eqpRawId;
    }

    public void setEqpRawId(Long eqpRawId) {
        this.eqpRawId = eqpRawId;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getSvid() {
        return svid;
    }

    public void setSvid(String svid) {
        this.svid = svid;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getParamTypeCode() {
        return paramTypeCode;
    }

    public void setParamTypeCode(String paramTypeCode) {
        this.paramTypeCode = paramTypeCode;
    }

    public String getTimewaveTypeCode() {
        return timewaveTypeCode;
    }

    public void setTimewaveTypeCode(String timewaveTypeCode) {
        this.timewaveTypeCode = timewaveTypeCode;
    }

    public String getDataTypeCode() {
        return dataTypeCode;
    }

    public void setDataTypeCode(String dataTypeCode) {
        this.dataTypeCode = dataTypeCode;
    }

    public String getSummaryYN() {
        return summaryYN;
    }

    public void setSummaryYN(String summaryYN) {
        this.summaryYN = summaryYN;
    }

    public String getUseYN() {
        return useYN;
    }

    public void setUseYN(String useYN) {
        this.useYN = useYN;
    }
}
