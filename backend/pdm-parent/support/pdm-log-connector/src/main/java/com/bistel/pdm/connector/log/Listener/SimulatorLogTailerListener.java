package com.bistel.pdm.connector.log.Listener;

import org.apache.commons.io.input.TailerListenerAdapter;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class SimulatorLogTailerListener extends TailerListenerAdapter {
    private final static Logger log = LoggerFactory.getLogger(SimulatorLogTailerListener.class);

    private Producer<String, byte[]> rawProducer;
    private Producer<String, byte[]> rmsProducer;
    private String topicPrefix;

    public void setRmsProducer(Producer rmsProducer) {
        this.rmsProducer = rmsProducer;
    }

    public void setRawProducer(Producer rawProducer) {
        this.rawProducer = rawProducer;
    }

    public void setTopic(String topic) {
        this.topicPrefix = topic;
    }

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private static String maxFreq = "";
    private static Long prevTimeStamp = null;

    public void handle(final String line) {
//        log.debug(line);

        if (line.length() <= 0) return;

        String[] columns = line.split("\t");

        String partitionKey = "MOTOR,MT10A";

        Date from = new Date();
        SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd");
        String to = transFormat.format(from);

        String strTimeStamp = to + " " + columns[0]; //17:02:46.007
        String rms = columns[1];

        if (columns[0].equalsIgnoreCase("time")) {
            maxFreq = columns[columns.length - 1];
            return;
        }

        StringBuilder sbFrequency = new StringBuilder();
        for (int i = 2; i < columns.length; i++) {
            sbFrequency.append(columns[i]).append("^");
        }

        final StringBuilder sbRecord = new StringBuilder();
        sbRecord.append(strTimeStamp).append(",")
                .append(rms).append(",") // param 1
                .append(sbFrequency.toString()).append(",") // frequency
                .append(columns.length - 2).append(",") // frequency count
                .append(maxFreq).append(",") // max frequency
                .append("10").append(",") // rpm
                .append("1.6"); // sampling time

        String topicName = this.topicPrefix + "-trace";
        rmsProducer.send(new ProducerRecord<>(topicName, partitionKey, sbRecord.toString().getBytes()));
        log.info("send record to {}, value : {} - {}", topicName, strTimeStamp, rms);

//        try {
//            Thread.sleep(1000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//
//
//        long diffSeconds = 3;
//
//        if(prevTimeStamp == null) {
//            prevTimeStamp = System.currentTimeMillis();
//        } else {
//            long diff = System.currentTimeMillis() - prevTimeStamp;
//            diffSeconds = diff / 1000;
//
//            if(diffSeconds >= 3) {
//                topicName = "pdm-input-reload";
//                rmsProducer.send(new ProducerRecord<>(topicName, partitionKey, "http://192.168.7.230:28000".getBytes()));
//                log.info("send record to {}, reload...", topicName);
//            }
//        }



//        long diffSeconds = 600;
//
//        if(prevTimeStamp == null) {
//            prevTimeStamp = System.currentTimeMillis();
//        } else {
//            long diff = System.currentTimeMillis() - prevTimeStamp;
//            diffSeconds = diff / 1000;
//        }
//
//        if(diffSeconds >= 600) {
//            prevTimeStamp = System.currentTimeMillis();
//
//            String topicName = this.topicPrefix + "-raw";
//            //String topicName = this.topicPrefix + "-trace";
//            rmsProducer.send(new ProducerRecord<>(topicName, partitionKey, sbRecord.toString().getBytes()));
//            log.info("send record to {}, value : {} - {}", topicName, strTimeStamp, rms);
//        }
    }
}
