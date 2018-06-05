package com.bistel.a3.portal.domain.pdm.std.master;

import java.util.Date;

public class STDCode {
    //private Long rawid;
    private Long rawId;
    private String category;
    private String code;
    private String name;
    private Boolean used_yn;
//    private String Default_yn;
    private Boolean default_yn;
    private Integer ordering;
    private String description;
    private String user_name;

    private String create_by;
    private Date create_dtts;
    private String update_by;
    private Date update_dtts;

    public Long getRawId() {
        return rawId;
    }

    public void setRawId(Long rawId) {
        this.rawId = rawId;
    }

    public Boolean getDefault_yn() {
        return default_yn;
    }

    public void setDefault_yn(Boolean default_yn) {
        this.default_yn = default_yn;
    }

    public String getCreate_by() {
        return create_by;
    }

    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    public Date getCreate_dtts() {
        return create_dtts;
    }

    public void setCreate_dtts(Date create_dtts) {
        this.create_dtts = create_dtts;
    }

    public String getUpdate_by() {
        return update_by;
    }

    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    public Date getUpdate_dtts() {
        return update_dtts;
    }

    public void setUpdate_dtts(Date update_dtts) {
        this.update_dtts = update_dtts;
    }




//    public Long getRawid() {
//        return rawid;
//    }
//
//    public void setRawid(Long rawid) {
//        this.rawid = rawid;
//    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public Boolean getUsed_yn() {
        return used_yn;
    }

    public void setUsed_yn(Boolean used_yn) {
        this.used_yn = used_yn;
    }



    public Integer getOrdering() {
        return ordering;
    }

    public void setOrdering(Integer ordering) {
        this.ordering = ordering;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
}
