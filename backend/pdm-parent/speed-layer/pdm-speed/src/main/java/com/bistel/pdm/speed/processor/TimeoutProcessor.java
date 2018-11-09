package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.data.stream.EventMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.PunctuationType;
import org.apache.kafka.streams.processor.To;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Timeout
 */
public class TimeoutProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(TimeoutProcessor.class);

    private final static String SEPARATOR = ",";
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final static ConcurrentHashMap<String, Long> TimeOutOffset = new ConcurrentHashMap<>();
    private final static ConcurrentHashMap<String, String> TimeOutFlag = new ConcurrentHashMap<>();

    @Override
    public void init(ProcessorContext context) {
        super.init(context);

        context().schedule(3600000, PunctuationType.STREAM_TIME, (timestamp) -> {
            try {

                for (String key : TimeOutOffset.keySet()) {

                    Long lastReceivedTimeMs = TimeOutOffset.get(key);
                    Long currentTimeMs = System.currentTimeMillis();

                    Pair<EventMaster, EventMaster> eventInfo = MasterCache.IntervalEvent.get(key);
                    if (eventInfo != null && eventInfo.getFirst() != null) {

                        if (eventInfo.getFirst().getTimeoutMs() != null
                                && eventInfo.getFirst().getTimeoutMs() >= 3600000) { // > 1h

                            Long timeoutMs = eventInfo.getFirst().getTimeoutMs();
                            long diffInMillies = Math.abs(currentTimeMs - lastReceivedTimeMs);

                            log.info("[{}-{}] - diff time:{} > config time:{}",
                                    key, context().partition(), diffInMillies, timeoutMs);

                            // time out
                            if (diffInMillies > timeoutMs) {
                                if (TimeOutFlag.get(key) == null ||
                                        !TimeOutFlag.get(key).equalsIgnoreCase("Y")) {

                                    // event ended. ------------------------------------------
                                    String eventMsg =
                                            currentTimeMs + ","
                                                    + eventInfo.getSecond().getEventRawId() + ","
                                                    + eventInfo.getSecond().getEventTypeCD();

                                    log.info("[{}-{}] - Message Timeout. ", key, context().partition());
                                    context().forward(key, eventMsg.getBytes(), To.child("output-event"));
                                    context().commit();
                                    // event ended. ------------------------------------------

                                    TimeOutFlag.put(key, "Y");
                                }
                            } else {
                                TimeOutFlag.put(key, "N");
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        });
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR, -1);

        try {
            // refresh cache command
            if (recordColumns[1].equalsIgnoreCase("CMD-REFRESH-CACHE")) {
                MasterCache.IntervalEvent.refresh(partitionKey);
                log.debug("[{}-{}] - event refreshed.", partitionKey, context().partition());
            }

            Long msgTimeStamp = parseStringToTimestamp(recordColumns[0]);
            TimeOutOffset.put(partitionKey, msgTimeStamp);

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
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
}
