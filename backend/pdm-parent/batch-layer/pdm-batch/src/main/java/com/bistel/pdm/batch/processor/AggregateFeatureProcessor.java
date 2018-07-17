package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Windowed;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 */
public class AggregateFeatureProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(AggregateFeatureProcessor.class);

    private final static String SEPARATOR = ",";

    private WindowStore<String, Double> kvSummaryWindowStore;
    private KeyValueStore<String, Long> kvSummaryIntervalStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext context) {
        super.init(context);

        kvSummaryWindowStore = (WindowStore) context().getStateStore("batch-feature-summary");
        kvSummaryIntervalStore = (KeyValueStore) context().getStateStore("batch-summary-interval");
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

            List<ParameterMasterDataSet> parameterMasterDataSets =
                    MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

            // idle -> run
            if (prevStatusAndTime[0].equalsIgnoreCase("I")
                    && !prevStatusAndTime[0].equalsIgnoreCase(currStatusAndTime[0])) {
                Long paramTime = Long.parseLong(currStatusAndTime[1]);
                // start event
                kvSummaryIntervalStore.put(partitionKey, paramTime);
            }

            // processing
            if (currStatusAndTime[0].equalsIgnoreCase("R")) {
                Long paramTime = Long.parseLong(currStatusAndTime[1]);

                for (ParameterMasterDataSet param : parameterMasterDataSets) {
                    if (param.getParamParseIndex() <= 0) continue;

                    String paramKey = partitionKey + ":" + param.getParameterRawId();
                    Double dValue = Double.parseDouble(columns[param.getParamParseIndex()]);
                    kvSummaryWindowStore.put(paramKey, dValue, paramTime);
                }
            }

            // run -> idle
            if (prevStatusAndTime[0].equalsIgnoreCase("R") &&
                    currStatusAndTime[0].equalsIgnoreCase("I")) {

                //end trace
                log.debug("[{}] - The event changed from R to I, let's aggregate stats.", partitionKey);

                Long startTime = Long.parseLong(prevStatusAndTime[1]);
                if (kvSummaryIntervalStore.get(partitionKey) != null) {
                    startTime = kvSummaryIntervalStore.get(partitionKey);
                }
                Long endTime = Long.parseLong(prevStatusAndTime[1]);

                log.debug("[{}] - processing interval from {} to {}.", partitionKey, startTime, endTime);

                HashMap<String, List<Double>> paramValueList = new HashMap<>();

                KeyValueIterator<Windowed<String>, Double> storeIterator = kvSummaryWindowStore.fetchAll(startTime, endTime);
                while (storeIterator.hasNext()) {
                    KeyValue<Windowed<String>, Double> kv = storeIterator.next();

                    if (!paramValueList.containsKey(kv.key.key())) {
                        ArrayList<Double> arrValue = new ArrayList<>();
                        arrValue.add(kv.value);
                        paramValueList.put(kv.key.key(), arrValue);
                    } else {
                        List<Double> arrValue = paramValueList.get(kv.key.key());
                        arrValue.add(kv.value);
                    }
                }

                for (ParameterMasterDataSet paramMaster : parameterMasterDataSets) {
                    if (paramMaster.getParamParseIndex() <= 0) continue;

                    String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

                    List<Double> doubleValueList = paramValueList.get(paramKey);
                    if(doubleValueList == null) {
                        log.debug("[{}] - skip first time...", paramKey);
                    }
                    log.debug("[{}] - window data size : {}", paramKey, doubleValueList.size());

                    DescriptiveStatistics stats = new DescriptiveStatistics();
                    for (double i : doubleValueList) {
                        stats.addValue(i);
                    }

                    // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3
                    String msg = String.valueOf(startTime) + "," +
                            String.valueOf(endTime) + "," +
                            paramMaster.getParameterRawId() + "," +
                            doubleValueList.size() + "," +
                            stats.getMin() + "," +
                            stats.getMax() + "," +
                            stats.getPercentile(50) + "," +
                            stats.getMean() + "," +
                            stats.getStandardDeviation() + "," +
                            stats.getPercentile(25) + "," +
                            stats.getPercentile(75);

                    log.debug("[{}] - msg : {}", paramKey, msg);
                    context().forward(partitionKey, msg.getBytes());
                    context().commit();
                }

                log.debug("[{}] - forward aggregated stream to route-feature, output-feature.", partitionKey);
                log.debug(" ");
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
