package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Base64;

public class Eqp {


    @JsonProperty("eqpId")
    private Long eqp_id;
    @JsonProperty("eqpName")
    private String name;
    private String description;
    @JsonProperty("areaId")
    private Long area_id;
    @JsonProperty("sortOrder")
    private Long sort_order;
    @JsonProperty("dataType")
    private String data_type;
    @JsonProperty("dataTypeCd")
    private String data_type_cd;
    private String userName;
    private String offline_yn;
    private String model_name;
    private String areaEqp_name;
    private String area_name;

    public String getAreaEqp_name() {
        return this.area_name+"_"+this.name;
    }

    public void setAreaEqp_name(String areaEqp_name) {
        this.areaEqp_name = areaEqp_name;
    }



    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    public String getModel_name() {
        return model_name;
    }

    public void setModel_name(String model_name) {
        this.model_name = model_name;
    }

    public String getOffline_yn() {
        return offline_yn;
    }

    public void setOffline_yn(String offline_yn) {
        this.offline_yn = offline_yn;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }


    public Long getSort_order() {
        return sort_order;
    }

    public void setSort_order(Long sort_order) {
        this.sort_order = sort_order;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
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

    public Long getArea_id() {
        return area_id;
    }

    public void setArea_id(Long area_id) {
        this.area_id = area_id;
    }

    public String getData_type() {
        return data_type;
    }

    public void setData_type(String data_type) {
        this.data_type = data_type;
    }

    public String getData_type_cd() {
        return data_type_cd;
    }

    public void setData_type_cd(String data_type_cd) {
        this.data_type_cd = data_type_cd;
    }


    private String image;

    @JsonIgnore
    private byte[] binary;

    public String getImage() {
        return image;
    }

    public void setImage(String image) {

        if(image==null)
        {
            this.image=null;
        }
        else
        {
            this.image = image;
            this.binary = Base64.getDecoder().decode(image);
        }

    }

    public byte[] getBinary() {
        return binary;
    }

    public void setBinary(byte[] binary) {
        this.binary = binary;
        this.image = Base64.getEncoder().encodeToString(binary);
    }

}
