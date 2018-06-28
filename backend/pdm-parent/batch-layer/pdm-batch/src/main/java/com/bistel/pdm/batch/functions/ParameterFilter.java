//package com.bistel.pdm.batch.functions;
//
//import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
//import org.apache.kafka.streams.kstream.KStream;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
///**
// *
// */
//public class ParameterFilter {
//    private static final Logger log = LoggerFactory.getLogger(ParameterFilter.class);
//
//    private final static int PARAM_NAME_IDX = 4;
//    private final static String SEPARATOR = ",";
//
//    public static KStream<String, byte[]> build(final KStream<String, byte[]> streamRecord) {
//        return streamRecord.filter((partitionKey, byteData) -> {
//            String value = new String(byteData);
//            String[] columns = value.split(SEPARATOR);
//
//            String paramKey = partitionKey + ":" + columns[PARAM_NAME_IDX];
//
//            if (!MasterDataCache.getInstance().getMasterContainsKey(paramKey)) {
//                log.info("{} does not existed.", paramKey);
//            }
//
//            //Collect only the data that matches the registered master.
//            return MasterDataCache.getInstance().getMasterContainsKey(paramKey);
//        });
//    }
//}
