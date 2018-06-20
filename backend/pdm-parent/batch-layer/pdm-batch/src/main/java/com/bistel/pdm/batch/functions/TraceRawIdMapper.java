//package com.bistel.pdm.batch.functions;
//
//import com.bistel.pdm.common.collection.Pair;
//import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
//import org.apache.kafka.streams.KeyValue;
//import org.apache.kafka.streams.kstream.KStream;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.sql.Timestamp;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//
///**
// *
// */
//public class TraceRawIdMapper {
//    private static final Logger log = LoggerFactory.getLogger(TraceRawIdMapper.class);
//
//    private final static String SEPARATOR = ",";
//
//    private final static int DATA_TIME_IDX = 0;
//    private final static int PARAM_NAME_IDX = 4;
//    private final static int PARAM_VALUE_IDX = 5;
//
//    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//
//    public static KStream<String, byte[]> build(final KStream<String, byte[]> streamRecord) {
//        return streamRecord.map((partitionKey, bytes) -> {
//            String value = new String(bytes);
//            String[] columns = value.split(SEPARATOR, -1);
//
//            // input message :
//            // 2018-04-27 08:49:00,
//            // fab1,
//            // Demo_Area,
//            // Demo1,
//            // Fan DE1 Acceleration,
//            // 0.1482648,
//            // 535:267 (rsd01)
//
//            //param_mst_rawid, value, alarm_spec, warning_spec, event_dtts, rsd01~05
//
//            String paramKey = partitionKey + ":" + columns[PARAM_NAME_IDX];
//            Long paramRawid = MasterDataCache.getInstance().getRawId(paramKey);
//            Pair<Float, Float> paramSpec = MasterDataCache.getInstance().getAlarmWarningSpec(paramRawid);
//
//            StringBuilder sbValue = new StringBuilder();
//
//            if (paramSpec == null) {
//                sbValue.append(paramRawid).append(",")
//                        .append(columns[PARAM_VALUE_IDX]).append(",") //value
//                        .append(",") //alarm
//                        .append(",") //warning
//                        .append(parseStringToTimestamp(columns[DATA_TIME_IDX])).append(",");
//            } else {
//                sbValue.append(paramRawid).append(",")
//                        .append(columns[PARAM_VALUE_IDX]).append(",") //value
//                        .append(paramSpec.getFirst()).append(",") //alarm
//                        .append(paramSpec.getSecond()).append(",") //warning
//                        .append(parseStringToTimestamp(columns[DATA_TIME_IDX])).append(",");
//            }
//
//            //rsd 01~05
//            if(columns.length > 6) {
//                sbValue.append(columns[6]).append(","); //location
//
//                if (columns.length > 7) {
//                    sbValue.append(columns[7]).append(",");
//
//                    if (columns.length > 8) {
//                        sbValue.append(columns[8]).append(",");
//
//                        if (columns.length > 9) {
//                            sbValue.append(columns[9]).append(",");
//
//                            if (columns.length > 10) {
//                                sbValue.append(columns[10]).append(",");
//                            }
//                        }
//                    }
//                }
//            }
//
//            log.debug("key : {}, value : {}", paramKey, sbValue.toString());
//            return new KeyValue<>(partitionKey, sbValue.toString().getBytes());
//        });
//    }
//
//    private static Long parseStringToTimestamp(String item) {
//        Long time = 0L;
//
//        try {
//            Date parsedDate = dateFormat.parse(item);
//            Timestamp timestamp = new Timestamp(parsedDate.getTime());
//            time = timestamp.getTime();
//        } catch (Exception e) {
//            log.error(e.getMessage() + " : " + item, e);
//        }
//
//        return time;
//    }
//}
