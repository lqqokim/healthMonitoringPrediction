package com.bistel.pdm.batch.functions.model;

import org.apache.commons.math3.stat.descriptive.moment.StandardDeviation;
import org.apache.commons.math3.stat.descriptive.rank.Median;

import java.io.Serializable;
import java.util.ArrayList;

public class WindowStats implements Serializable  {
    int dataCount;
    double pointSum;
    double pointMin;
    double pointMax;
    double pointMean;
    double pointStdDev;
    double pointMedian;

    ArrayList<Double> values = new ArrayList<>();

    public WindowStats add(Double value) {
        values.add(value);

        this.dataCount = this.dataCount + 1;
        this.pointSum = this.pointSum + value;
        this.pointMin = this.pointMin < value ? this.pointMin : value;
        this.pointMax = this.pointMax > value ? this.pointMax : value;

        return this;
    }

    public WindowStats compute() {

        this.pointMean = this.pointSum / this.dataCount;

        double[] doubleValues = values.stream().mapToDouble(Double::doubleValue).toArray();

        Median median = new Median();
        this.pointMedian = median.evaluate(doubleValues);

        StandardDeviation std = new StandardDeviation();
        this.pointStdDev = std.evaluate(doubleValues, this.pointMean);

        return this;
    }

    public String toString() {
        return dataCount + "," + pointSum + "," + pointMin + ","
                + pointMax + "," + pointMean + "," + pointStdDev + "," + pointMedian;
    }
}
