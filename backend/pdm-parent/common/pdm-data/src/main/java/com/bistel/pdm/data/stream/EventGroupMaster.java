package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EventGroupMaster {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("groupId")
    private String groupId;

    @JsonProperty("startEventId")
    private String startEventId;

    @JsonProperty("endEventId")
    private String endEventId;

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

    public String getStartEventId() {
        return startEventId;
    }

    public void setStartEventId(String startEventId) {
        this.startEventId = startEventId;
    }

    public String getEndEventId() {
        return endEventId;
    }

    public void setEndEventId(String endEventId) {
        this.endEventId = endEventId;
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
}
