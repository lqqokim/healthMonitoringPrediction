package com.bistel.pdm.batch.processor;

import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
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
import java.util.concurrent.ExecutionException;

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
        // time, P1, P2, P3, P4, ... Pn, now status:time, prev status:time, refresh flag
        String[] columns = value.split(SEPARATOR, -1);

        try {
            // refresh cache
            String refreshCacheflag = columns[columns.length - 1];

            String[] currStatusAndTime = columns[columns.length - 3].split(":");
            String[] prevStatusAndTime = columns[columns.length - 2].split(":");

            List<ParameterWithSpecMaster> parameterMasterDataSets = MasterCache.ParameterWithSpec.get(partitionKey);

            if (kvSummaryIntervalStore.get(partitionKey) == null) {
                Long paramTime = Long.parseLong(currStatusAndTime[1]);
                kvSummaryIntervalStore.put(partitionKey, paramTime);
            }

            // idle -> run
            if (prevStatusAndTime[0].equalsIgnoreCase("I")
                    && currStatusAndTime[0].equalsIgnoreCase("R")) {
                Long paramTime = Long.parseLong(currStatusAndTime[1]);
                // start event
                kvSummaryIntervalStore.put(partitionKey, paramTime);
            }

            // processing
            if (currStatusAndTime[0].equalsIgnoreCase("R")) {
                Long paramTime = Long.parseLong(currStatusAndTime[1]);

                for (ParameterWithSpecMaster param : parameterMasterDataSets) {
                    if (param.getParamParseIndex() <= 0) continue;

                    String paramKey = partitionKey + ":" + param.getParameterRawId();
                    Double dValue = Double.parseDouble(columns[param.getParamParseIndex()]);
                    kvSummaryWindowStore.put(paramKey, dValue, paramTime);
                }

                // for long-term interval on event.
                EventMaster event = getEvent(partitionKey, "S");
                if (event != null && event.getTimeIntervalYn().equalsIgnoreCase("Y")) {
                    Long startTime = kvSummaryIntervalStore.get(partitionKey);
                    Long interval = startTime + event.getIntervalTimeMs();

                    if (paramTime >= interval) {
                        log.debug("[{}] - aggregate data every {} ms between event intervals.", partitionKey, event.getIntervalTimeMs());

                        String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                        String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(paramTime));
                        log.debug("[{}] - processing interval from {} to {}.", partitionKey, sts, ets);

                        for (ParameterWithSpecMaster paramMaster : parameterMasterDataSets) {
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
                                    lws + "," +
                                    refreshCacheflag;

                            context().forward(partitionKey, msg.getBytes());
                            context().commit();

                            log.debug("[{}] - from : {}, end : {}, param : {} ",
                                    partitionKey, startTime, paramTime, paramMaster.getParameterName());
                        }

                        kvSummaryIntervalStore.put(partitionKey, paramTime);
                    }
                }
            }

            // run -> idle
            if (prevStatusAndTime[0].equalsIgnoreCase("R") &&
                    currStatusAndTime[0].equalsIgnoreCase("I")) {

                log.debug("[{}] - aggregate data at the end of the event.", partitionKey);

                Long startTime = kvSummaryIntervalStore.get(partitionKey);
                Long endTime = Long.parseLong(prevStatusAndTime[1]);

                String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(endTime));
                log.debug("[{}] - processing interval from {} to {}.", partitionKey, sts, ets);

                for (ParameterWithSpecMaster paramMaster : parameterMasterDataSets) {
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
                            lws + "," +
                            refreshCacheflag;

                    context().forward(partitionKey, msg.getBytes());
                    context().commit();

                    log.debug("[{}] - from : {}, end : {}, param : {} ",
                            partitionKey, startTime, endTime, paramMaster.getParameterName());
                }

                // refresh cache
                if (refreshCacheflag.equalsIgnoreCase("CRC")) {
                    // refresh master
                    MasterCache.Equipment.refresh(partitionKey);
                    //MasterCache.Parameter.refresh(partitionKey);
                    MasterCache.ParameterWithSpec.refresh(partitionKey);
                    MasterCache.Event.refresh(partitionKey);
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private EventMaster getEvent(String key, String type) throws ExecutionException {
        EventMaster e = null;
        for (EventMaster event : MasterCache.Event.get(key)) {
            if (event.getProcessYN().equalsIgnoreCase("Y")
                    && event.getEventTypeCD().equalsIgnoreCase(type)) {
                e = event;
                break;
            }
        }

        return e;
    }
}
