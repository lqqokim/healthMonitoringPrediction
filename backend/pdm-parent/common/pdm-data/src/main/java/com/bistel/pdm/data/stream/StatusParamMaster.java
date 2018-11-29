package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StatusParamMaster {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("paramRawId")
    private Long paramRawId;

    @JsonProperty("svid")
    private String svid;

    @JsonProperty("value")
    private String value;

    @JsonProperty("status")
    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParamRawId() {
        return paramRawId;
    }

    public void setParamRawId(Long paramRawId) {
        this.paramRawId = paramRawId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSvid() {
        return svid;
    }

    public void setSvid(String svid) {
        this.svid = svid;
    }
}
