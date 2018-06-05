package com.bistel.a3.portal.util.pdm;

import java.util.ArrayList;
import java.util.List;

public class OutlierResult {
    private List<Integer> outlierIndices;
    private List<Double> nonOutliers;
    private double lowerBound;
    private double upperBound;
    private double sigma;
    private double median;

    public OutlierResult() {
        this.outlierIndices = new ArrayList();
        this.nonOutliers = new ArrayList();
    }

    public List<Integer> getOutlierIndices() {
        return outlierIndices;
    }

    public void setOutlierIndices(List<Integer> outlierIndices) {
        this.outlierIndices = outlierIndices;
    }

    public void addOutlierIndex(int index) {
        this.outlierIndices.add(index);
    }

    public List<Double> getNonOutliers() {
        return nonOutliers;
    }

    public void setNonOutliers(List<Double> nonOutliers) {
        this.nonOutliers = nonOutliers;
    }

    public void addNonOutlier(double elem) {
        this.nonOutliers.add(elem);
    }

    public double getLowerBound() {
        return lowerBound;
    }

    public void setLowerBound(double lowerBound) {
        this.lowerBound = lowerBound;
    }

    public double getUpperBound() {
        return upperBound;
    }

    public void setUpperBound(double upperBound) {
        this.upperBound = upperBound;
    }

    @Override
    public String toString() {
        return "OutlierResult{" +
                "outlierIndices=" + outlierIndices +
                ", nonOutliers=" + nonOutliers +
                ", lowerBound=" + lowerBound +
                ", upperBound=" + upperBound +
                '}';
    }

    public void setSigma(double sigma) {
        this.sigma = sigma;
    }

    public double getSigma() {
        return sigma;
    }

    public void setMedian(double median) {
        this.median = median;
    }

    public double getMedian() {
        return median;
    }
}
