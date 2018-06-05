package com.bistel.a3.portal.domain.frequencyData;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

import static com.bistel.a3.portal.util.frequencyData.FrequencyUtil.byteToDoubleArray;
import static com.bistel.a3.portal.util.frequencyData.FrequencyUtil.doubleToByteArray;


public class FrequencyDataGenDatas {
    private Long rawid;

    long eqpId;

    long paramId;

    Date create_dtts;

    byte[] timeWave;

    byte[] frequency;

    double[] dTimeWave;
    double[] dFrequency;

    double frequencyInterval;

    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
    }

    public Date getCreate_dtts() {
        return create_dtts;
    }

    public void setCreate_dtts(Date create_dtts) {
        this.create_dtts = create_dtts;
    }

    public byte[] getTimeWave() {
        return timeWave;
    }

    public void setTimeWave(byte[] timeWave) {

        this.timeWave = timeWave;
        this.dTimeWave = byteToDoubleArray(this.timeWave);
    }

    public byte[] getFrequency() {
        return frequency;
    }

    public void setFrequency(byte[] frequency) {

        this.frequency = frequency;
        this.dFrequency = byteToDoubleArray(this.frequency);
    }

    public double getFrequencyInterval() {
        return frequencyInterval;
    }

    public void setFrequencyInterval(double frequencyInterval) {
        this.frequencyInterval = frequencyInterval;
    }

    public long getEqpId() {
        return eqpId;
    }

    public void setEqpId(long eqpId) {
        this.eqpId = eqpId;
    }

    public long getParamId() {
        return paramId;
    }

    public void setParamId(long paramId) {
        this.paramId = paramId;
    }

    public double[] getdTimeWave() {
        return dTimeWave;
    }

    public void setdTimeWave(double[] dTimeWave) {
        this.dTimeWave = dTimeWave;
        this.timeWave = doubleToByteArray(dTimeWave);
    }

    public double[] getdFrequency() {
        return dFrequency;
    }

    public void setdFrequency(double[] dFrequency) {
        this.dFrequency = dFrequency;
        this.frequency = doubleToByteArray(dFrequency);
    }
    private static String encodeLocation(double[] doubleArray){
        byte[] bytes = doubleToByteArray(doubleArray);
        String base64Encoded = new String(bytes, StandardCharsets.UTF_8);
        return base64Encoded;
    }

    private static double[] decodeLocation(String base64Encoded){
//        byte[] bytes = Base64.getEncoder().encode(base64Encoded.getBytes());
        byte[] bytes = base64Encoded.getBytes();
        double[] doubleArray = byteToDoubleArray(bytes);
        return doubleArray;
    }


}