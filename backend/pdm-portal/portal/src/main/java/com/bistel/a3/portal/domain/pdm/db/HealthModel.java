package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class HealthModel {
    @JsonProperty("eqpId")
    private Long eqp_id;
    @JsonProperty("modelObj")
    private String model_obj;
    @JsonProperty("pca_modelObj")
    private String pca_model_obj;
    @JsonProperty("modelParams")
    private String model_params;
    @JsonProperty("startDtts")
    private Date start_dtts;
    @JsonProperty("endDtts")
    private Date end_dtts;
    @JsonProperty("createUserId")
    private String create_user_id;
    private String description;
    private Double target;
    @JsonProperty("createTypeCd")
    private String create_type_cd;
    @JsonProperty("createDtts")
    private Date create_dtts;
    @JsonProperty("alarmSpec")
    private Double alarm_spec;
    @JsonProperty("warnSpec")
    private Double warn_spec;

    public String getModel_params() {
        return model_params;
    }

    public void setModel_params(String model_params) {
        this.model_params = model_params;
    }

    public Long getEqp_id() {
        return eqp_id;
    }

    public void setEqp_id(Long eqp_id) {
        this.eqp_id = eqp_id;
    }

    public String getModel_obj() {
        return model_obj;
    }

    public String getPca_model_obj() {
        return pca_model_obj;
    }

    public void setModel_obj(String model_obj) {
        this.model_obj = model_obj;
    }

    public void setPca_model_obj(String pca_model_obj) {
        this.pca_model_obj = pca_model_obj;
    }

    public Date getStart_dtts() {
        return start_dtts;
    }

    public void setStart_dtts(Date start_dtts) {
        this.start_dtts = start_dtts;
    }

    public Date getEnd_dtts() {
        return end_dtts;
    }

    public void setEnd_dtts(Date end_dtts) {
        this.end_dtts = end_dtts;
    }

    public String getCreate_user_id() {
        return create_user_id;
    }

    public void setCreate_user_id(String create_user_id) {
        this.create_user_id = create_user_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getTarget() {
        return target;
    }

    public void setTarget(Double target) {
        this.target = target;
    }

    public String getCreate_type_cd() {
        return create_type_cd;
    }

    public void setCreate_type_cd(String create_type_cd) {
        this.create_type_cd = create_type_cd;
    }

    public Date getCreate_dtts() {
        return create_dtts;
    }

    public void setCreate_dtts(Date create_dtts) {
        this.create_dtts = create_dtts;
    }

    public Double getAlarm_spec() {
        return alarm_spec;
    }

    public void setAlarm_spec(Double alarm_spec) {
        this.alarm_spec = alarm_spec;
    }

    public Double getWarn_spec() {
        return warn_spec;
    }

    public void setWarn_spec(Double warn_spec) {
        this.warn_spec = warn_spec;
    }

//    public String getModel_String() {
//        Base64.Decoder decoder = Base64.getDecoder();
//        byte[] decodeBytes = decoder.decode(this.model_obj);
//        try {
//            String decodeString = new String(decodeBytes, "UTF8");
//            return decodeString;
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//            return "";
//        }
//
//    }
//    public static String getModel_StringByEncodeData(String encodeData) {
//        Base64.Decoder decoder = Base64.getDecoder();
//        byte[] decodeBytes = decoder.decode(encodeData);
//        try {
//            String decodeString = new String(decodeBytes, "UTF8");
//            return decodeString;
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//            return "";
//        }
//
//    }

}
