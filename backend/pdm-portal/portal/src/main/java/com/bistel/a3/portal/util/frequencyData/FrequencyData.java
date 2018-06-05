package com.bistel.a3.portal.util.frequencyData;

public class FrequencyData {
    double samplingTime;
    int samplingCount;
    double[] timeWaveData;
    double[] frequencyData;
    double overall;

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

    public double[] getTimeWaveData() {
        return timeWaveData;
    }

    public void setTimeWaveData(double[] timeWaveData) {
        this.timeWaveData = timeWaveData;
    }

    public double[]getFrequencyData() {
        return frequencyData;
    }

    public void setFrequencyData(double[] frequencyData) {
        this.frequencyData = frequencyData;
    }

    public double getOverall() {
        return overall;
    }

    public void setOverall(double overall) {
        this.overall = overall;
    }
}
