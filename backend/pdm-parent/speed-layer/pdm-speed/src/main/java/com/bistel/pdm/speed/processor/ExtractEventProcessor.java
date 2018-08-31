//package com.bistel.pdm.speed.processor;
//
//import com.bistel.pdm.data.stream.EventMaster;
//import com.bistel.pdm.lambda.kafka.master.MasterCache;
//import org.apache.kafka.streams.processor.AbstractProcessor;
//import org.apache.kafka.streams.processor.ProcessorContext;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.util.concurrent.ExecutionException;
//
///**
// *
// */
//public class ExtractEventProcessor extends AbstractProcessor<String, byte[]> {
//    private static final Logger log = LoggerFactory.getLogger(ExtractEventProcessor.class);
//
//    private final static String SEPARATOR = ",";
//
//    @Override
//    public void init(ProcessorContext processorContext) {
//        super.init(processorContext);
//    }
//
//    @Override
//    public void process(String partitionKey, byte[] streamByteRecord) {
//        String recordValue = new String(streamByteRecord);
//        // time, P1, P2, P3, ... Pn, status:time, groupid, refresh flag
//        // 2018-08-28 09:43:19.905,1022,949,0,1537,15,23,-42,-5,0,RI:1535416999905,1535416999905,
//        String[] recordColumns = recordValue.split(SEPARATOR, -1);
//
//        try {
//            String statusCodeAndTime = recordColumns[recordColumns.length - 3];
//            String[] statusCodeAndLongTime = statusCodeAndTime.split(":");
//
//            // extract event
//            if (statusCodeAndLongTime[0].equalsIgnoreCase("IR")) {
//                // event started.
//                EventMaster event = getEvent(partitionKey, "S");
//                String eventMessage =
//                        statusCodeAndLongTime[1] + ","
//                                + event.getEventRawId() + ","
//                                + event.getEventTypeCD();
//
//                log.info("[{}] - process started.", partitionKey);
//                context().forward(partitionKey, eventMessage.getBytes());
//                context().commit();
//
//            } else if (statusCodeAndLongTime[0].equalsIgnoreCase("RI")) {
//                // event ended.
//                EventMaster event = getEvent(partitionKey, "E");
//                String eventMessage =
//                        statusCodeAndLongTime[1] + ","
//                                + event.getEventRawId() + ","
//                                + event.getEventTypeCD();
//
//                log.info("[{}] - process ended.", partitionKey);
//                context().forward(partitionKey, eventMessage.getBytes());
//                context().commit();
//            }
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
//    }
//
//    private EventMaster getEvent(String key, String type) throws ExecutionException {
//        EventMaster e = null;
//        for (EventMaster event : MasterCache.Event.get(key)) {
//            if (event.getProcessYN().equalsIgnoreCase("Y")
//                    && event.getEventTypeCD().equalsIgnoreCase(type)) {
//                e = event;
//                break;
//            }
//        }
//
//        return e;
//    }
//}
