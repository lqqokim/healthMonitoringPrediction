package com.bistel.pdm.datastore;

import com.bistel.pdm.datastore.jdbc.DBType;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.HealthDataDao;
import com.bistel.pdm.datastore.jdbc.dao.ora.ParamHealthTrxDao;
import com.bistel.pdm.datastore.model.ParamHealthData;
import com.bistel.pdm.datastore.model.ParamHealthRULData;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class ParamHealthConsumerRunnable implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(ParamHealthConsumerRunnable.class);

    private final KafkaConsumer<String, byte[]> consumer;
    private final String topicName;

    private final static int PollingDurations = 1; // sec

    private HealthDataDao trxDao;

    public ParamHealthConsumerRunnable(Properties property, String groupId, String topicName) {
        this.consumer = new KafkaConsumer<>(createConsumerConfig(groupId, property));
        this.topicName = topicName;

        if (DataSource.getDBType() == DBType.oracle) {
            trxDao = new ParamHealthTrxDao();
            log.info("loaded data object of oracle.");
        } else if (DataSource.getDBType() == DBType.postgresql) {
            trxDao = new ParamHealthTrxDao();
            log.info("loaded data object of postgresql.");
        } else {
            trxDao = new ParamHealthTrxDao();
            log.info("loaded data object of default(oracle).");
        }
    }

    @Override
    public void run() {
        Runtime.getRuntime().addShutdownHook(new Thread(consumer::close));

        consumer.subscribe(Collections.singletonList(topicName));
        log.info("Reading topic: {}, db type: {}", topicName, DataSource.getDBType());

        while (true) {
            ConsumerRecords<String, byte[]> records = consumer.poll(TimeUnit.SECONDS.toMillis(PollingDurations));
            if (records.count() > 0) {
                log.debug(" polling {} records", records.count());

                List<ParamHealthData> dataList = new ArrayList<>();
                List<ParamHealthRULData> rulList = new ArrayList<>();

                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] healthData = record.value();
                    String valueString = new String(healthData);
                    // time, eqpRawid, param_rawid, param_health_rawid, status_cd, count, index, health_logic_rawid
                    String[] values = valueString.split(",");

                    Long rawId = trxDao.getTraceRawId();

                    ParamHealthData data = new ParamHealthData();

                    data.setRawId(rawId);
                    data.setParamRawId(Long.parseLong(values[2]));
                    data.setParamHealthRawId(Long.parseLong(values[3]));
                    data.setStatus(values[4]);
                    data.setDataCount(Integer.parseInt(values[5]));
                    data.setIndex(Double.parseDouble(values[6]));
                    data.setTime(Long.parseLong(values[0]));

                    dataList.add(data);

                    if (values.length > 8) {
                        //rule based
                        ParamHealthRULData rule = new ParamHealthRULData();
                        rule.setParamHealthTrxRawId(rawId);
                        rule.setIntercept(Double.parseDouble(values[7]));
                        rule.setSlope(Double.parseDouble(values[8]));
                        rule.setX(Double.parseDouble(values[9]));
                        rule.setTime(Long.parseLong(values[0]));

                        rulList.add(rule);
                    }
                }

                trxDao.storeHealth(dataList);

                if (rulList.size() > 0) {
                    trxDao.storeHealthRUL(rulList);
                }

                consumer.commitSync();
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

//        props.put("schema.registry.url", prop.getProperty(""));
//        props.put("specific.avro.reader", prop.getProperty(""));

        return props;
    }
}
