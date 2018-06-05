package com.bistel.a3.portal.domain.pdm.std.master;

import com.fasterxml.jackson.annotation.JsonProperty;

public class STDBearing {
    private Long rawid;
    private String model_number;
    private String manufacture;
    private Double BPFO;
    private Double BPFI;
    private Double BSF;
    private Double FTF;
    private String description;
    private String user_name;

    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
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

    public Double getBPFO() {
        return BPFO;
    }

    public void setBPFO(Double BPFO) {
        this.BPFO = BPFO;
    }

    public Double getBPFI() {
        return BPFI;
    }

    public void setBPFI(Double BPFI) {
        this.BPFI = BPFI;
    }

    public Double getBSF() {
        return BSF;
    }

    public void setBSF(Double BSF) {
        this.BSF = BSF;
    }

    public Double getFTF() {
        return FTF;
    }

    public void setFTF(Double FTF) {
        this.FTF = FTF;
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
