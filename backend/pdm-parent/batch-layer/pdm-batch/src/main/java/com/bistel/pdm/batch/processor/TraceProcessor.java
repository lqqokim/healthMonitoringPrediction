package com.bistel.pdm.batch.processor;

import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 *
 */
public class TraceProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(TraceProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final static String SEPARATOR = ",";
    private final static int PARAM_IDX_FOR_STATUS = 4;

    private KeyValueStore<String, byte[]> kvStore;
    //private WindowStore<String, byte[]> kvTempStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext context) {
        super.init(context);

        kvStore = (KeyValueStore) context().getStateStore("processing-window");
        //kvTempStore = (WindowStore) context().getStateStore("processing-interval");


//        // schedule a punctuate() method every 1000 milliseconds based on stream-time
//        context().schedule(TimeUnit.MINUTES.toMillis(1), PunctuationType.STREAM_TIME, (timestamp) -> {
//
//            long timeFrom = 0; // beginning of time = oldest available
//            long timeTo = System.currentTimeMillis(); // now (in processing-time)
//            WindowStoreIterator<byte[]> iterator = kvTempStore.fetch("europe", timeFrom, timeTo);
//
//            KeyValueIterator<> iter = kvTempStore.all();
//
//            while (iterator.hasNext()) {
//                KeyValue<Long, byte[]> next = iterator.next();
//                long windowTimestamp = next.key;
//                System.out.println("Count of 'europe' @ time " + windowTimestamp + " is " + next.value);
//            }
//
//        });

//        context().schedule(TimeUnit.MINUTES.toMillis(1), PunctuationType.STREAM_TIME, (timestamp) -> {
//            KeyValueIterator<String, byte[]> iter = this.kvStore.all();
//            while (iter.hasNext()) {
//                KeyValue<String, byte[]> entry = iter.next();
//                //context.forward(entry.key, entry.value);
//            }
//            iter.close();
//
//
//            StringBuilder sb = new StringBuilder();
//            sb.append("count,sum,min,max,avg,median,stddev");
//
//            context.forward("", sb.toString().getBytes());
//            // commit the current processing progress
//            context.commit();
//        });
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        // sink to the pdm-output-trace topic
        this.context().forward(partitionKey, streamByteRecord, "output-trace");
        this.context().commit();

        // aggregation
        String value = new String(streamByteRecord);
        //param_rawid, value, alarm spec, warning spec, time
        String[] columns = value.split(SEPARATOR, -1);

        String currStatus = columns[columns.length - 1];
        String prevStatus = columns[columns.length - 2];
        Long time = parseStringToTimestamp(columns[0]);

        if (currStatus.equalsIgnoreCase("R")) {
            this.context().forward(partitionKey, streamByteRecord, "fd-01"); // detect fault by real-time

            kvStore.put(partitionKey + ":" + context().timestamp(), streamByteRecord);

        } else {
            //end
            if (prevStatus.equalsIgnoreCase("R") &&
                    currStatus.equalsIgnoreCase("I")) {

                List<String> keyList = new ArrayList<>();
                HashMap<String, List<Double>> paramData = new HashMap<>();


                KeyValueIterator<String, byte[]> iter = this.kvStore.all();
                while (iter.hasNext()) {
                    KeyValue<String, byte[]> entry = iter.next();
                    keyList.add(entry.key);

                    String key = entry.key.split(":")[0];


                }
                iter.close();

                for (String k : keyList) {
                    this.kvStore.delete(k);
                }

                for (String key : paramData.keySet()) {
                    // aggregate min, max, count, avg, median, std.dev, ... per parameter.

                    List val = paramData.get(key);


                    StringBuilder sbParamAgg = new StringBuilder();


                    context().forward(key, sbParamAgg.toString(), "features");
                }
            }
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
