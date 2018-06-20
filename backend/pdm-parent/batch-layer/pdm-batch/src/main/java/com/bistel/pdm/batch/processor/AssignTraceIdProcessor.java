//package com.bistel.pdm.batch.processor;
//
//import com.bistel.pdm.common.collection.Pair;
//import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
//import org.apache.kafka.streams.processor.Processor;
//import org.apache.kafka.streams.processor.ProcessorContext;
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
//public class AssignTraceIdProcessor implements Processor<String, byte[]> {
//    private static final Logger log = LoggerFactory.getLogger(AssignTraceIdProcessor.class);
//
//    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//    private final static String SEPARATOR = ",";
//
//    private final static int DATA_TIME_IDX = 0;
//    private final static int PARAM_NAME_IDX = 4;
//    private final static int PARAM_VALUE_IDX = 5;
//
//    private ProcessorContext context;
//
//    @Override
//    public void init(ProcessorContext processorContext) {
//        this.context = processorContext;
//    }
//
//    @Override
//    public void process(String partitionKey, byte[] bytes) {
//        String value = new String(bytes);
//        String[] columns = value.split(SEPARATOR, -1);
//
//        // input message :
//        // 2018-04-27 08:49:00,
//        // fab1,
//        // Demo_Area,
//        // Demo1,
//        // Fan DE1 Acceleration,
//        // 0.1482648,
//        // 535:267 (rsd01)
//
//        //param_mst_rawid, value, alarm_spec, warning_spec, event_dtts, rsd01~05
//
//        String paramKey = partitionKey + ":" + columns[PARAM_NAME_IDX];
//        Long paramRawid = MasterDataCache.getInstance().getRawId(paramKey);
//        Pair<Float, Float> paramSpec = MasterDataCache.getInstance().getAlarmWarningSpec(paramRawid);
//
//        StringBuilder sbValue = new StringBuilder();
//
//        if (paramSpec == null) {
//            sbValue.append(paramRawid).append(",")
//                    .append(columns[PARAM_VALUE_IDX]).append(",") //value
//                    .append(",") //alarm
//                    .append(",") //warning
//                    .append(parseStringToTimestamp(columns[DATA_TIME_IDX])).append(",");
//        } else {
//            sbValue.append(paramRawid).append(",")
//                    .append(columns[PARAM_VALUE_IDX]).append(",") //value
//                    .append(paramSpec.getFirst()).append(",") //alarm
//                    .append(paramSpec.getSecond()).append(",") //warning
//                    .append(parseStringToTimestamp(columns[DATA_TIME_IDX])).append(",");
//        }
//
//        //rsd 01~05
//        if(columns.length > 6) {
//            sbValue.append(columns[6]).append(","); //location
//
//            if (columns.length > 7) {
//                sbValue.append(columns[7]).append(",");
//
//                if (columns.length > 8) {
//                    sbValue.append(columns[8]).append(",");
//
//                    if (columns.length > 9) {
//                        sbValue.append(columns[9]).append(",");
//
//                        if (columns.length > 10) {
//                            sbValue.append(columns[10]).append(",");
//                        }
//                    }
//                }
//            }
//        }
//
//        log.debug("key : {}, value : {}", paramKey, sbValue.toString());
//        context.forward(partitionKey, sbValue.toString().getBytes());
//        context.commit();
//    }
//
//    @Override
//    @Deprecated
//    public void punctuate(long l) {
//        // this method is deprecated and should not be used anymore
//    }
//
//    @Override
//    public void close() {
//        // close any resources managed by this processor
//        // Note: Do not close any StateStores as these are managed by the library
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
