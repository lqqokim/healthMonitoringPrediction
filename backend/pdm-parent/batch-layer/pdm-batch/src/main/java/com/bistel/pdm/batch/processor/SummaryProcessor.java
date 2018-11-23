//package com.bistel.pdm.batch.processor;
//
//import com.bistel.pdm.data.stream.ParameterMaster;
//import com.bistel.pdm.lambda.kafka.master.MasterCache;
//import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
//import org.apache.kafka.streams.KeyValue;
//import org.apache.kafka.streams.processor.AbstractProcessor;
//import org.apache.kafka.streams.processor.ProcessorContext;
//import org.apache.kafka.streams.processor.To;
//import org.apache.kafka.streams.state.WindowStore;
//import org.apache.kafka.streams.state.WindowStoreIterator;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.sql.Timestamp;
//import java.text.SimpleDateFormat;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//
//public class SummaryProcessor extends AbstractProcessor<String, String> {
//    private static final Logger log = LoggerFactory.getLogger(SummaryProcessor.class);
//    private final static String SEPARATOR = ",";
//
//    private final static String NEXT_OUT_FEATURE_STREAM_NODE = "output-feature";
//    private final static String NEXT_OUT_DIMENSION_STREAM_NODE = "output-dimension";
//
//
//    private WindowStore<String, Double> kvContValueWindowStore;
//    private WindowStore<String, String> kvCatValueWindowStore;
//
//    @Override
//    @SuppressWarnings("unchecked")
//    public void init(ProcessorContext processorContext) {
//        super.init(processorContext);
//
//        kvContValueWindowStore = (WindowStore) context().getStateStore("batch-cont-summary-store");
//        kvCatValueWindowStore = (WindowStore) context().getStateStore("batch-cat-summary-store");
//    }
//
//    @Override
//    public void process(String key, String record) {
//        //in : time, P1, P2, P3, P4, ... Pn,status,groupid
//        String[] columns = record.split(SEPARATOR, -1);
//
//        try {
//            List<ParameterMaster> paramList = MasterCache.Parameter.get(key);
//
//            // event end
//            if (columns[0].equalsIgnoreCase("END")) {
//
//                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//                Date startDate = dateFormat.parse(columns[1]);
//                Long startEpochTime = new Timestamp(startDate.getTime()).getTime();
//
//                Date endDate = dateFormat.parse(columns[2]);
//                Long endEpochTime = new Timestamp(endDate.getTime()).getTime();
//
//                for (ParameterMaster paramMaster : paramList) {
//                    if (paramMaster.getParamParseIndex() <= 0) continue;
//
//                    String paramKey = key + ":" + paramMaster.getParameterRawId();
//
//                    if (paramMaster.getDataType().equalsIgnoreCase("CONTINUOUS")) {
//                        WindowStoreIterator<Double> storeIterator =
//                                kvContValueWindowStore.fetch(paramKey, startEpochTime, endEpochTime);
//
//                        DescriptiveStatistics stats = new DescriptiveStatistics();
//                        while (storeIterator.hasNext()) {
//                            KeyValue<Long, Double> kv = storeIterator.next();
//                            if (!kv.value.isNaN()) {
//                                stats.addValue(kv.value);
//                            }
//                        }
//                        storeIterator.close();
//
//                        if (stats.getValues().length > 0) {
//                            // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, group
//                            String summaryMsg = String.valueOf(startEpochTime) + "," +
//                                    String.valueOf(endEpochTime) + "," +
//                                    paramMaster.getId() + "," +
//                                    stats.getValues().length + "," +
//                                    stats.getMin() + "," +
//                                    stats.getMax() + "," +
//                                    stats.getPercentile(50) + "," +
//                                    stats.getMean() + "," +
//                                    stats.getStandardDeviation() + "," +
//                                    stats.getPercentile(25) + "," +
//                                    stats.getPercentile(75) + "," +
//                                    startEpochTime;
//
//                            context().forward(key, summaryMsg.getBytes(), To.child(NEXT_OUT_FEATURE_STREAM_NODE));
//
//                        } else {
//                            log.debug("[{}] - skip {} because value is empty.", key, paramMaster.getParameterName());
//                        }
//                    } else {
//                        // for dimensional
//                        WindowStoreIterator<String> catStoreIterator =
//                                kvCatValueWindowStore.fetch(paramKey, startEpochTime, endEpochTime);
//
//                        List<String> catDimensions = new ArrayList<>();
//                        while (catStoreIterator.hasNext()) {
//                            KeyValue<Long, String> kv = catStoreIterator.next();
//                            if (!catDimensions.contains(kv.value)) {
//                                catDimensions.add(kv.value);
//                            }
//                        }
//                        catStoreIterator.close();
//
//                        for (String dim : catDimensions) {
//                            String categoricalMsg = String.valueOf(startEpochTime) + "," +
//                                    String.valueOf(endEpochTime) + "," +
//                                    paramMaster.getId() + "," +
//                                    dim + "," +
//                                    startEpochTime;
//
//                            context().forward(key, categoricalMsg.getBytes(), To.child(NEXT_OUT_DIMENSION_STREAM_NODE));
//                        }
//                    }
//                }
//                log.debug("[{}] - aggregated from ({} to {}).", key, columns[1], columns[2]);
//                context().commit();
//
//            } else {
//                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//                Date startDate = dateFormat.parse(columns[0]);
//                Long epochTime = new Timestamp(startDate.getTime()).getTime();
//
//                for (ParameterMaster paramInfo : paramList) {
//                    if (paramInfo.getParamParseIndex() <= 0) continue;
//
//                    String paramKey = key + ":" + paramInfo.getId();
//
//                    if (paramInfo.getDataTypeCode().equalsIgnoreCase("CONTINUOUS")) {
//                        String parsingValue = columns[paramInfo.getParamParseIndex()];
//
//                        if (parsingValue.length() > 0) {
//                            Double dValue = Double.parseDouble(parsingValue);
//                            kvContValueWindowStore.put(paramKey, dValue, epochTime);
//                        } else {
//                            kvContValueWindowStore.put(paramKey, Double.NaN, epochTime);
//                        }
//
//                    } else {
//                        String catValue = columns[paramInfo.getParamParseIndex()];
//                        kvCatValueWindowStore.put(paramKey, catValue, epochTime);
//                    }
//                }
//            }
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
//    }
//}
