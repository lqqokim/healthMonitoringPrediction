package com.bistel.pdm.api.producer;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 *
 */
public class SensorDataRecord implements Serializable{

    String areaName;
    String equipmentName;
    String parameterName;
    String dataTypeCode;
    String frequecnyValue;
    String timeWaveValue;
    int maxFrequency;
    int frequencyCount;
    int rpm;
    float samplingTime;
    float rmsValue;
    Timestamp eventTime;

    String rsd01;
    String rsd02;
    String rsd03;
    String rsd04;
    String rsd05;

    public String toPartitionKey() {
        return areaName + "," + equipmentName;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getDataTypeCode() {
        return dataTypeCode;
    }

    public void setDataTypeCode(String dataTypeCode) {
        this.dataTypeCode = dataTypeCode;
    }

    public int getMaxFrequency() {
        return maxFrequency;
    }

    public void setMaxFrequency(int maxFrequency) {
        this.maxFrequency = maxFrequency;
    }

    public int getFrequencyCount() {
        return frequencyCount;
    }

    public void setFrequencyCount(int frequencyCount) {
        this.frequencyCount = frequencyCount;
    }

    public int getRpm() {
        return rpm;
    }

    public void setRpm(int rpm) {
        this.rpm = rpm;
    }

    public Timestamp getEventTime() {
        return eventTime;
    }

    public void setEventTime(Timestamp eventTime) {
        this.eventTime = eventTime;
    }

    public float getRmsValue() {
        return rmsValue;
    }

    public void setRmsValue(float rmsValue) {
        this.rmsValue = rmsValue;
    }

    public float getSamplingTime() {
        return samplingTime;
    }

    public void setSamplingTime(float samplingTime) {
        this.samplingTime = samplingTime;
    }

    public String getFrequecnyValue() {
        return frequecnyValue;
    }

    public void setFrequecnyValue(String frequecnyValue) {
        this.frequecnyValue = frequecnyValue;
    }

    public String getTimeWaveValue() {
        return timeWaveValue;
    }

    public void setTimeWaveValue(String timeWaveValue) {
        this.timeWaveValue = timeWaveValue;
    }

    public String getRsd01() {
        return rsd01;
    }

    public void setRsd01(String rsd01) {
        this.rsd01 = rsd01;
    }

    public String getRsd02() {
        return rsd02;
    }

    public void setRsd02(String rsd02) {
        this.rsd02 = rsd02;
    }

    public String getRsd03() {
        return rsd03;
    }

    public void setRsd03(String rsd03) {
        this.rsd03 = rsd03;
    }

    public String getRsd04() {
        return rsd04;
    }

    public void setRsd04(String rsd04) {
        this.rsd04 = rsd04;
    }

    public String getRsd05() {
        return rsd05;
    }

    public void setRsd05(String rsd05) {
        this.rsd05 = rsd05;
    }
}
