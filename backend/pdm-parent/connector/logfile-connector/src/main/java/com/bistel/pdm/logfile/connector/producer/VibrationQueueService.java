package com.bistel.pdm.logfile.connector.producer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Properties;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.LinkedBlockingQueue;

/**
 *
 */
public class VibrationQueueService {
    private final static Logger log = LoggerFactory.getLogger(VibrationQueueService.class);

    private static VibrationQueueService instance = null;
    private static BlockingQueue<File> waitingQueue = null;

    public static VibrationQueueService getInstance() {
        if (instance == null) {
            instance = new VibrationQueueService();
        }
        return instance;
    }

    private void initialize(Properties producerProperties) {
        if (waitingQueue == null) {
            waitingQueue = new LinkedBlockingQueue<>();
            DataSender dataSender = new DataSender(new KafkaProducer<>(producerProperties));
            dataSender.start();
        }
    }

    public void putFileInQueue(Properties producerProperties, File eventData) {
        try {
            initialize(producerProperties);
            waitingQueue.put(eventData);
        } catch (InterruptedException ex) {
            ex.printStackTrace();
        }
    }

    class DataSender extends Thread {

        private Producer<String, byte[]> producer;

        private static final String TIME_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
        private static final String TOPIC_NAME = "pdm-input-raw";

        DataSender(Producer<String, byte[]> producer) {
            producer = producer;
        }

        @Override
        public void run() {
            while (true) {
                try {
                    File file = waitingQueue.take();
                    if (!file.exists()) {
                        log.debug("{} not existed.", file.getPath());
                        continue;
                    }

                    CSVParser records = CSVFormat.RFC4180.withFirstRecordAsHeader().parse(new FileReader(file));

                    String key = "";
                    String time = "";
                    for (CSVRecord record : records.getRecords()) {
                        StringBuilder sbRecord = new StringBuilder();

                        // to do something.


                        sbRecord.setLength(sbRecord.length() - 1);
                        String value = time + "," + sbRecord.toString();

                        RecordMetadata meta =
                                producer.send(new ProducerRecord<>(TOPIC_NAME, key, value.getBytes())).get();

                        Timestamp ts = new Timestamp(System.currentTimeMillis());
                        String timeStamp = new SimpleDateFormat(TIME_FORMAT).format(ts);

                        log.info("[{}] - {}, partition:{}, offset:{}", key, timeStamp, meta.partition(), meta.offset());
                    }
                } catch (InterruptedException | IOException | ExecutionException e1) {
                    log.error(e1.getMessage(), e1);
                }
            }
        }
    }
}
