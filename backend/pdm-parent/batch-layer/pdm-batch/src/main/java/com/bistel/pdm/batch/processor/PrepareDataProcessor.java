//package com.bistel.pdm.batch.processor;
//
//import com.bistel.pdm.batch.function.StatusDefineFunction;
//import com.bistel.pdm.data.stream.EventMaster;
//import com.bistel.pdm.lambda.kafka.master.MasterCache;
//import org.apache.kafka.streams.processor.AbstractProcessor;
//import org.apache.kafka.streams.processor.ProcessorContext;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.sql.Timestamp;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.List;
//import java.util.concurrent.ExecutionException;
//
///**
// *
// */
//public class PrepareDataProcessor extends AbstractProcessor<String, byte[]> {
//    private static final Logger log = LoggerFactory.getLogger(PrepareDataProcessor.class);
//
//    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//    private final static String SEPARATOR = ",";
//
//    private final StatusDefineFunction statusDefineFunction = new StatusDefineFunction();
//
//    @Override
//    @SuppressWarnings("unchecked")
//    public void init(ProcessorContext processorContext) {
//        super.init(processorContext);
//    }
//
//    @Override
//    public void process(String partitionKey, byte[] streamByteRecord) {
//        String recordValue = new String(streamByteRecord);
//        String[] recordColumns = recordValue.split(SEPARATOR, -1);
//
//        try {
//            // filter by master
//            if (MasterCache.Equipment.get(partitionKey) == null) {
//                log.debug("[{}] - Not existed.", partitionKey);
//                context().commit();
//                return;
//            }
//
//            List<EventMaster> eventList = MasterCache.Event.get(partitionKey);
//            if (eventList != null && eventList.size() > 0) {
//                for (EventMaster eventInfo : eventList) {
//
//                    // for process interval
//                    if (eventInfo.getProcessYN().equalsIgnoreCase("Y")
//                            && eventInfo.getEventTypeCD().equalsIgnoreCase("S")) {
//
//                        String appendMsg = statusDefineFunction.make(partitionKey, eventInfo, recordColumns);
//
//                        // time, P1, P2, P3, ... Pn, status:time, groupid, refresh flag
//                        recordValue = recordValue + "," + appendMsg;
//                        context().forward(partitionKey, recordValue.getBytes());
//                        context().commit();
//                        break;
//                    }
//                }
//            } else {
//
//                // refresh cache
//                if (recordColumns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
//                    refreshMasterCache(partitionKey);
//                }
//
//                Long msgLongTime = parseStringToTimestamp(recordColumns[0]);
//
//                // No event registered.
//                String statusContext = "II:" + msgLongTime;
//
//                // time, P1, P2, P3, ... Pn, status:time, groupid, refresh flag
//                recordValue = recordValue + "," + statusContext + "," + "I" + ",";
//                context().forward(partitionKey, recordValue.getBytes());
//                context().commit();
//
//                log.debug("[{}] - No event registered.", partitionKey);
//            }
//        } catch (Exception e) {
//            log.debug("msg:{}", recordValue);
//            log.error(e.getMessage(), e);
//        }
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
//
//    private void refreshMasterCache(String partitionKey) throws ExecutionException {
//        // refresh master info.
//        MasterCache.Equipment.refresh(partitionKey);
//        MasterCache.EquipmentCondition.refresh(partitionKey);
//        MasterCache.ExprParameter.refresh(partitionKey);
//        MasterCache.Event.refresh(partitionKey);
//        MasterCache.Health.refresh(partitionKey);
//        MasterCache.Mail.refresh(partitionKey);
//    }
//}
