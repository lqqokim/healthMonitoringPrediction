//package com.bistel.pdm.batch.processor;
//
//import com.bistel.pdm.lambda.kafka.master.MasterCache;
//import org.apache.kafka.streams.processor.AbstractProcessor;
//import org.apache.kafka.streams.processor.ProcessorContext;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
///**
// * Filter by master info.
// */
//public class FilterByMasterProcessor extends AbstractProcessor<String, byte[]> {
//    private static final Logger log = LoggerFactory.getLogger(FilterByMasterProcessor.class);
//
//    @Override
//    public void init(ProcessorContext context) {
//        super.init(context);
//    }
//
//    @Override
//    public void process(String partitionKey, byte[] streamByteRecord) {
//        try {
//            if (MasterCache.Equipment.get(partitionKey) == null) {
//                log.info("[{}] - Not existed.", partitionKey);
//            } else {
//                context().forward(partitionKey, streamByteRecord);
//            }
//
//            context().commit();
//
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
//    }
//}
