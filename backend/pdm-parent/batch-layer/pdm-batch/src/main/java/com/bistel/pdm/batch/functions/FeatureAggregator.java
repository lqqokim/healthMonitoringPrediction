//package com.bistel.pdm.batch.functions;
//
//import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
//import org.apache.kafka.common.serialization.Serde;
//import org.apache.kafka.common.serialization.Serdes;
//import org.apache.kafka.streams.KeyValue;
//import org.apache.kafka.streams.kstream.*;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.sql.Timestamp;
//import java.util.ArrayList;
//import java.util.concurrent.TimeUnit;
//
///**
// *
// */
//public class FeatureAggregator {
//    private static final Logger log = LoggerFactory.getLogger(FeatureAggregator.class);
//
//
//    public static KStream<String, byte[]> build(final KStream<String, byte[]> streamRecord) {
//
//        final Serde<String> stringSerde = Serdes.String();
//        final Serde<Double> doubleSerde = Serdes.Double();
//
//        // key : param_mst_rawid
//        // value : param_mst_rawid, value, alarm_spec, warning_spec, event_dtts, rsd01~05
//        final KStream<String, Double> map = streamRecord.map((partitionKey, bytes) -> {
//            String value = new String(bytes);
//            String[] columns = value.split(",");
//
//            String paramRawId = columns[0];
//            String paramValue = columns[1];
//
//            String key = partitionKey + ":" + paramRawId;
//            return new KeyValue<>(key, Double.parseDouble(paramValue));
//        });
//
//        final TimeWindowedKStream<String, Double> timeWindowedKStream =
//                map.groupByKey(Serialized.with(stringSerde, doubleSerde))
//                        .windowedBy(TimeWindows.of(TimeUnit.MINUTES.toMillis(1)));
//
//        final KTable<Windowed<String>, Double> max_stats =
//                timeWindowedKStream.aggregate(() -> 0D, (s, aggValue, newValue) -> aggValue > newValue ? aggValue : newValue);
//
//        final KStream<String, byte[]> result = max_stats.toStream()
//                .map((stringWindowed, aggValue) -> {
//                    String[] keyColumns = stringWindowed.key().split(":");
//                    String partitionKey = keyColumns[0];
//                    String paramRawId = keyColumns[1];
//                    String dValue = String.valueOf(aggValue);
//
//                    // param_rawid, feature_rawid, param_name, feature_name, main_yn, aggregate_yn
//                    ArrayList<String[]> featureList = MasterDataCache.getInstance().getFeaturesByRawId(keyColumns[1]);
//
//                    String value = "";
//                    if (featureList != null) {
//                        for (String[] feature : featureList) {
//                            if (feature[2].equalsIgnoreCase("MAX")) {
//                                Timestamp timestamp = new Timestamp(System.currentTimeMillis());
//                                value = timestamp.getTime() + "," + paramRawId + "," + feature[0] + "," + dValue;
//                                break;
//                            }
//                        }
//                    } else {
//                        log.info("feature({}) does not existed.", keyColumns[1]);
//                    }
//
//                    log.debug("debug value : {}", value);
//                    return new KeyValue<>(partitionKey, value.getBytes());
//                });
//
//
////        final KTable<Windowed<String>, byte[]> stats =
////                timeWindowedKStream.aggregate(WindowStats::new,
////                        (k, v, windowStats) -> {
////                            String paramValue = new String(v);
////                            return windowStats.add(Double.parseDouble(paramValue));
////                        }).mapValues(windowStats -> {
////                    windowStats.compute();
////                    return windowStats.toString().getBytes();
////                });
////
////        final KStream<String, byte[]> result = stats.toStream()
////                .map((stringWindowed, bytes) -> {
////                    String[] keyColumns = stringWindowed.key().split(":");
////                    String partitionKey = keyColumns[0];
////                    String byteValue = new String(bytes);
////
////                    // param_rawid, feature_rawid, param_name, feature_name, main_yn, aggregate_yn
////                    String[] col = MasterDataCache.getInstance().getFeatureByRawId(keyColumns[1]);
////                    if (col.length > 0) {
////                        String value = col[1] + "," + byteValue; //feature_rawid, ...
////                        return new KeyValue<>(partitionKey, value.getBytes());
////                    }
////
////                    return new KeyValue<>(partitionKey, "".getBytes());
////                });
//
//        return result;
//    }
//}
