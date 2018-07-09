package com.bistel.pdm.connector.log.Listener;

import org.apache.commons.io.input.TailerListenerAdapter;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
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

    public void handle(final String line) {
//        log.debug(line);

        if (line.length() <= 0) return;

        String[] columns = line.split("\t");

        String partitionKey = "MOTOR,MT10A";
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        String time = dateFormat.format(timestamp); //columns[0];
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
        sbRecord.append(time).append(",")
                .append(rms).append(",") // param 1
                .append(sbFrequency.toString()).append(",") // frequency
                .append(columns.length - 2).append(",") // frequency count
                .append(maxFreq).append(",") // max frequency
                .append("10").append(",") // rpm
                .append("1.6"); // sampling time

        //String topicName = this.topicPrefix + "-raw";
        String topicName = this.topicPrefix + "-trace";
        rmsProducer.send(new ProducerRecord<>(topicName, partitionKey, sbRecord.toString().getBytes()));
        log.info("send record to {}, value : {}", topicName, rms);

        try {
            Thread.sleep(4820);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

//        try {
//            Thread.sleep(60000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
    }
}
