package com.bistel.a3.portal.domain.frequencyData;


public class FrequencyDataGenHarmonicConfig {

    private Long rawid;

    Long frequency_data_config_rawid;

    String harmonicName;

    double harmonicFrequency;


    double amplitude_start;

    double amplitude_end;

    double amplitude_current;

    public Long getRawid() {
        return rawid;
    }

    public void setRawid(Long rawid) {
        this.rawid = rawid;
    }

    public Long getFrequency_data_config_rawid() {
        return frequency_data_config_rawid;
    }

    public void setFrequency_data_config_rawid(Long frequency_data_config_rawid) {
        this.frequency_data_config_rawid = frequency_data_config_rawid;
    }

    public String getHarmonicName() {
        return harmonicName;
    }

    public void setHarmonicName(String harmonicName) {
        this.harmonicName = harmonicName;
    }

    public double getHarmonicFrequency() {
        return harmonicFrequency;
    }

    public void setHarmonicFrequency(double harmonicFrequency) {
        this.harmonicFrequency = harmonicFrequency;
    }

    public double getAmplitude_start() {
        return amplitude_start;
    }

    public void setAmplitude_start(double amplitude_start) {
        this.amplitude_start = amplitude_start;
    }

    public double getAmplitude_end() {
        return amplitude_end;
    }

    public void setAmplitude_end(double amplitude_end) {
        this.amplitude_end = amplitude_end;
    }

    public double getAmplitude_current() {
        return amplitude_current;
    }

    public void setAmplitude_current(double amplitude_current) {
        this.amplitude_current = amplitude_current;
    }
}
