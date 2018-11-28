package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ParamConditionGroupMaster {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("groupId")
    private String groupId;

    @JsonProperty("paramRawId")
    private Long paramRawId;

    @JsonProperty("svid")
    private String svid;

    @JsonProperty("condition")
    private String condition;

    @JsonProperty("useTimeoutYN")
    private String useTimeoutYN;

    @JsonProperty("timeoutMS")
    private Long timeoutMS;

    @JsonProperty("useYN")
    private String useYN;

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

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
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

    public String getSvid() {
        return svid;
    }

    public void setSvid(String svid) {
        this.svid = svid;
    }
}
