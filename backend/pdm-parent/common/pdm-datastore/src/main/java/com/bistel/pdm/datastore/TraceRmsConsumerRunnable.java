package com.bistel.pdm.datastore;

import com.bistel.pdm.datastore.jdbc.DBType;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorRawDataDao;
import com.bistel.pdm.datastore.jdbc.dao.SensorTraceDataDao;
import com.bistel.pdm.datastore.jdbc.dao.ora.SensorTraceRawTrxDao;
import com.bistel.pdm.datastore.jdbc.dao.ora.SensorTraceTrxDao;
import com.bistel.pdm.datastore.jdbc.dao.pg.SensorTraceRawTrxPostgreDao;
import com.bistel.pdm.datastore.jdbc.dao.pg.SensorTraceTrxPostgreDao;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Properties;

/**
 *
 */
public class TraceRmsConsumerRunnable implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(TraceRmsConsumerRunnable.class);
    private final KafkaConsumer<String, byte[]> consumer;
    private final String topicName;

    private SensorTraceDataDao trxDao;

    public TraceRmsConsumerRunnable(Properties property, String groupId, String topicName) {
        this.consumer = new KafkaConsumer<>(createConsumerConfig(groupId, property));
        this.topicName = topicName;

        if(DataSource.getDBType() == DBType.oracle){
            trxDao = new SensorTraceTrxDao();
            log.info("loaded data object of oracle.");
        } else if(DataSource.getDBType() == DBType.postgresql){
            trxDao = new SensorTraceTrxPostgreDao();
            log.info("loaded data object of postgresql.");
        } else {
            trxDao = new SensorTraceTrxDao();
            log.info("loaded data object of default(oracle).");
        }
    }

    @Override
    public void run() {
        Runtime.getRuntime().addShutdownHook(new Thread(consumer::close));

        consumer.subscribe(Collections.singletonList(topicName));
        log.info("Reading topic: {}, db type: {}", topicName, DataSource.getDBType());

        while (true) {
            ConsumerRecords<String, byte[]> records = consumer.poll(5000); //5 sec.
            if (records.count() > 0) {
                trxDao.storeRecord(records);
                consumer.commitSync();
                log.info("{} records are committed and stored to TRACE_TRX_PDM table.", records.count());
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
