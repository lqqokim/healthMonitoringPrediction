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
public class FeatureAggregatorProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(FeatureAggregatorProcessor.class);

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, byte[]> kvWindowStore;
    private KeyValueStore<String, Long> kvEventTimeStore;

    //private WindowStore<String, byte[]> kvTempStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext context) {
        super.init(context);

        kvWindowStore = (KeyValueStore) context().getStateStore("persistent-window");
        kvEventTimeStore = (KeyValueStore) context().getStateStore("sustain-eventtime");

        //kvTempStore = (WindowStore) context().getStateStore("processing-interval");

//        // schedule a punctuate() method every 1000 milliseconds based on stream-time
//        context().schedule(TimeUnit.MINUTES.toMillis(1), PunctuationType.STREAM_TIME, (timestamp) -> {
//
//            long timeFrom = 0; // beginning of time = oldest available
//            long timeTo = System.currentTimeMillis(); // now (in processing-time)
//            WindowStoreIterator<byte[]> iterator = kvTempStore.fetch("europe", timeFrom, timeTo);
//
//            KeyValueIterator<> iter = kvTempStore.all();
//
//            while (iterator.hasNext()) {
//                KeyValue<Long, byte[]> next = iterator.next();
//                long windowTimestamp = next.key;
//                System.out.println("Count of 'europe' @ time " + windowTimestamp + " is " + next.value);
//            }
//
//        });

//        context().schedule(TimeUnit.MINUTES.toMillis(1), PunctuationType.STREAM_TIME, (timestamp) -> {
//            KeyValueIterator<String, byte[]> iter = this.kvStore.all();
//            while (iter.hasNext()) {
//                KeyValue<String, byte[]> entry = iter.next();
//                //context.forward(entry.key, entry.value);
//            }
//            iter.close();
//
//
//            StringBuilder sb = new StringBuilder();
//            sb.append("count,sum,min,max,avg,median,stddev");
//
//            context.forward("", sb.toString().getBytes());
//            // commit the current processing progress
//            context.commit();
//        });
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String value = new String(streamByteRecord);
        // time, area, eqp, p1, p2, p3, p4, ... pn,curr_status:time,prev_status:time
        String[] columns = value.split(SEPARATOR, -1);

        String[] currStatusAndTime = columns[columns.length - 2].split(":");
        String[] prevStatusAndTime = columns[columns.length - 1].split(":");

        log.debug("[{}] - ({} to {})", partitionKey, prevStatusAndTime[0], currStatusAndTime[0]);

        if (prevStatusAndTime[0].equalsIgnoreCase("I")
                && !prevStatusAndTime[0].equalsIgnoreCase(currStatusAndTime[0])) {
            Long paramTime = Long.parseLong(currStatusAndTime[1]);
            // start event
            kvEventTimeStore.put(partitionKey, paramTime);
        }

        if (currStatusAndTime[0].equalsIgnoreCase("R")) {
            Long paramTime = Long.parseLong(currStatusAndTime[1]);

            context().forward(partitionKey, streamByteRecord, "route-run"); // detect fault by real-time
            context().commit();

            log.debug("[{}] - routed the stream to route-run.", partitionKey);
            kvWindowStore.put(partitionKey + ":" + paramTime, streamByteRecord);

        } else {
            //end
            if (prevStatusAndTime[0].equalsIgnoreCase("R") &&
                    currStatusAndTime[0].equalsIgnoreCase("I")) {

                //end trace
                log.debug("[{}] - The event changed from R to I, let's aggregate stats.", partitionKey);
                context().forward(partitionKey, "kill-them".getBytes(), "route-run");
                context().commit();

                //aggregation
                List<String> keyList = new ArrayList<>();
                List<byte[]> paramDataList = new ArrayList<>();

                KeyValueIterator<String, byte[]> iter = this.kvWindowStore.all();
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
                    this.kvWindowStore.delete(k);
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

                    Long sumStartDtts = kvEventTimeStore.get(partitionKey);
                    Long sumEndDtts = Long.parseLong(prevStatusAndTime[1]);

                    if(sumStartDtts == null) sumStartDtts = sumEndDtts;

                    // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3
                    StringBuilder sbStats = new StringBuilder();
                    sbStats.append(sumStartDtts).append(",")
                            .append(sumEndDtts).append(",")
                            .append(paramRawId).append(",")
                            .append(values.size()).append(",")
                            .append(stats.getMin()).append(",")
                            .append(stats.getMax()).append(",")
                            .append(stats.getPercentile(50)).append(",")
                            .append(stats.getMean()).append(",")
                            .append(stats.getStandardDeviation()).append(",")
                            .append(stats.getPercentile(25)).append(",")
                            .append(stats.getPercentile(75));

                    String msg = sbStats.toString();
                    log.debug(" {} : {} ", partitionKey, msg);

                    context().forward(partitionKey, msg.getBytes(), "route-feature");
                    context().forward(partitionKey, msg.getBytes(), "output-feature");
                    context().commit();

                    log.debug("[{}] - forward aggregated stream to route-feature, output-feature.", partitionKey);
                }
            }
        }
    }
}
