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

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

        try {
            // refresh cache
            if (recordColumns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
                refreshCacheFlagMap.put(partitionKey, "Y");
                context().commit();
                log.debug("[{}] - Refresh Order were issued.", partitionKey);
                return;
            }

            // filter by master
            if (MasterCache.Equipment.get(partitionKey) == null) {
                log.debug("[{}] - Not existed.", partitionKey);
                context().commit();
                return;
            }

            Pair<EventMaster, EventMaster> eventInfo = MasterCache.IntervalEvent.get(partitionKey);
            if (eventInfo != null && eventInfo.getFirst() != null && eventInfo.getFirst().getParamParseIndex() != null) {

                Date parsedDate = dateFormat.parse(recordColumns[0]);
                Long nowMessageTime = new Timestamp(parsedDate.getTime()).getTime();

                String nowStatusCode = "I";

                String strValue = recordColumns[eventInfo.getFirst().getParamParseIndex()];
                if (strValue.length() > 0) {
                    double statusValue = Double.parseDouble(strValue);
                    nowStatusCode = statusDefineFunction.evaluateStatusCode(eventInfo.getFirst(), statusValue);
                }

                StatusWindow statusWindow;
                if (statusContextMap.get(partitionKey) == null) {
                    statusWindow = new StatusWindow();
                    statusWindow.addPrevious(nowStatusCode, nowMessageTime);
                    statusWindow.addCurrent(nowStatusCode, nowMessageTime);
                    statusContextMap.put(partitionKey, statusWindow);
                } else {
                    statusWindow = statusContextMap.get(partitionKey);
                    statusWindow.addCurrent(nowStatusCode, nowMessageTime);
                }

                intervalLongTime.putIfAbsent(partitionKey, nowMessageTime);
                messageGroupMap.putIfAbsent(partitionKey, nowMessageTime.toString());

                log.debug("[{}] - status:{}, partition:{}, offset:{}", partitionKey,
                        statusWindow.getCurrentStatusCode(), context().partition(), context().offset());

                if (statusWindow.getCurrentStatusCode().equalsIgnoreCase("R")
                        && statusWindow.getPreviousStatusCode().equalsIgnoreCase("I")) {
                    log.debug("[{}] process started.", partitionKey);
                    // process start (IR)
                    String msgGroup = nowMessageTime.toString(); // define group id
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
                            String parsingValue = recordColumns[paramInfo.getParamParseIndex()];

                            if(parsingValue.length() > 0){
                                Double dValue = Double.parseDouble(parsingValue);
                                kvContValueWindowStore.put(paramKey, dValue, paramTime);
                            } else {
                                kvContValueWindowStore.put(paramKey, Double.NaN, paramTime);
                            }

                        } else {
                            String catValue = recordColumns[paramInfo.getParamParseIndex()];
                            kvCatValueWindowStore.put(paramKey, catValue, paramTime);
                        }
                    }

                    if(eventInfo.getFirst().getTimeIntervalYn().equalsIgnoreCase("Y")){

                        Long startTime = intervalLongTime.get(partitionKey);
                        Long interval = startTime + eventInfo.getFirst().getIntervalTimeMs();

                        if (paramTime >= interval) {

                            String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                            String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(paramTime));

                            for (ParameterMaster paramMaster : paramList) {
                                if (paramMaster.getParamParseIndex() <= 0) continue;

                                String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

                                if(paramMaster.getDataType().equalsIgnoreCase("CONTINUOUS")){
                                    WindowStoreIterator<Double> storeIterator = kvContValueWindowStore.fetch(paramKey, startTime, paramTime);
                                    DescriptiveStatistics stats = new DescriptiveStatistics();
                                    while (storeIterator.hasNext()) {
                                        KeyValue<Long, Double> kv = storeIterator.next();
                                        if(!kv.value.isNaN()){
                                            stats.addValue(kv.value);
                                        }
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
//                                        context().commit();

                                    } else {
                                        log.debug("[{}] - skip {} because value is empty.",
                                                partitionKey, paramMaster.getParameterName());
                                    }
                                } else {
                                    // for dimensional
                                    WindowStoreIterator<String> catStoreIterator = kvCatValueWindowStore.fetch(paramKey, startTime, paramTime);
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
                                                String.valueOf(paramTime) + "," +
                                                paramMaster.getParameterRawId() + "," +
                                                dim + "," +
                                                msgGroup;

                                        context().forward(partitionKey, categoricalMsg.getBytes(), "output-dimension");
//                                        context().commit();
                                    }
                                }
                            }
                            log.debug("[{}] - aggregated interval ({} to {}).",
                                    partitionKey, sts, ets);

                            intervalLongTime.put(partitionKey, paramTime);
                        }
                    }

                } else if (statusWindow.getCurrentStatusCode().equalsIgnoreCase("I")
                        && statusWindow.getPreviousStatusCode().equalsIgnoreCase("R")) {
                    // process end (RI)
                    String msgGroup = messageGroupMap.get(partitionKey);

                    Long startTime = intervalLongTime.get(partitionKey);
                    Long endTime = statusWindow.getPreviousLongTime();

                    String sts = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(startTime));
                    String ets = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(new Timestamp(endTime));

                    List<ParameterMaster> paramList = MasterCache.Parameter.get(partitionKey);
                    for (ParameterMaster paramMaster : paramList) {
                        if (paramMaster.getParamParseIndex() <= 0) continue;

                        String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

                        if(paramMaster.getDataType().equalsIgnoreCase("CONTINUOUS")){
                            WindowStoreIterator<Double> contStoreIterator = kvContValueWindowStore.fetch(paramKey, startTime, endTime);
                            DescriptiveStatistics stats = new DescriptiveStatistics();
                            while (contStoreIterator.hasNext()) {
                                KeyValue<Long, Double> kv = contStoreIterator.next();
                                if(!kv.value.isNaN()){
                                    stats.addValue(kv.value);
                                }
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
//                                context().commit();

                            } else {
                                log.debug("[{}] - skip {} because value is empty.",
                                        partitionKey, paramMaster.getParameterName());
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
//                                context().commit();
                            }
                        }
                    }

                    log.debug("[{}] - aggregated interval ({} to {}).",
                            partitionKey, sts, ets);
                } else {
                    // idle (II)
                    // refresh cache
                    if (refreshCacheFlagMap.get(partitionKey) != null
                            && refreshCacheFlagMap.get(partitionKey).equalsIgnoreCase("Y")) {
                        refreshMasterCache(partitionKey);
                        refreshCacheFlagMap.put(partitionKey, "N");
                    }
                }

                statusWindow.addPrevious(nowStatusCode, nowMessageTime);
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

            context().commit();

        } catch (Exception e) {
            log.debug("[{}] - {}", partitionKey, recordValue);
            log.error(e.getMessage(), e);
        }
    }

    private void refreshMasterCache(String partitionKey) {
        // refresh master info.
        try {
            MasterCache.Equipment.refresh(partitionKey);
            MasterCache.IntervalEvent.refresh(partitionKey);
            MasterCache.Parameter.refresh(partitionKey);
            MasterCache.ParameterWithSpec.refresh(partitionKey);
            MasterCache.EquipmentCondition.refresh(partitionKey);
            MasterCache.ExprParameter.refresh(partitionKey);
            MasterCache.Health.refresh(partitionKey);
            MasterCache.Mail.refresh(partitionKey);

            log.debug("[{}] - all cache refreshed.", partitionKey);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
