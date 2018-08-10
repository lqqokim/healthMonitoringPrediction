package com.bistel.pdm.datastore;

import com.bistel.pdm.datastore.jdbc.DBType;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorTraceDataDao;
import com.bistel.pdm.datastore.jdbc.dao.ora.TraceTrxDao;
import com.bistel.pdm.datastore.jdbc.dao.pg.TraceTrxPostgreDao;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class TraceConsumerRunnable implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(TraceConsumerRunnable.class);
    private final KafkaConsumer<String, byte[]> consumer;
    private final String topicName;

    private final static int PollingDurations = 100; // milliseconds.

    private SensorTraceDataDao trxDao;

    public TraceConsumerRunnable(Properties property, String groupId, String topicName) {
        this.consumer = new KafkaConsumer<>(createConsumerConfig(groupId, property));
        this.topicName = topicName;

        if (DataSource.getDBType() == DBType.oracle) {
            trxDao = new TraceTrxDao();
            log.info("loaded data object of oracle.");
        } else if (DataSource.getDBType() == DBType.postgresql) {
            trxDao = new TraceTrxPostgreDao();
            log.info("loaded data object of postgresql.");
        } else {
            trxDao = new TraceTrxDao();
            log.info("loaded data object of default(oracle).");
        }
    }

    @Override
    public void run() {
        Runtime.getRuntime().addShutdownHook(new Thread(consumer::close));

        consumer.subscribe(Collections.singletonList(topicName));
        log.info("Reading topic: {}, db type: {}", topicName, DataSource.getDBType());

        while (true) {
            ConsumerRecords<String, byte[]> records = consumer.poll(TimeUnit.MILLISECONDS.toMillis(PollingDurations));
            if (records.count() > 0) {
                log.debug(" polling {} records", records.count());
                trxDao.storeRecord(records);
                consumer.commitAsync();
                log.info("{} records are committed.", records.count());
            }
        }
    }

    private Properties createConsumerConfig(String groupId, Properties prop) {
        Properties props = new Properties();
        props.put("bootstrap.servers", prop.getProperty("bootstrap.servers"));

        if (groupId.length() <= 0) {
            props.put("group.id", prop.getProperty("group.id"));
        } else {
            props.put("group.id", groupId);
        }

        props.put("auto.commit.enable", prop.getProperty("enable.auto.commit"));
        props.put("auto.offset.reset", prop.getProperty("auto.offset.reset"));
        props.put("key.deserializer", prop.getProperty("key.deserializer"));
        props.put("value.deserializer", prop.getProperty("value.deserializer"));
        return props;
    }
}
