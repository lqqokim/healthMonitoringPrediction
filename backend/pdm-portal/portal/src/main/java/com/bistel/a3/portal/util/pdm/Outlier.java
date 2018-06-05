package com.bistel.a3.portal.util.pdm;

import com.bistel.a3.portal.domain.pdm.BasicData;
import jersey.repackaged.com.google.common.collect.Lists;
import org.apache.commons.math3.stat.StatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class Outlier {
    private static Logger logger = LoggerFactory.getLogger(Outlier.class);

    public static OutlierResult ruleHampel(final double[] data, final double tValue) {
        double median = StatUtils.percentile(data, 50);
        double sigma = getSigma(data, median);
        double lowerBound = median - tValue * sigma;
        double upperBound = median + tValue * sigma;

        OutlierResult result = new OutlierResult();
        result.setLowerBound(lowerBound);
        result.setUpperBound(upperBound);

        result.setMedian(median);
        result.setSigma(sigma);

        for (int i = 0; i < data.length; i++) {
            if (data[i] >= lowerBound && data[i] <= upperBound) {
                result.addNonOutlier(data[i]);
            } else {
                result.addOutlierIndex(i);
            }
        }
        return result;
    }

    public static double getSigma(final double[] data, double median) {
        double[] abs = new double[data.length];

        for (int i = 0; i < data.length; i++) {
            abs[i] = Math.abs(data[i] - median);
        }

        return StatUtils.percentile(abs, 50) * 1.4826;
    }

    public static List<Double[]> runHampelFilter(List<List<Double>> list, int delta, double sigma) {
        List<Double[]> result = new ArrayList<>();
        for(int i=0; i<list.size(); i++) {
            double[] data = getData(i, list, delta);
            OutlierResult r = Outlier.ruleHampel(data, sigma);
            result.add(new Double[] {r.getUpperBound(), r.getLowerBound()});
        }
        return result;
    }

    private static double[] getData(int position, List<List<Double>> records, int dataDelta) {
        int start = position - dataDelta;
        int end = position + dataDelta;

        if (start < 0) start = 0;
        if (end >= records.size()) end = records.size() - 1;

        return records.subList(start, end+1).stream().mapToDouble(d -> d.get(1)).toArray();
    }

    public static List<List<Double>> getListFromBasicData(List<BasicData> data) {
        List<List<Double>> list = new ArrayList<>();
        for(BasicData d : data) {
            list.add(Lists.newArrayList((double)d.getX().getTime(), d.getY()));
        }
        return list;
    }

    public static double[] filterBasicData(List<BasicData> data, List<Double[]> hampel) {
        List<Double> result = new ArrayList<>();
        for(int i=0; i<hampel.size(); i++) {
            Double value = data.get(i).getY();
            Double[] spec = hampel.get(i);
            if(spec[0] > value && spec[1] < value) {
                result.add(value);
            }
        }
        return result.stream().mapToDouble(i->i).toArray();
    }
}
