package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Part {
    @JsonProperty("partId")
    private Long part_id;
    private String name;
    @JsonProperty("eqpId")
    private Long eqp_id;
    @JsonProperty("partTypeId")
    private Integer part_type_id;
    @JsonProperty("speedParamId")
    private Long speed_param_id;
    private Double ratio;
    @JsonProperty("sortOrder")
    private Long sort_order;
    private Double npar1;
    private Double npar2;
    @JsonProperty("modelNumber")
    private String model_number;
    private String manufacture;

    private String base_ratio_yn;
    private String parts_type_cd;
    private String parts_type;
    private Long   bearing_id;
    private int   rpm;

    public int getRpm() {
        return rpm;
    }

    public void setRpm(int rpm) {
        this.rpm = rpm;
    }

    public Long getBearing_id() {
        return bearing_id;
    }

    public void setBearing_id(Long bearing_id) {
        this.bearing_id = bearing_id;
    }

    public String getBase_ratio_yn() {
        return base_ratio_yn;
    }

    public void setBase_ratio_yn(String base_ratio_yn) {
        this.base_ratio_yn = base_ratio_yn;
    }

    public String getParts_type_cd() {
        return parts_type_cd;
    }

    public void setParts_type_cd(String parts_type_cd) {

        this.parts_type_cd = parts_type_cd;
        if(parts_type_cd!=null && parts_type_cd.length()>0){
            try {
                this.part_type_id = Integer.valueOf(parts_type_cd);
            }catch(Exception err){

            }
        }

    }

    public String getParts_type() {
        return parts_type;
    }

    public void setParts_type(String parts_type) {
        this.parts_type = parts_type;
    }

    private String userName;

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getPart_id() {
        return part_id;
    }

    public void setPart_id(Long part_id) {
        this.part_id = part_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public Integer getPart_type_id() {
        return part_type_id;
    }

    public void setPart_type_id(Integer part_type_id) {
        this.part_type_id = part_type_id;
    }

    public Long getSpeed_param_id() {
        return speed_param_id;
    }

    public void setSpeed_param_id(Long speed_param_id) {
        this.speed_param_id = speed_param_id;
    }

    public Double getRatio() {
        return ratio;
    }

    public void setRatio(Double ratio) {
        this.ratio = ratio;
    }

    public Long getSort_order() {
        return sort_order;
    }

    public void setSort_order(Long sort_order) {
        this.sort_order = sort_order;
    }

    public Double getNpar1() {
        return npar1;
    }

    public void setNpar1(Double npar1) {
        this.npar1 = npar1;
    }

    public Double getNpar2() {
        return npar2;
    }

    public void setNpar2(Double npar2) {
        this.npar2 = npar2;
    }

    public String getModel_number() {
        return model_number;
    }

    public void setModel_number(String model_number) {
        this.model_number = model_number;
    }

    public String getManufacture() {
        return manufacture;
    }

    public void setManufacture(String manufacture) {
        this.manufacture = manufacture;
    }
}
