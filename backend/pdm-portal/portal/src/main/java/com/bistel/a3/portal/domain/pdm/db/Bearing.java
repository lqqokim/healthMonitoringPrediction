package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Bearing {
    @JsonProperty("modelNumber")
    private String model_number;
    private String manufacture;
    private Double bpfo;
    private Double bpfi;
    private Double bsf;
    private Double ftf;
    private String description;
    private String userName;
    private Long   bearing_id;

    public Long getBearing_id() {
        return bearing_id;
    }

    public void setBearing_id(Long bearing_id) {
        this.bearing_id = bearing_id;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
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

    public Double getBpfo() {
        return bpfo;
    }

    public void setBpfo(Double bpfo) {
        this.bpfo = bpfo;
    }

    public Double getBpfi() {
        return bpfi;
    }

    public void setBpfi(Double bpfi) {
        this.bpfi = bpfi;
    }

    public Double getBsf() {
        return bsf;
    }

    public void setBsf(Double bsf) {
        this.bsf = bsf;
    }

    public Double getFtf() {
        return ftf;
    }

    public void setFtf(Double ftf) {
        this.ftf = ftf;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
