package com.bistel.a3.portal.domain.pdm;

public class AlarmClassification {

    private Long area_rawid;
    private String area_name;
    private int total;
    private int unbalance;
    private int misalignment;
    private int bearing;
    private int lublication;
    private int etc;


    public Long getArea_rawid() {
        return area_rawid;
    }

    public void setArea_rawid(Long area_rawid) {
        this.area_rawid = area_rawid;
    }

    public String getArea_name() {
        return area_name;
    }

    public void setArea_name(String area_name) {
        this.area_name = area_name;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getUnbalance() {
        return unbalance;
    }

    public void setUnbalance(int unbalance) {
        this.unbalance = unbalance;
    }

    public int getMisalignment() {
        return misalignment;
    }

    public void setMisalignment(int misalignment) {
        this.misalignment = misalignment;
    }

    public int getBearing() {
        return bearing;
    }

    public void setBearing(int bearing) {
        this.bearing = bearing;
    }

    public int getLublication() {
        return lublication;
    }

    public void setLublication(int lublication) {
        this.lublication = lublication;
    }

    public int getEtc() {
        return etc;
    }

    public void setEtc(int etc) {
        this.etc = etc;
    }


}
