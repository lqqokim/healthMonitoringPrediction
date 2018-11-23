package com.bistel.pdm.data.stream;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 */
public class ProcessGroupMaster {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("groupId")
    private String groupId;

    @JsonProperty("groupType")
    private String groupType;

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

    public String getGroupType() {
        return groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }

    public String getUseYN() {
        return useYN;
    }

    public void setUseYN(String useYN) {
        this.useYN = useYN;
    }
}
