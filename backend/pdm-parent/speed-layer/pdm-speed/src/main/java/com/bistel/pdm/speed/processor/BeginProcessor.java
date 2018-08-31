//package com.bistel.pdm.speed.processor;
//
//import org.apache.kafka.streams.processor.AbstractProcessor;
//import org.apache.kafka.streams.processor.ProcessorContext;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.text.SimpleDateFormat;
//
///**
// * start point on speed.
// */
//public class BeginProcessor extends AbstractProcessor<String, byte[]> {
//    private static final Logger log = LoggerFactory.getLogger(BeginProcessor.class);
//
//    @Override
//    public void init(ProcessorContext context) {
//        super.init(context);
//    }
//
//    @Override
//    public void process(String partitionKey, byte[] streamByteRecord) {
//        try {
////            String ts = new SimpleDateFormat("MM-dd HH:mm:ss.SSS").format(context().timestamp());
////            log.debug("[{}] - time : {}, partition : {}", partitionKey, ts, context().partition());
//            context().forward(partitionKey, streamByteRecord);
//            context().commit();
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
//    }
//}
