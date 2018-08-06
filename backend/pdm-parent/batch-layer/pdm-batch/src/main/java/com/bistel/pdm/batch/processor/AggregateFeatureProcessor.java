package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.EventMasterDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.apache.kafka.streams.state.WindowStoreIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
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

            List<ParameterMasterDataSet> parameterMasterDataSets =
                    MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

            if (kvSummaryIntervalStore.get(partitionKey) == null) {
                Long paramTime = Long.parseLong(currStatusAndTime[1]);
                kvSummaryIntervalStore.put(partitionKey, paramTime);
            }

            //log.debug("[{}] - ({} to {})", partitionKey, prevStatusAndTime[0], currStatusAndTime[0]);

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

                // for long-term interval on event.
                EventMasterDataSet event = MasterDataCache.getInstance().getEventForProcess(partitionKey);
                if(event != null && event.getTimeIntervalYn().equalsIgnoreCase("Y")){
                    Long startTime = kvSummaryIntervalStore.get(partitionKey);
                    Long interval = startTime + event.getIntervalTimeMs();

                    if(paramTime >= interval){
                        // every event.getIntervalTimeMs();
                        log.debug("[{}] - Summarizes the data every {} ms on event.", partitionKey, event.getIntervalTimeMs());

                        String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                        String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(paramTime));
                        log.debug("[{}] - processing interval from {} to {}.", partitionKey, sts, ets);

                        for (ParameterMasterDataSet paramMaster : parameterMasterDataSets) {
                            if (paramMaster.getParamParseIndex() <= 0) continue;

                            String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();
                            WindowStoreIterator<Double> storeIterator = kvSummaryWindowStore.fetch(paramKey, startTime, paramTime);

                            DescriptiveStatistics stats = new DescriptiveStatistics();
                            while (storeIterator.hasNext()) {
                                KeyValue<Long, Double> kv = storeIterator.next();
                                stats.addValue(kv.value);
                            }
                            storeIterator.close();

                            String uas = paramMaster.getUpperAlarmSpec() == null ? "" : Float.toString(paramMaster.getUpperAlarmSpec());
                            String uws = paramMaster.getUpperWarningSpec() == null ? "" : Float.toString(paramMaster.getUpperWarningSpec());
                            String tgt = paramMaster.getTarget() == null ? "" : Float.toString(paramMaster.getTarget());
                            String las = paramMaster.getLowerAlarmSpec() == null ? "" : Float.toString(paramMaster.getLowerAlarmSpec());
                            String lws = paramMaster.getLowerAlarmSpec() == null ? "" : Float.toString(paramMaster.getLowerAlarmSpec());

                            // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, spec...
                            String msg = String.valueOf(startTime) + "," +
                                    String.valueOf(paramTime) + "," +
                                    paramMaster.getParameterRawId() + "," +
                                    stats.getValues().length + "," +
                                    stats.getMin() + "," +
                                    stats.getMax() + "," +
                                    stats.getPercentile(50) + "," +
                                    stats.getMean() + "," +
                                    stats.getStandardDeviation() + "," +
                                    stats.getPercentile(25) + "," +
                                    stats.getPercentile(75) + "," +
                                    uas + "," +
                                    uws + "," +
                                    tgt + "," +
                                    las + "," +
                                    lws;

                            context().forward(partitionKey, msg.getBytes());
                            context().commit();

                            log.trace("[{}] - from : {}, end : {}, param : {} ",
                                    partitionKey, startTime, paramTime, paramMaster.getParameterName());
                        }

                        log.info("[{}] - *forward aggregated stream to route-feature, output-feature.", partitionKey);
                        kvSummaryIntervalStore.put(partitionKey, paramTime);
                    }
                }
            }

            // run -> idle
            if (prevStatusAndTime[0].equalsIgnoreCase("R") &&
                    currStatusAndTime[0].equalsIgnoreCase("I")) {

                //end trace
                //log.info("[{}] - From now on, aggregate the data of the operating interval.", partitionKey);

                Long startTime = kvSummaryIntervalStore.get(partitionKey);
                Long endTime = Long.parseLong(prevStatusAndTime[1]);

                String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(endTime));
                log.debug("[{}] - processing interval from {} to {}.", partitionKey, sts, ets);

                for (ParameterMasterDataSet paramMaster : parameterMasterDataSets) {
                    if (paramMaster.getParamParseIndex() <= 0) continue;

                    String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();
                    WindowStoreIterator<Double> storeIterator = kvSummaryWindowStore.fetch(paramKey, startTime, endTime);

                    DescriptiveStatistics stats = new DescriptiveStatistics();
                    while (storeIterator.hasNext()) {
                        KeyValue<Long, Double> kv = storeIterator.next();
                        stats.addValue(kv.value);
                    }
                    storeIterator.close();

                    String uas = paramMaster.getUpperAlarmSpec() == null ? "" : Float.toString(paramMaster.getUpperAlarmSpec());
                    String uws = paramMaster.getUpperWarningSpec() == null ? "" : Float.toString(paramMaster.getUpperWarningSpec());
                    String tgt = paramMaster.getTarget() == null ? "" : Float.toString(paramMaster.getTarget());
                    String las = paramMaster.getLowerAlarmSpec() == null ? "" : Float.toString(paramMaster.getLowerAlarmSpec());
                    String lws = paramMaster.getLowerAlarmSpec() == null ? "" : Float.toString(paramMaster.getLowerAlarmSpec());

                    // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, spec...
                    String msg = String.valueOf(startTime) + "," +
                            String.valueOf(endTime) + "," +
                            paramMaster.getParameterRawId() + "," +
                            stats.getValues().length + "," +
                            stats.getMin() + "," +
                            stats.getMax() + "," +
                            stats.getPercentile(50) + "," +
                            stats.getMean() + "," +
                            stats.getStandardDeviation() + "," +
                            stats.getPercentile(25) + "," +
                            stats.getPercentile(75) + "," +
                            uas + "," +
                            uws + "," +
                            tgt + "," +
                            las + "," +
                            lws;

                    context().forward(partitionKey, msg.getBytes());
                    context().commit();

                    log.debug("[{}] - from : {}, end : {}, param : {} ",
                            partitionKey, startTime, endTime, paramMaster.getParameterName());
                }

                log.info("[{}] - forward aggregated stream to route-feature, output-feature.", partitionKey);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
