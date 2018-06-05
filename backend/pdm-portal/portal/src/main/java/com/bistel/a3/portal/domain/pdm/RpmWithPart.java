package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RpmWithPart {
    @JsonProperty("paramId")
    private Long param_id;
    private String name;
    private Double rpm;
    private Map<Long, String> partNameMap = new HashMap<>();
    private Map<Long, Map<String, Double>> part1xMap = new HashMap<>();
    private Map<Long, String> partName = new HashMap<>();


    @JsonIgnore
    private Map<Long, Integer> partType = new HashMap<>();

    @JsonIgnore
    private Date measure_dtts;
    @JsonIgnore
    private Double mean;
    @JsonIgnore
    private Double stddev;
    @JsonIgnore
    private Double overall;

    @JsonIgnore
    private Map<Long, Map<String, Map<Double, Double>>> subNxPart = new HashMap<>();//part, partName, x, ys
    @JsonIgnore
    private Map<Long, Map<String, Map<Double, Double>>> nxPart = new HashMap<>();
    @JsonIgnore
    private boolean overThreshold;
    @JsonIgnore
    private boolean overAmplitude;
    @JsonIgnore
    private List<List<Double>> spectrum;
    @JsonIgnore
    private Double df;

    private Map<String,Double> partsNameRPMs = new HashMap<>();

    public Map<String, Double> getPartsNameRPMs() {
        return partsNameRPMs;
    }

    public void setPartsNameRPMs(Map<String, Double> partsNameRPMs) {
        this.partsNameRPMs = partsNameRPMs;
    }

    public Date getMeasure_dtts() {
        return measure_dtts;
    }

    public void setMeasure_dtts(Date measure_dtts) {
        this.measure_dtts = measure_dtts;
    }

    public Long getParam_id() {
        return param_id;
    }

    public void setParam_id(Long param_id) {
        this.param_id = param_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getMean() {
        return mean;
    }

    public void setMean(Double mean) {
        this.mean = mean;
    }

    public Double getStddev() {
        return stddev;
    }

    public void setStddev(Double stddev) {
        this.stddev = stddev;
    }

    public Double getOverall() {
        return overall;
    }

    public void setOverall(Double overall) {
        this.overall = overall;
    }

    public Double getRpm() {
        return rpm;
    }

    public void setRpm(Double rpm) {
        this.rpm = rpm;
    }

    public Map<Long, String> getPartName() {
        return partNameMap;
    }

    public Map<Long, Map<String, Double>> getPart1x() {
        return part1xMap;
    }

    public void addSubNxPart(Long partId, String alias, Map<Double, Double> subNx) {
        if(!subNxPart.containsKey(partId)) {
            subNxPart.put(partId, new HashMap<>());
        }
        subNxPart.get(partId).put(alias, subNx);
    }

    public void addNxPart(Long partId, String partName, String alias, Integer partTypeId, Map<Double, Double> nx) {
        if(!nxPart.containsKey(partId)) {
            nxPart.put(partId, new HashMap<>());
        }
        nxPart.get(partId).put(alias, nx);

        this.partName.put(partId, partName);
        partType.put(partId, partTypeId);

        if(!part1xMap.containsKey(partId)) {
            part1xMap.put(partId, new HashMap<>());
            partNameMap.put(partId, partName);
        }
        if(nx.size() > 0) {
            part1xMap.get(partId).put(alias, nx.keySet().iterator().next());
        } else {
            part1xMap.get(partId).put(alias, 0d);
        }
    }

    public Map<Long, Integer> getPartType() {
        return partType;
    }

    public Map<Long, Map<String, Map<Double, Double>>> getSubNxPart() {
        return subNxPart;
    }

    public Map<Long, Map<String, Map<Double, Double>>> getNxPart() {
        return nxPart;
    }

    public void setOverVibration(boolean overThreshold) {
        this.overThreshold = overThreshold;
    }

    public boolean isOverVibration() {
        return overThreshold;
    }

    public void setOverAmplitude(boolean overAmplitude) {
        this.overAmplitude = overAmplitude;
    }

    public boolean isOverAmplitude() {
        return overAmplitude;
    }

    public void setSpectrum(List<List<Double>> spectrum) {
        this.spectrum = spectrum;
    }

    public List<List<Double>> getSpectrum() {
        return spectrum;
    }

    public void setDf(Double df) {
        this.df = df;
    }

    public Double getDf() {
        return df;
    }
}
