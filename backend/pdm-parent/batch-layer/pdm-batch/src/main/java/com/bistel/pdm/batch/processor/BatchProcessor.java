package com.bistel.pdm.batch.processor;

import com.bistel.pdm.batch.function.StatusDefineFunction;
import com.bistel.pdm.batch.model.StatusWindow;
import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.data.stream.ParameterMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.WindowStore;
import org.apache.kafka.streams.state.WindowStoreIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 *
 */
public class BatchProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(BatchProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    private final static String SEPARATOR = ",";

    private WindowStore<String, Double> kvContValueWindowStore;
    private WindowStore<String, String> kvCatValueWindowStore;

    private final StatusDefineFunction statusDefineFunction = new StatusDefineFunction();

    private final ConcurrentHashMap<String, StatusWindow> statusContextMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> messageGroupMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> intervalLongTime = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> refreshCacheFlagMap = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvContValueWindowStore = (WindowStore) context().getStateStore("batch-continuous-summary");
        kvCatValueWindowStore = (WindowStore) context().getStateStore("batch-categorical-summary");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR, -1);

        try {
            // refresh cache
            if (recordColumns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
                refreshCacheFlagMap.put(partitionKey, "Y");
                context().commit();
                return;
            }

            // filter by master
            if (MasterCache.Equipment.get(partitionKey) == null) {
                log.debug("[{}] - Not existed.", partitionKey);
                context().commit();
                return;
            }

            Pair<EventMaster, EventMaster> eventInfo = MasterCache.IntervalEvent.get(partitionKey);
            if (eventInfo != null && eventInfo.getFirst() != null) {

                final Long msgLongTime = parseStringToTimestamp(recordColumns[0]);
                double paramValue = Double.parseDouble(recordColumns[eventInfo.getFirst().getParamParseIndex()]);
                String nowStatusCode = statusDefineFunction.evaluateStatusCode(eventInfo.getFirst(), paramValue);

                StatusWindow statusWindow;
                if (statusContextMap.get(partitionKey) == null) {
                    statusWindow = new StatusWindow();
                    statusWindow.addPrevious(nowStatusCode, msgLongTime);
                    statusWindow.addCurrent(nowStatusCode, msgLongTime);
                    statusContextMap.put(partitionKey, statusWindow);
                } else {
                    statusWindow = statusContextMap.get(partitionKey);
                    statusWindow.addCurrent(nowStatusCode, msgLongTime);
                }

                intervalLongTime.putIfAbsent(partitionKey, msgLongTime);
                messageGroupMap.putIfAbsent(partitionKey, msgLongTime.toString());

                if (statusWindow.getCurrentStatusCode().equalsIgnoreCase("R")
                        && statusWindow.getPreviousStatusCode().equalsIgnoreCase("I")) {
                    // process start (IR)
                    String msgGroup = msgLongTime.toString(); // define group id
                    messageGroupMap.put(partitionKey, msgGroup);

                    intervalLongTime.put(partitionKey, statusWindow.getCurrentLongTime());

                }

                if (statusWindow.getCurrentStatusCode().equalsIgnoreCase("R")) {
                    // running (RR)
                    String msgGroup = messageGroupMap.get(partitionKey);

                    Long paramTime = statusWindow.getCurrentLongTime();

                    List<ParameterMaster> paramList = MasterCache.Parameter.get(partitionKey);
                    for (ParameterMaster paramInfo : paramList) {
                        if (paramInfo.getParamParseIndex() <= 0) continue;

                        String paramKey = partitionKey + ":" + paramInfo.getParameterRawId();

                        if (paramInfo.getDataType().equalsIgnoreCase("CONTINUOUS")) {
                            Double dValue = Double.parseDouble(recordColumns[paramInfo.getParamParseIndex()]);
                            kvContValueWindowStore.put(paramKey, dValue, paramTime);
                        } else {
                            String catValue = recordColumns[paramInfo.getParamParseIndex()];
                            kvCatValueWindowStore.put(paramKey, catValue, paramTime);
                        }
                    }

                    Long startTime = intervalLongTime.get(partitionKey);
                    Long interval = startTime + eventInfo.getFirst().getIntervalTimeMs();

                    if (paramTime >= interval) {

                        String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                        String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(paramTime));
                        log.trace("[{}] - processing interval from {} to {}.", partitionKey, sts, ets);

                        for (ParameterMaster paramMaster : paramList) {
                            if (paramMaster.getParamParseIndex() <= 0) continue;

                            String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

                            if(paramMaster.getDataType().equalsIgnoreCase("CONTINUOUS")){
                                WindowStoreIterator<Double> storeIterator = kvContValueWindowStore.fetch(paramKey, startTime, paramTime);
                                DescriptiveStatistics stats = new DescriptiveStatistics();
                                while (storeIterator.hasNext()) {
                                    KeyValue<Long, Double> kv = storeIterator.next();
                                    stats.addValue(kv.value);
                                }
                                storeIterator.close();

                                if(stats.getValues().length > 0){
                                    // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, group
                                    String summaryMsg = String.valueOf(startTime) + "," +
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
                                            msgGroup;

                                    context().forward(partitionKey, summaryMsg.getBytes(), "output-feature");
                                    context().commit();

                                    log.trace("[{}] - from : {}, end : {}, param : {} ",
                                            partitionKey, startTime, paramTime, paramMaster.getParameterName());
                                } else {
                                    log.debug("[{}] - skip {} because count is 0.", partitionKey, paramMaster.getParameterName());
                                }
                            }
                        }

                        intervalLongTime.put(partitionKey, paramTime);
                    }
                } else if (statusWindow.getCurrentStatusCode().equalsIgnoreCase("I")
                        && statusWindow.getPreviousStatusCode().equalsIgnoreCase("R")) {
                    // process end (RI)
                    String msgGroup = messageGroupMap.get(partitionKey);

                    Long startTime = intervalLongTime.get(partitionKey);
                    Long endTime = statusWindow.getPreviousLongTime();

                    String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                    String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(endTime));
                    log.trace("[{}] - processing interval from {} to {}.", partitionKey, sts, ets);

                    List<ParameterMaster> paramList = MasterCache.Parameter.get(partitionKey);
                    for (ParameterMaster paramMaster : paramList) {
                        if (paramMaster.getParamParseIndex() <= 0) continue;

                        String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

                        if(paramMaster.getDataType().equalsIgnoreCase("CONTINUOUS")){
                            WindowStoreIterator<Double> contStoreIterator = kvContValueWindowStore.fetch(paramKey, startTime, endTime);
                            DescriptiveStatistics stats = new DescriptiveStatistics();
                            while (contStoreIterator.hasNext()) {
                                KeyValue<Long, Double> kv = contStoreIterator.next();
                                stats.addValue(kv.value);
                            }
                            contStoreIterator.close();

                            if(stats.getValues().length > 0) {
                                // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, group
                                String summaryMsg = String.valueOf(startTime) + "," +
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
                                        msgGroup;

                                context().forward(partitionKey, summaryMsg.getBytes(), "output-feature");
                                context().commit();

                                log.trace("[{}] - aggregated. (from : {}, end : {}, param : {})",
                                        partitionKey, startTime, endTime, paramMaster.getParameterName());
                            } else {
                                log.debug("[{}] - skip {} because count is 0.", partitionKey, paramMaster.getParameterName());
                            }
                        } else {
                            // for dimensional
                            WindowStoreIterator<String> catStoreIterator = kvCatValueWindowStore.fetch(paramKey, startTime, endTime);
                            List<String> catDimensions = new ArrayList<>();
                            while (catStoreIterator.hasNext()) {
                                KeyValue<Long, String> kv = catStoreIterator.next();
                                if(!catDimensions.contains(kv.value)){
                                    catDimensions.add(kv.value);
                                }
                            }
                            catStoreIterator.close();

                            for(String dim : catDimensions){
                                String categoricalMsg = String.valueOf(startTime) + "," +
                                        String.valueOf(endTime) + "," +
                                        paramMaster.getParameterRawId() + "," +
                                        dim + "," +
                                        msgGroup;

                                context().forward(partitionKey, categoricalMsg.getBytes(), "output-dimension");
                                context().commit();

                                log.trace("[{}] - aggregated. (from : {}, end : {}, value : {})",
                                        paramKey, startTime, endTime, dim);
                            }
                        }
                    }
                } else {
                    // idle (II)
                    // refresh cache
                    if (refreshCacheFlagMap.get(partitionKey) != null
                            && refreshCacheFlagMap.get(partitionKey).equalsIgnoreCase("Y")) {
                        refreshMasterCache(partitionKey);
                        refreshCacheFlagMap.put(partitionKey, "N");
                    }
                }

                statusWindow.addPrevious(nowStatusCode, msgLongTime);
                statusContextMap.put(partitionKey, statusWindow);

            } else {
                // refresh cache
                if (refreshCacheFlagMap.get(partitionKey) != null
                        && refreshCacheFlagMap.get(partitionKey).equalsIgnoreCase("Y")) {
                    refreshMasterCache(partitionKey);
                    refreshCacheFlagMap.put(partitionKey, "N");
                }

                log.debug("[{}] - No event registered.", partitionKey);
            }
        } catch (Exception e) {
            log.debug("msg:{}", recordValue);
            log.error(e.getMessage(), e);
        }
    }

    private static Long parseStringToTimestamp(String item) {
        Long time = 0L;

        try {
            Date parsedDate = dateFormat.parse(item);
            Timestamp timestamp = new Timestamp(parsedDate.getTime());
            time = timestamp.getTime();
        } catch (Exception e) {
            log.error(e.getMessage() + " : " + item, e);
        }

        return time;
    }

    private void refreshMasterCache(String partitionKey) {
        // refresh master info.
        MasterCache.Equipment.refresh(partitionKey);
        MasterCache.EquipmentCondition.refresh(partitionKey);
        MasterCache.ExprParameter.refresh(partitionKey);
        MasterCache.IntervalEvent.refresh(partitionKey);
        MasterCache.Health.refresh(partitionKey);
        MasterCache.Mail.refresh(partitionKey);

        log.debug("[{}] - all master refreshed.", partitionKey);
    }
}
