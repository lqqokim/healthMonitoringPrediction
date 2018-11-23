package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StatusGroupMaster {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("groupId")
    private String groupId;

    @JsonProperty("paramRawId")
    private Long paramRawId;

    @JsonProperty("useTimeoutYN")
    private String useTimeoutYN;

    @JsonProperty("timeoutMS")
    private Long timeoutMS;

    @JsonProperty("useYN")
    private String useYN;

    @JsonProperty("isStatusParam")
    private Boolean isStatusParam;

    @JsonProperty("runParamValue")
    private String runParamValue;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public Long getParamRawId() {
        return paramRawId;
    }

    public void setParamRawId(Long paramRawId) {
        this.paramRawId = paramRawId;
    }

    public String getUseTimeoutYN() {
        return useTimeoutYN;
    }

    public void setUseTimeoutYN(String useTimeoutYN) {
        this.useTimeoutYN = useTimeoutYN;
    }

    public Long getTimeoutMS() {
        return timeoutMS;
    }

    public void setTimeoutMS(Long timeoutMS) {
        this.timeoutMS = timeoutMS;
    }

    public String getUseYN() {
        return useYN;
    }

    public void setUseYN(String useYN) {
        this.useYN = useYN;
    }

    public Boolean getStatusParam() {
        return isStatusParam;
    }

    public void setStatusParam(Boolean statusParam) {
        isStatusParam = statusParam;
    }

    public String getRunParamValue() {
        return runParamValue;
    }

    public void setRunParamValue(String runParamValue) {
        this.runParamValue = runParamValue;
    }
}
