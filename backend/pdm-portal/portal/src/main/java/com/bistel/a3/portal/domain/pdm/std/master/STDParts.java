package com.bistel.a3.portal.domain.pdm.std.master;

import com.fasterxml.jackson.annotation.JsonProperty;

public class STDParts {
    private Long rawid;
    private Long eqp_mst_rawid;
    private Long bearing_mst_rawid;
    private String name;
    private String parts_type_cd;
    private Double ratio;
    private String base_ratio_yn;
    private String user_name;
    private String eqp_name;
    private String bearing_name;
    private String parts_type_name;

    public String getBase_ratio_yn() {
        return base_ratio_yn;
    }

    public void setBase_ratio_yn(String base_ratio_yn) {
        this.base_ratio_yn = base_ratio_yn;
    }

    public String getEqp_name() {
        return eqp_name;
    }

    public void setEqp_name(String eqp_name) {
        this.eqp_name = eqp_name;
    }

    public String getBearing_name() {
        return bearing_name;
    }

    public void setBearing_name(String bearing_name) {
        this.bearing_name = bearing_name;
    }

    public String getParts_type_name() {
        return parts_type_name;
    }

    public void setParts_type_name(String parts_type_name) {
        this.parts_type_name = parts_type_name;
    }

    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
    }

    public Long getEqp_mst_rawid() {
        return eqp_mst_rawid;
    }

    public void setEqp_mst_rawid(Long eqp_mst_rawid) {
        this.eqp_mst_rawid = eqp_mst_rawid;
    }

    public Long getBearing_mst_rawid() {
        return bearing_mst_rawid;
    }

    public void setBearing_mst_rawid(Long bearing_mst_rawid) {
        this.bearing_mst_rawid = bearing_mst_rawid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParts_type_cd() {
        return parts_type_cd;
    }

    public void setParts_type_cd(String parts_type_cd) {
        this.parts_type_cd = parts_type_cd;
    }

    public Double getRatio() {
        return ratio;
    }

    public void setRatio(Double ratio) {
        this.ratio = ratio;
    }


    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
}
