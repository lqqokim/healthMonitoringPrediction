package com.bistel.a3.portal.domain.common;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by yohan on 15. 11. 17.
 */
public class Code {

    private Long codeId;

    //@JsonProperty("code")
    private String code;
    //@JsonProperty("name")
    private String name;
    //@JsonProperty("codeOrder")
    private Integer codeOrder;
    //@JsonProperty("defaultCode")
    private Boolean defaultCode;
    //@JsonProperty("used")
    private Boolean used;
    //@JsonProperty("description")
    private String description;
    @JsonProperty("codeCategoryId")
    private Long codeCategoryId;
    private String userName;

    private String category;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }


    public Long getCodeId() {
        return codeId;
    }

    public void setCodeId(Long codeId) {
        this.codeId = codeId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCodeOrder() {
        return codeOrder;
    }

    public void setCodeOrder(Integer codeOrder) {
        this.codeOrder = codeOrder;
    }

    public Boolean getDefault() {
        return defaultCode;
    }

    public void setDefault(Boolean defaultCode) {
        this.defaultCode = defaultCode;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    //@JsonIgnore
    public Long getCodeCategoryId() {
        return codeCategoryId;
    }

    public void setCodeCategoryId(Long codeCategoryId) {
        this.codeCategoryId = codeCategoryId;
    }
}
