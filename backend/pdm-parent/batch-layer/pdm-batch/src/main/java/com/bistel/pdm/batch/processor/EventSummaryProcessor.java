package com.bistel.pdm.batch.processor;

import com.bistel.pdm.data.stream.ParameterMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.apache.kafka.streams.state.WindowStoreIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Processor for processing by message type
 */
public class EventSummaryProcessor extends AbstractProcessor<String, String> {
    private static final Logger log = LoggerFactory.getLogger(EventSummaryProcessor.class);
    private final static String SEPARATOR = ",";
    private final static String TIME_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";

    private KeyValueStore<String, String> kvProcessContextStore;
    private WindowStore<String, Double> kvContValueWindowStore;
    private WindowStore<String, String> kvCatValueWindowStore;

    private final static String NEXT_OUT_FEATURE_STREAM_NODE = "output-feature";
    private final static String NEXT_OUT_DIMENSION_STREAM_NODE = "output-dimension";

    private final ConcurrentHashMap<String, Boolean> cacheReloadFlagMap = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvProcessContextStore = (KeyValueStore) context().getStateStore("batch-process-context-store");
        kvContValueWindowStore = (WindowStore) context().getStateStore("batch-cont-summary-store");
        kvCatValueWindowStore = (WindowStore) context().getStateStore("batch-cat-summary-store");
    }

    @Override
    public void process(String key, String record) {
        String[] columns = record.split(SEPARATOR, -1);

        try {
            if (columns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
                cacheReloadFlagMap.put(key, true);
                return;
            }


            String msgType = "";
            for (Header header : context().headers().toArray()) {
                if (header.key().equalsIgnoreCase("msgType")) {
                    msgType = new String(header.value());
                }
            }

            if (msgType.equalsIgnoreCase("E")) {
                //EVENT : time, event_id, event_name, event_flag(S/E), vid_1=value, vid_2=value, ..., vid_n=value

                String eventFlag = columns[3];
                log.debug("[{}] - {} {}-{} event occurred.", key, columns[0], columns[2], eventFlag);

                SimpleDateFormat dateFormat = new SimpleDateFormat(TIME_FORMAT);
                Long epochTime = dateFormat.parse(columns[0]).getTime();

                if (eventFlag.equalsIgnoreCase("E")) {
                    // event ended.
                    String value = kvProcessContextStore.get(key);
                    value += epochTime;
                    kvProcessContextStore.put(key, value); // event_flag, start_long_time, end_long_time

                    // do summary

                    // refresh cache by cmd.
                    if (cacheReloadFlagMap.get(key) != null & cacheReloadFlagMap.get(key)) {
                        refreshMasterCache(key);
                        cacheReloadFlagMap.put(key, false);
                    }
                } else {
                    // event started.
                    // event_flag, start_long_time, end_long_time
                    kvProcessContextStore.put(key, eventFlag + "," + epochTime + ",");
                }
            } else if (msgType.equalsIgnoreCase("T")) {
                //TRACE : time, vid_1=value, vid_2=value, vid_3=value, ..., vid_n=value

                if (kvProcessContextStore.get(key) != null) {
                    String context = kvProcessContextStore.get(key);
                    String[] eventState = context.split(",");

                    SimpleDateFormat dateFormat = new SimpleDateFormat(TIME_FORMAT);
                    Long epochTime = dateFormat.parse(columns[0]).getTime();

                    List<ParameterMaster> paramList = MasterCache.Parameter.get(key);

                    if (eventState[0].equalsIgnoreCase("S")) {
                        // RUN

                        for (ParameterMaster paramInfo : paramList) {
                            String paramKey = key + ":" + paramInfo.getSvid();

                            if (paramInfo.getDataTypeCode().equalsIgnoreCase("CONTINUOUS")) {
                                //continuous value
                                Double svidValue = getSvidDoubleValue(columns, paramInfo.getSvid());
                                kvContValueWindowStore.put(paramKey, svidValue, epochTime);
                            } else {
                                //categorical value
                                String catValue = getSvidCatValue(columns, paramInfo.getSvid());
                                kvCatValueWindowStore.put(paramKey, catValue, epochTime);
                            }
                        }

                    } else if (eventState[0].equalsIgnoreCase("E")) {

                        Long startEpochTime = Long.parseLong(eventState[1]);
                        Long endEpochTime = Long.parseLong(eventState[2]);

                        for (ParameterMaster paramMaster : paramList) {
                            String paramKey = key + ":" + paramMaster.getSvid();

                            if (paramMaster.getDataTypeCode().equalsIgnoreCase("CONTINUOUS")) {
                                WindowStoreIterator<Double> storeIterator =
                                        kvContValueWindowStore.fetch(paramKey, startEpochTime, endEpochTime);

                                DescriptiveStatistics stats = new DescriptiveStatistics();
                                while (storeIterator.hasNext()) {
                                    KeyValue<Long, Double> kv = storeIterator.next();
                                    if (!kv.value.isNaN()) {
                                        stats.addValue(kv.value);
                                    }
                                }
                                storeIterator.close();

                                if (stats.getValues().length > 0) {
                                    // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, group
                                    String summaryMsg = String.valueOf(startEpochTime) + "," +
                                            String.valueOf(endEpochTime) + "," +
                                            paramMaster.getId() + "," +
                                            stats.getValues().length + "," +
                                            stats.getMin() + "," +
                                            stats.getMax() + "," +
                                            stats.getPercentile(50) + "," +
                                            stats.getMean() + "," +
                                            stats.getStandardDeviation() + "," +
                                            stats.getPercentile(25) + "," +
                                            stats.getPercentile(75) + "," +
                                            startEpochTime;

                                    context().forward(key, summaryMsg.getBytes(), To.child(NEXT_OUT_FEATURE_STREAM_NODE));

                                } else {
                                    log.debug("[{}] - skip {} because value is empty.", key, paramMaster.getParameterName());
                                }
                            } else {
                                // for dimensional
                                WindowStoreIterator<String> catStoreIterator =
                                        kvCatValueWindowStore.fetch(paramKey, startEpochTime, endEpochTime);

                                List<String> catDimensions = new ArrayList<>();
                                while (catStoreIterator.hasNext()) {
                                    KeyValue<Long, String> kv = catStoreIterator.next();
                                    if (!catDimensions.contains(kv.value)) {
                                        catDimensions.add(kv.value);
                                    }
                                }
                                catStoreIterator.close();

                                for (String dim : catDimensions) {
                                    String categoricalMsg = String.valueOf(startEpochTime) + "," +
                                            String.valueOf(endEpochTime) + "," +
                                            paramMaster.getId() + "," +
                                            dim + "," +
                                            startEpochTime;

                                    context().forward(key, categoricalMsg.getBytes(), To.child(NEXT_OUT_DIMENSION_STREAM_NODE));
                                }
                            }
                        }
                        log.debug("[{}] - aggregated from ({} to {}).", key, columns[1], columns[2]);
                        context().commit();

                        kvProcessContextStore.put(key, "," + ",");
                    } else {
                        //idle
                    }
                }
            } else if (msgType.equalsIgnoreCase("A")) {
                //ALARM : time, alarm_id, alarm_code, alarm_text

                //

            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private Double getSvidDoubleValue(String[] columns, String svid) {
        Double value = Double.NaN;

        for (String col : columns) {
            String[] cols = col.split("=");

            if (cols.length >= 2) {
                if (cols[0].equalsIgnoreCase(svid)) {
                    if (cols[1].length() > 0) {
                        value = Double.parseDouble(cols[1]);
                    }
                    break;
                }
            }
        }

        return value;
    }

    private String getSvidCatValue(String[] columns, String svid) {
        String catValue = "";
        for (String col : columns) {
            String[] cols = col.split("=");

            if (cols.length >= 2) {
                if (cols[0].equalsIgnoreCase(svid)) {
                    catValue = cols[1];
                    break;
                }
            }
        }

        return catValue;
    }

    private void refreshMasterCache(String key) {
        // refresh master info.
        try {
            MasterCache.Equipment.refresh(key);
            MasterCache.IntervalEvent.refresh(key);
            MasterCache.Parameter.refresh(key);
            MasterCache.ParameterWithSpec.refresh(key);
            MasterCache.EquipmentSpecRule.refresh(key);
            MasterCache.SpecRuleExpression.refresh(key);
            MasterCache.Health.refresh(key);
            MasterCache.ProcessGroup.refresh(key);

            log.debug("[{}] - all cache refreshed.", key);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
