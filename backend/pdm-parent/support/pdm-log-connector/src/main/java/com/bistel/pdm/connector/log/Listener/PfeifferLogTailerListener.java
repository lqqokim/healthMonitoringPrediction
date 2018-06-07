package com.bistel.pdm.connector.log.Listener;

import org.apache.commons.io.input.TailerListenerAdapter;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

/**
 *
 */
public class PfeifferLogTailerListener extends TailerListenerAdapter {
    private final static Logger log = LoggerFactory.getLogger(PfeifferLogTailerListener.class);

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

    public void handle(final String line) {
        if (line.length() <= 0) return;

        String[] columns = line.split("/");
        final String partitionKey = "VACUUM,ADIXEN"; //area,eqp
        final String[] paramName = new String[]{"F1 CH1 V",
                "F1 CH2 V",
                "F2 CH1 V",
                "F2 CH2 V",
                "F3 CH1 A",
                "F3 CH2 A",
                "F4 CH1 A",
                "F4 CH2 A",
                "F5 CH1 A",
                "F5 CH2 A",
                "F6 CH1 A",
                "F6 CH2 A",
                "Exhaust pressure",
                "ADP W",
                "Roots1 W",
                "Purge Flow",
                "ADP Speed",
                "Roots1 Speed",
                "ADP HP Temp",
                "ADP BP Temp",
                "ADP HP Temp cons",
                "ADP BP Temp cons",
                "PreAlertDetected",
                "AlertDetected",
                "NbThresholdExceed"};

        for (int i = 0; i < paramName.length; i++) {
            Timestamp ts = new Timestamp(System.currentTimeMillis());
            String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(ts);
            String value = timeStamp
                    + ",PFEIFFER,VACUUM,ADIXEN,"
                    + paramName[i]
                    + columns[i + 1].trim();

            String topicName = this.topicPrefix + "-trace";
            rmsProducer.send(new ProducerRecord<>(topicName, partitionKey, value.getBytes()));
            log.info("send {}", value);
        }

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
