package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 */
public class AggregateFeatureProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(AggregateFeatureProcessor.class);

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, byte[]> kvAggregationWindowStore;
    private KeyValueStore<String, Long> kvSummaryIntervalStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext context) {
        super.init(context);

        kvAggregationWindowStore = (KeyValueStore) context().getStateStore("aggregation-window");
        kvSummaryIntervalStore = (KeyValueStore) context().getStateStore("summary-interval");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String value = new String(streamByteRecord);
        // time, p1, p2, p3, p4, ... pn,curr_status:time,prev_status:time
        String[] columns = value.split(SEPARATOR, -1);

        try {
            String[] currStatusAndTime = columns[columns.length - 2].split(":");
            String[] prevStatusAndTime = columns[columns.length - 1].split(":");

            log.debug("[{}] - ({} to {})", partitionKey, prevStatusAndTime[0], currStatusAndTime[0]);

            if (prevStatusAndTime[0].equalsIgnoreCase("I")
                    && !prevStatusAndTime[0].equalsIgnoreCase(currStatusAndTime[0])) {
                Long paramTime = Long.parseLong(currStatusAndTime[1]);
                // start event
                kvSummaryIntervalStore.put(partitionKey, paramTime);
            }

            if (currStatusAndTime[0].equalsIgnoreCase("R")) {
                Long paramTime = Long.parseLong(currStatusAndTime[1]);
                kvAggregationWindowStore.put(partitionKey + ":" + paramTime, streamByteRecord);

            } else {
                //end
                if (prevStatusAndTime[0].equalsIgnoreCase("R") &&
                        currStatusAndTime[0].equalsIgnoreCase("I")) {

                    //end trace
                    log.debug("[{}] - The event changed from R to I, let's aggregate stats.", partitionKey);

                    //aggregation
                    List<String> keyList = new ArrayList<>();
                    List<byte[]> paramDataList = new ArrayList<>();

                    KeyValueIterator<String, byte[]> iter = this.kvAggregationWindowStore.all();
                    while (iter.hasNext()) {
                        KeyValue<String, byte[]> entry = iter.next();
                        String key = entry.key.split(":")[0];

                        if (partitionKey.equalsIgnoreCase(key)) {
                            keyList.add(entry.key);
                            paramDataList.add(entry.value);
                        }
                    }
                    iter.close();

                    for (String k : keyList) {
                        this.kvSummaryIntervalStore.delete(k);
                    }

                    List<ParameterMasterDataSet> parameterMasterDataSets =
                            MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

                    Map<Long, ArrayList<Double>> paramValues = new HashMap<>();

                    for (byte[] record : paramDataList) {
                        // aggregate min, max, count, avg, median, std.dev, ... per parameter.
                        String rec = new String(record);
                        //param_rawid, value, alarm spec, warning spec, time
                        String[] recordCols = rec.split(SEPARATOR, -1);

                        for (ParameterMasterDataSet p : parameterMasterDataSets) {

                            if (p.getParamParseIndex() == -1) continue;

                            if (!paramValues.containsKey(p.getParameterRawId())) {
                                ArrayList<Double> values = new ArrayList<>();
                                values.add(Double.parseDouble(recordCols[p.getParamParseIndex()]));
                                paramValues.put(p.getParameterRawId(), values);
                            } else {
                                ArrayList<Double> values = paramValues.get(p.getParameterRawId());
                                values.add(Double.parseDouble(recordCols[p.getParamParseIndex()]));
                            }
                        }
                    }

                    log.debug("[{}] - There are {} parameters.", partitionKey, paramValues.size());

                    for (Long paramRawId : paramValues.keySet()) {
                        DescriptiveStatistics stats = new DescriptiveStatistics();

                        ArrayList<Double> values = paramValues.get(paramRawId);
                        for (double i : values) {
                            stats.addValue(i);
                        }

                        Long sumStartDtts = kvSummaryIntervalStore.get(partitionKey);
                        Long sumEndDtts = Long.parseLong(prevStatusAndTime[1]);

                        if (sumStartDtts == null) sumStartDtts = sumEndDtts;

                        // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3
                        String msg = String.valueOf(sumStartDtts) + "," +
                                sumEndDtts + "," +
                                paramRawId + "," +
                                values.size() + "," +
                                stats.getMin() + "," +
                                stats.getMax() + "," +
                                stats.getPercentile(50) + "," +
                                stats.getMean() + "," +
                                stats.getStandardDeviation() + "," +
                                stats.getPercentile(25) + "," +
                                stats.getPercentile(75);

                        log.debug("[{}] - {} ", partitionKey, msg);

                        context().forward(partitionKey, msg.getBytes());
                        context().commit();
                    }

                    log.debug("[{}] - forward aggregated stream to route-feature, output-feature.", partitionKey);
                    log.debug("");
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

    }
}
