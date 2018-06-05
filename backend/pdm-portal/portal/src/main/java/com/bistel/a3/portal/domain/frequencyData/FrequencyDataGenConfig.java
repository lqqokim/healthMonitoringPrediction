package com.bistel.a3.portal.domain.frequencyData;

import java.util.Date;


public class FrequencyDataGenConfig {
    private Long rawid;

    private Long eqpId;

    private Long paramId;

    double samplingTime;

    int samplingCount;

    long duration;//minutes

    Date create_dtts;

    Date modify_dtts;

    long rpm;



    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
    }

    public Long getEqpId() {
        return eqpId;
    }

    public void setEqpId(Long eqpId) {
        this.eqpId = eqpId;
    }

    public long getParamId() {
        return paramId;
    }

    public void setParamId(Long paramId) {
        this.paramId = paramId;
    }


    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public double getSamplingTime() {
        return samplingTime;
    }

    public void setSamplingTime(double samplingTime) {
        this.samplingTime = samplingTime;
    }

    public int getSamplingCount() {
        return samplingCount;
    }

    public void setSamplingCount(int samplingCount) {
        this.samplingCount = samplingCount;
    }

    public Date getCreate_dtts() {
        return create_dtts;
    }

    public void setCreate_dtts(Date create_dtts) {
        this.create_dtts = create_dtts;
    }

    public Date getModify_dtts() {
        return modify_dtts;
    }

    public void setModify_dtts(Date modify_dtts) {
        this.modify_dtts = modify_dtts;
    }

    public long getRpm() {
        return rpm;
    }

    public void setRpm(long rpm) {
        this.rpm = rpm;
    }
}
