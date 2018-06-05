package com.bistel.pdm.connector.log;

import org.apache.commons.io.input.TailerListenerAdapter;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 */
public class LogTailerListener extends TailerListenerAdapter {
    private final static Logger log = LoggerFactory.getLogger(LogTailerListener.class);

    private Producer<String, byte[]> rawProducer;
    private Producer<String, byte[]> rmsProducer;
    private String topicPrefix;

    private static int totalSendCount = 0;

    public void setRmsProducer(Producer rmsProducer) {
        this.rmsProducer = rmsProducer;
    }

    public void setRawProducer(Producer rawProducer) {
        this.rawProducer = rawProducer;
    }

    public void setTopic(String topic) {
        this.topicPrefix = topic;
    }

    public void handle(final String line) {
        if (line.length() <= 0) return;

        String[] columns = line.split(",");
        String partitionKey = columns[2] + "," + columns[3]; //area,eqp

        if (columns[5].equalsIgnoreCase("RMS")) {
            // 2018-04-27 08:49:00,
            // fab1,
            // Demo_Area,
            // Demo1,
            // Fan DE1 Acceleration,
            // RMS,
            // 1.6,
            // 0.1482648,
            // 535:267

            String topicName = this.topicPrefix + "-trace";
            rmsProducer.send(new ProducerRecord<>(topicName, partitionKey, line.getBytes()));

            totalSendCount++;
            log.info("send record to {}, {}", topicName, totalSendCount);
        } else {

            // 2018-04-27 08:50:00,
            // fab1,
            // Demo_Area,
            // Demo1,
            // Fan DE1 Acceleration,
            // RAW,
            // 1.6,
            // 1.342991,
            // 0.0^0.0^0.0^0.007003599392926243^0.004083909132515738 ...,
            // 0.07099906503812435^-0.007314464117938635^-0.043057812107598764...,
            // 1600,
            // 500,
            // 0.0

            String topicName = this.topicPrefix + "-raw";
            rawProducer.send(new ProducerRecord<>(topicName, partitionKey, line.getBytes()));
            log.info("send record to {}", topicName);
        }
    }
}
