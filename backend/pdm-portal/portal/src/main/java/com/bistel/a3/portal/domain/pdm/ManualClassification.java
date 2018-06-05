package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.enums.EuType;

import java.util.List;

public class ManualClassification {
    private EuType type;
    private Double rpm;
    private Double ratio;
    private Long endFreq;
    private Long spectraLines;
    private Double bpfo;
    private Double bpfi;
    private Double vibrationT;
    private Double envelopingT;
    private List<List<Double>> spectrum;

    public EuType getType() {
        return type;
    }

    public void setType(EuType type) {
        this.type = type;
    }

    public Double getRpm() {
        return rpm;
    }

    public void setRpm(Double rpm) {
        this.rpm = rpm;
    }

    public Double getRatio() {
        return ratio;
    }

    public void setRatio(Double ratio) {
        this.ratio = ratio;
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

    public Double getVibrationT() {
        return vibrationT;
    }

    public void setVibrationT(Double vibrationT) {
        this.vibrationT = vibrationT;
    }

    public Double getEnvelopingT() {
        return envelopingT;
    }

    public void setEnvelopingT(Double envelopingT) {
        this.envelopingT = envelopingT;
    }

    public Long getEndFreq() {
        return endFreq;
    }

    public void setEndFreq(Long endFreq) {
        this.endFreq = endFreq;
    }

    public Long getSpectraLines() {
        return spectraLines;
    }

    public void setSpectraLines(Long spectraLines) {
        this.spectraLines = spectraLines;
    }

    public List<List<Double>> getSpectrum() {
        return spectrum;
    }

    public void setSpectrum(List<List<Double>> spectrum) {
        this.spectrum = spectrum;
    }
}
