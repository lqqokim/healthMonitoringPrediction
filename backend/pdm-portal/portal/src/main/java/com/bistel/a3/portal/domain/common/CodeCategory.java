package com.bistel.a3.portal.domain.common;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by yohan on 15. 11. 17.
 */
public class CodeCategory {
    @JsonProperty("codeCategoryId")
    private Long codeCategoryId;
    @JsonProperty("appId")
    private Long appId;
    @JsonProperty("name")
    private String name;

    public Long getCodeCategoryId() {
        return codeCategoryId;
    }

    public void setCodeCategoryId(Long codeCategoryId) {
        this.codeCategoryId = codeCategoryId;
    }

    public Long getAppId() {
        return appId;
    }

    public void setAppId(Long appId) {
        this.appId = appId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
