package com.bistel.a3.portal.domain.pdm.std.master;

import com.fasterxml.jackson.annotation.JsonProperty;

public class STDEqp {
    private Long rawid;
    private Long area_mst_rawid;
    private String name;
    private String description;
    private String data_type_cd;
    private byte[] image;
    private String user_name;
    private String area_name;
    private String data_type_name;

    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    public String getData_type_name() {
        return data_type_name;
    }

    public void setData_type_name(String data_type_name) {
        this.data_type_name = data_type_name;
    }

    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
    }

    public Long getArea_mst_rawid() {
        return area_mst_rawid;
    }

    public void setArea_mst_rawid(Long area_mst_rawid) {
        this.area_mst_rawid = area_mst_rawid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getData_type_cd() {
        return data_type_cd;
    }

    public void setData_type_cd(String data_type_cd) {
        this.data_type_cd = data_type_cd;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
}
