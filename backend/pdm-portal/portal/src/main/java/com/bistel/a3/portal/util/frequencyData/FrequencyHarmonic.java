package com.bistel.a3.portal.util.frequencyData;

public class FrequencyHarmonic {
    String name;
    double frequency;
    double amplitude;

    double amplitude_start;
    double amplitude_end;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getFrequency() {
        return frequency;
    }

    public void setFrequency(double frequency) {
        this.frequency = frequency;
    }

    public double getAmplitude() {
        return amplitude;
    }

    public void setAmplitude(double amplitude) {
        this.amplitude = amplitude;
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
}
