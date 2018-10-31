package com.bistel.pdm.datastore;

import com.bistel.pdm.datastore.jdbc.DBType;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.FaultDataDao;
import com.bistel.pdm.datastore.jdbc.dao.oracle.FaultTrxDao;
import com.bistel.pdm.datastore.jdbc.dao.postgres.FaultTrxPostgreDao;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.InputStream;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

/**
 *
 */
public class FaultConsumerRunnable implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(FaultConsumerRunnable.class);

    private final static long PollingDurations = 100; // sec

    private final KafkaConsumer<String, byte[]> consumer;
    private final String topicName;

    private FaultDataDao trxDao;

    public FaultConsumerRunnable(String configPath, String groupId, String topicName) {

        this.consumer = new KafkaConsumer<>(createConsumerConfig(groupId, configPath));
        this.topicName = topicName;

        log.debug("{} - group id : {}", groupId, this.getClass().getName());

        if (DataSource.getDBType() == DBType.oracle) {
            trxDao = new FaultTrxDao();
            log.info("loaded data object of oracle.");
        } else if (DataSource.getDBType() == DBType.postgresql) {
            trxDao = new FaultTrxPostgreDao();
            log.info("loaded data object of postgresql.");
        } else {
            trxDao = new FaultTrxDao();
            log.info("loaded data object of default(oracle).");
        }
    }

    @Override
    public void run() {
        Runtime.getRuntime().addShutdownHook(new Thread(consumer::close));

        consumer.subscribe(Collections.singletonList(topicName));
        log.info("Reading topic: {}, db type: {}", topicName, DataSource.getDBType());

        final int minBatchSize = 2;
        List<ConsumerRecord<String, byte[]>> buffer = new ArrayList<>();

        while (true) {
            ConsumerRecords<String, byte[]> records = consumer.poll(Duration.ofMillis(PollingDurations));
            for (ConsumerRecord<String, byte[]> record : records) {
                buffer.add(record);
            }

            if (buffer.size() >= minBatchSize) {
                trxDao.storeRecords(buffer);
                consumer.commitSync();
                log.info("{} records are committed.", buffer.size());
                buffer.clear();
            }
        }
    }

    private Properties createConsumerConfig(String groupId, String configPath) {
        Properties prop = new Properties();

        try (InputStream confStream = new FileInputStream(configPath)) {
            prop.load(confStream);
            log.debug("loaded config file : {}", configPath);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        //update group.id
        prop.replace(ConsumerConfig.GROUP_ID_CONFIG, groupId);

        return prop;
    }
}
