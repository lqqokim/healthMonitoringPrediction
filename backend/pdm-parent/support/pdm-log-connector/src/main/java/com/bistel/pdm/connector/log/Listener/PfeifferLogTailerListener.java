package com.bistel.pdm.connector.log.Listener;

import com.bistel.pdm.lambda.kafka.partitioner.CustomStreamPartitioner;
import org.apache.commons.io.input.TailerListenerAdapter;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.PartitionInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;

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
        if(columns[0].equalsIgnoreCase("time")) return;

        final String partitionKey = "TP8016901"; //eqp

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
                "ADP BP Temp"};


        String topicName = this.topicPrefix + "-trace";

        Timestamp ts = new Timestamp(System.currentTimeMillis());
        String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(ts);

        String msg = timeStamp + ","
                + columns[1].trim() + "," + columns[2].trim() + ","
                + columns[3].trim() + "," + columns[4].trim() + ","
                + columns[5].trim() + "," + columns[6].trim() + ","
                + columns[7].trim() + "," + columns[8].trim() + ","
                + columns[9].trim() + "," + columns[10].trim() + ","
                + columns[11].trim() + "," + columns[12].trim() + ","
                + columns[13].trim() + "," + columns[14].trim() + ","
                + columns[15].trim() + "," + columns[16].trim() + ","
                + columns[16].trim() + "," + columns[17].trim() + ","
                + columns[18].trim() + "," + columns[19].trim() + ","
                + columns[20].trim();

        log.debug("[{}] - {}", partitionKey, msg);

        try {
            List<PartitionInfo> partitions = rmsProducer.partitionsFor(topicName);
            CustomStreamPartitioner csp = new CustomStreamPartitioner();
            int partitionNum = csp.partition(partitionKey, msg.getBytes(), partitions.size());

            log.debug("partition Number : {}", partitionNum);
            rmsProducer.send(new ProducerRecord<>(topicName, partitionNum,
                    partitionKey, msg.getBytes()));

            log.info("send {}", msg);
        } catch (Exception e){
            log.error(e.getMessage(), e);
        }

        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
