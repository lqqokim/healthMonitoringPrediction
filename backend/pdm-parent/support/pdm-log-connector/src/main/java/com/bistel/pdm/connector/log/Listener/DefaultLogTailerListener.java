package com.bistel.pdm.connector.log.Listener;

import org.apache.commons.io.input.TailerListenerAdapter;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class DefaultLogTailerListener extends TailerListenerAdapter {
    private final static Logger log = LoggerFactory.getLogger(DefaultLogTailerListener.class);

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
//        log.debug(line);

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

            StringBuilder sb = new StringBuilder();
            sb.append(columns[0]).append(",")
                    .append(columns[1]).append(",")
                    .append(columns[2]).append(",")
                    .append(columns[3]).append(",")
                    .append(columns[4]).append(",") //param
                    .append(columns[7]).append(",") //value
                    .append(columns[8]);

            String topicName = this.topicPrefix + "-trace";
            rmsProducer.send(new ProducerRecord<>(topicName, partitionKey, sb.toString().getBytes()));
            log.info("send record to {}, {}", topicName);
        } else {

            //0: 2018-04-27 08:50:00,
            //1: fab1,
            //2: Demo_Area,
            //3: Demo1,
            //4: Fan DE1 Acceleration,
            //5: RAW,
            //6: 1.6,
            //7: 1.342991,
            //8: 0.0^0.0^0.0^0.007003599392926243^0.004083909132515738 ...,
            //9: 0.07099906503812435^-0.007314464117938635^-0.043057812107598764...,
            //10: 1600,
            //11: 500,
            //12: 0.0

            StringBuilder sb = new StringBuilder();
            sb.append(columns[0]).append(",")
                    .append(columns[1]).append(",")
                    .append(columns[2]).append(",")
                    .append(columns[3]).append(",")
                    .append(columns[4]).append(",") //param
                    .append(columns[7]).append(",") //value
                    .append(columns[6]).append(",") //sampling
                    .append(columns[8]).append(",")
                    .append(columns[9]).append(",")
                    .append(columns[10]).append(",")
                    .append(columns[11]).append(",")
                    .append(columns[12]);

            String topicName = this.topicPrefix + "-raw";
            rawProducer.send(new ProducerRecord<>(topicName, partitionKey, sb.toString().getBytes()));
            log.info("send record to {}", topicName);
        }
    }
}
