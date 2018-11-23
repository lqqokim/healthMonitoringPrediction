//package com.bistel.pdm.speed.processor;
//
//import com.bistel.pdm.common.collection.Pair;
//import com.bistel.pdm.data.stream.EventMaster;
//import com.bistel.pdm.lambda.kafka.master.MasterCache;
//import org.apache.kafka.streams.processor.AbstractProcessor;
//import org.apache.kafka.streams.processor.ProcessorContext;
//import org.apache.kafka.streams.processor.To;
//import org.apache.kafka.streams.state.KeyValueStore;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.sql.Timestamp;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//
//public class EventProcessor extends AbstractProcessor<String, String> {
//    private static final Logger log = LoggerFactory.getLogger(EventProcessor.class);
//    private final static String SEPARATOR = ",";
//
//    private final static String NEXT_STREAM_NODE = "BranchProcessor";
//    private final static String NEXT_OUT_EVENT_STREAM_NODE = "output-event";
//
//    private KeyValueStore<String, String> kvStatusContextStore;
//    private KeyValueStore<String, String> kvRecordGroupStore;
//
//    @Override
//    @SuppressWarnings("unchecked")
//    public void init(ProcessorContext processorContext) {
//        super.init(processorContext);
//
//        kvStatusContextStore = (KeyValueStore) context().getStateStore("speed-status-context-store");
//        kvRecordGroupStore = (KeyValueStore) context().getStateStore("speed-record-group-store");
//    }
//
//    @Override
//    public void process(String key, String record) {
//        String[] columns = record.split(SEPARATOR, -1);
//
//        try {
//            String nowStatusTime = columns[0];
//            String nowStatusCode = columns[columns.length - 1];
//
//            kvStatusContextStore.putIfAbsent(key, columns[0] + "," + columns[columns.length - 1]);
//            kvRecordGroupStore.putIfAbsent(key, nowStatusTime);
//
//            String[] statusContext = kvStatusContextStore.get(key).split(",");
//            String prevStatusTime = statusContext[0];
//            String prevStatusCode = statusContext[1];
//
//            Pair<EventMaster, EventMaster> eventInfo = MasterCache.IntervalEvent.get(key);
//
//            if (nowStatusCode.equalsIgnoreCase("R")
//                    && eventInfo.getFirst().getTimeIntervalYn().equalsIgnoreCase("Y")) {
//
//                String originalStartTime = kvRecordGroupStore.get(key);
//
//                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//
//                Date originStartDate = dateFormat.parse(originalStartTime);
//                Timestamp originStartTime = new Timestamp(originStartDate.getTime());
//                Long interval = originStartTime.getTime() + eventInfo.getFirst().getIntervalTimeMs();
//
//                Date nowMsgDate = dateFormat.parse(nowStatusTime);
//                Timestamp nowEpochTime = new Timestamp(nowMsgDate.getTime());
//
//                if (nowEpochTime.getTime() >= interval) {
//
//                    // event ended. ------------------------------------------
//                    String eventMsg = prevStatusTime + ","
//                            + eventInfo.getSecond().getEventRawId() + ","
//                            + eventInfo.getSecond().getEventTypeCD();
//
//                    log.info("[{}] - {} process ended.", key, prevStatusTime);
//                    context().forward(key, eventMsg.getBytes(), To.child(NEXT_OUT_EVENT_STREAM_NODE));
//                    // event ended. ------------------------------------------
//
//                    String nextMessage = "END," + originalStartTime + "," + prevStatusTime;
//                    context().forward(key, nextMessage, To.child(NEXT_STREAM_NODE));
//
//                    // event started. ----------------------------------------
//                    eventMsg = nowStatusTime + ","
//                            + eventInfo.getFirst().getEventRawId() + ","
//                            + eventInfo.getFirst().getEventTypeCD();
//
//                    log.info("[{}] - {} process started.", key, nowStatusTime);
//                    context().forward(key, eventMsg.getBytes(), To.child(NEXT_OUT_EVENT_STREAM_NODE));
//                    // event started. ----------------------------------------
//
//                    kvRecordGroupStore.put(key, nowStatusTime);
//                }
//            }
//
//            if (prevStatusCode.equalsIgnoreCase("I")
//                    && nowStatusCode.equalsIgnoreCase("R")) {
//                // process start (IR)
//
//                kvRecordGroupStore.put(key, nowStatusTime);
//
//                // event started. ------------------------------------------
//                String eventMsg =
//                        nowStatusTime + ","
//                                + eventInfo.getFirst().getEventRawId() + ","
//                                + eventInfo.getFirst().getEventTypeCD();
//
//                log.info("[{}] - {} process started.", key, nowStatusTime);
//                context().forward(key, eventMsg.getBytes(), To.child(NEXT_OUT_EVENT_STREAM_NODE));
//                // event started. ------------------------------------------
//
//            } else if (prevStatusCode.equalsIgnoreCase("R")
//                    && nowStatusCode.equalsIgnoreCase("I")) {
//                // process end (RI)
//
//                String startEventTime = kvRecordGroupStore.get(key);
//
//                // event ended. ------------------------------------------
//                String eventMsg =
//                        prevStatusTime + ","
//                                + eventInfo.getSecond().getEventRawId() + ","
//                                + eventInfo.getSecond().getEventTypeCD();
//
//                log.info("[{}] - {} process ended.", key, prevStatusTime);
//                context().forward(key, eventMsg.getBytes(), To.child(NEXT_OUT_EVENT_STREAM_NODE));
//                // event ended. ------------------------------------------
//
//                String nextMessage = "END," + startEventTime + "," + prevStatusTime;
//                context().forward(key, nextMessage, To.child(NEXT_STREAM_NODE));
//
//            }
//
//            kvStatusContextStore.put(key, nowStatusTime + "," + nowStatusCode);
//
//            if (nowStatusCode.equalsIgnoreCase("R")) {
//                // time, P1, P2, P3, P4, ... Pn,status, +groupid
//                String eventStartDtts = kvRecordGroupStore.get(key);
//                String nextMessage = record + "," + eventStartDtts;
//                context().forward(key, nextMessage, To.child(NEXT_STREAM_NODE));
//            } else {
//                // time, P1, P2, P3, P4, ... Pn,status, +groupid
//                String nextMessage = record + "," + nowStatusTime;
//                context().forward(key, nextMessage, To.child(NEXT_STREAM_NODE));
//            }
//
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
//    }
//}
