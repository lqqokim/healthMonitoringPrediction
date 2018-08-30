package com.bistel.pdm.speed.processor;

import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.expression.RuleEvaluator;
import com.bistel.pdm.expression.RuleVariables;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;

/**
 *
 */
public class PrepareDataProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(PrepareDataProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private KeyValueStore<String, String> kvStatusContextStore;

    private final static String SEPARATOR = ",";

    private final ConcurrentHashMap<String, String> messageGroupMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> cacheRefreshFlagMap = new ConcurrentHashMap<>();

//    private final Timer timer = new Timer();

//    private final static ConcurrentHashMap<String, MessageExtended> TimeOutOffset = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvStatusContextStore = (KeyValueStore) this.context().getStateStore("speed-status-context");

//        // If you no longer receive messages, processing it as idle.
//        timer.scheduleAtFixedRate(new TimerTask() {
//            @Override
//            public void run() {
//                try {
//                    while (TimeOutOffset.keys().hasMoreElements()) {
//                        String key = TimeOutOffset.keys().nextElement();
//                        MessageExtended msgExtended = TimeOutOffset.get(key);
//
//                        List<EventMaster> eventList = MasterCache.Event.get(key);
//                        for (EventMaster event : eventList) {
//                            // for process interval
//                            if (event.getProcessYN().equalsIgnoreCase("Y")) {
//                                if (event.getTimeoutMs() != null && event.getTimeoutMs() > 3600000) { // > 1h
//                                    Long timeoutMs = event.getTimeoutMs();
//                                    long diffInMillies = Math.abs(System.currentTimeMillis() - msgExtended.getLongTime());
//
//                                    // time out
//                                    if (diffInMillies > timeoutMs) {
//                                        // time, P1, P2, P3, P4, ... Pn, now status:time, prev status:time, groupid, refresh flag
//                                        String msg = System.currentTimeMillis() + "," +
//                                                msgExtended.getCurrentStatus() + "," +
//                                                msgExtended.getPreviousStatus() + "," +
//                                                "idle" + ",";
//
//                                        context().forward(key, msg.getBytes());
//                                        // commit the current processing progress
//                                        context().commit();
//                                    }
//                                }
//                            }
//                        }
//                    }
//                } catch (Exception e) {
//                    log.error(e.getMessage(), e);
//                }
//            }
//        }, 0, TimeUnit.MINUTES.toMillis(1));


//        context().schedule(60000, PunctuationType.STREAM_TIME, (timestamp) -> {
//            try {
//                while(TimeOutOffset.keys().hasMoreElements()){
//                    String key = TimeOutOffset.keys().nextElement();
//                    MessageExtended msgExtended = TimeOutOffset.get(key);
//
//                    List<EventMaster> eventList = MasterCache.Event.get(key);
//                    for (EventMaster event : eventList) {
//                        // for process interval
//                        if (event.getProcessYN().equalsIgnoreCase("Y")) {
//                            if(event.getTimeoutMs() != null && event.getTimeoutMs() > 3600000){ // > 1h
//                                Long timeoutMs = event.getTimeoutMs();
//                                long diffInMillies = Math.abs(System.currentTimeMillis() - msgExtended.getLongTime());
//
//                                // time out
//                                if(diffInMillies > timeoutMs){
//                                    // time, P1, P2, P3, P4, ... Pn, now status:time, prev status:time, groupid, refresh flag
//                                    String msg = System.currentTimeMillis() + "," +
//                                            msgExtended.getCurrentStatus() + "," +
//                                            msgExtended.getPreviousStatus() + "," +
//                                            "idle" + ",";
//
//                                    context().forward(key, msg.getBytes());
//                                    // commit the current processing progress
//                                    context().commit();
//                                }
//                            }
//                        }
//                    }
//                }
//            } catch (Exception e){
//                log.error(e.getMessage(), e);
//            }
//        });
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR, -1);

        try {
            // refresh cache command
            if (recordColumns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
                cacheRefreshFlagMap.put(partitionKey, "Y");
            }

            // filter by master
            if (MasterCache.Equipment.get(partitionKey) == null) {
                log.debug("[{}] - Not existed.", partitionKey);
                context().commit();
                return;
            }

            Long msgTimeStamp = parseStringToTimestamp(recordColumns[0]);

            List<EventMaster> eventList = MasterCache.Event.get(partitionKey);
            if (eventList != null && eventList.size() > 0) {

                for (EventMaster event : eventList) {
                    // for process interval
                    if (event.getProcessYN().equalsIgnoreCase("Y")
                            && event.getEventTypeCD().equalsIgnoreCase("S")) {

                        double paramValue = Double.parseDouble(recordColumns[event.getParamParseIndex()]);

                        String statusContext = appendStatusContext(partitionKey, msgTimeStamp, event, paramValue);

                        // time, P1, P2, P3, P4, ... Pn, now status:time, prev status:time, groupid, refresh flag
                        recordValue = recordValue + "," + statusContext;
                        context().forward(partitionKey, recordValue.getBytes());
                        context().commit();

//                        TimeOutOffset.put(partitionKey, new MessageExtended(msgTimeStamp, statusContext));
                        //log.debug("[{}] - {}", partitionKey, recordValue);
                        break;
                    }
                }
            } else {
                // refresh cache
                if (cacheRefreshFlagMap.get(partitionKey) != null &&
                        cacheRefreshFlagMap.get(partitionKey).equalsIgnoreCase("Y")) {

                    refreshMasterCache(partitionKey);
                    cacheRefreshFlagMap.put(partitionKey, "N");
                }

                // No event registered.
                String statusCode = "I";
                String statusCodeAndTime = statusCode + ":" + msgTimeStamp;
                String statusContext = statusCodeAndTime + "," + statusCodeAndTime + "," + "idle" + ",";

                // time, P1, P2, P3, P4, ... Pn, now status:time, prev status:time, groupid, refresh flag
                recordValue = recordValue + "," + statusContext;
                context().forward(partitionKey, recordValue.getBytes());
                context().commit();

//                TimeOutOffset.put(partitionKey, new MessageExtended(msgTimeStamp, statusContext));
                log.debug("[{}] - No event registered.", partitionKey);
            }
        } catch (Exception e) {
            log.debug("msg:{}", recordValue);
            log.error(e.getMessage(), e);
        }
    }

    private String appendStatusContext(String partitionKey, Long msgTimeStamp, EventMaster event, double paramValue) {
        String extendMessage;

        String nowStatusCode = "I";
        RuleVariables ruleVariables = new RuleVariables();
        ruleVariables.putValue("value", paramValue);
        RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
        boolean isRun = ruleEvaluator.evaluate(event.getCondition());

        if (isRun) {
            nowStatusCode = "R";
        }

        //------
        String statusCodeAndTime = nowStatusCode + ":" + msgTimeStamp;
        String prevStatusAndTime;

        if (kvStatusContextStore.get(partitionKey) == null) {
            kvStatusContextStore.put(partitionKey, statusCodeAndTime);
            prevStatusAndTime = statusCodeAndTime;
        } else {
            prevStatusAndTime = kvStatusContextStore.get(partitionKey);
        }

        kvStatusContextStore.put(partitionKey, statusCodeAndTime);
        extendMessage = statusCodeAndTime + "," + prevStatusAndTime + ",";

        String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");
        String prevStatusCode = prevStatusCodeAndTime[0];

        // process start
        if (nowStatusCode.equalsIgnoreCase("R")
                && prevStatusCode.equalsIgnoreCase("I")) {

            // define group id
            String msgGroup = msgTimeStamp.toString();
            messageGroupMap.put(partitionKey, msgGroup);

            extendMessage = extendMessage + msgGroup + ",";

        } else if (nowStatusCode.equalsIgnoreCase("R")){
            String msgGroup = messageGroupMap.computeIfAbsent(partitionKey, k -> msgTimeStamp.toString());
            // define group id
            extendMessage = extendMessage + msgGroup + ",";
        }

        if (nowStatusCode.equalsIgnoreCase("I")) {

            if (prevStatusCode.equalsIgnoreCase("R")) {
                String msgGroup = messageGroupMap.computeIfAbsent(partitionKey, k -> msgTimeStamp.toString());
                // define group id
                extendMessage = extendMessage + msgGroup + ",";
            } else {
                extendMessage = extendMessage + "idle" + ",";
            }

            // append cache refresh flag.
            if (cacheRefreshFlagMap.get(partitionKey) != null &&
                    cacheRefreshFlagMap.get(partitionKey).equalsIgnoreCase("Y")) {

                extendMessage = extendMessage + "CRC"; //CMD-REFRESH-CACHE
                cacheRefreshFlagMap.put(partitionKey, "N");
                log.debug("[{}] - append cache-refresh flag.", partitionKey);
            }
        }

        return extendMessage;
    }

    private static Long parseStringToTimestamp(String item) {
        Long time = 0L;

        try {
            Date parsedDate = dateFormat.parse(item);
            Timestamp timestamp = new Timestamp(parsedDate.getTime());
            time = timestamp.getTime();
        } catch (Exception e) {
            log.error(e.getMessage() + " : " + item, e);
        }

        return time;
    }

    private void refreshMasterCache(String partitionKey) throws ExecutionException {
        // refresh master info.
        try {
            MasterCache.Equipment.refresh(partitionKey);
            MasterCache.ParameterWithSpec.refresh(partitionKey);
            MasterCache.EquipmentCondition.refresh(partitionKey);
            MasterCache.ExprParameter.refresh(partitionKey);
            MasterCache.Event.refresh(partitionKey);
            MasterCache.Health.refresh(partitionKey);
            MasterCache.Mail.refresh(partitionKey);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
