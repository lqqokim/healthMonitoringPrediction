package com.bistel.pdm.datastore;

import com.bistel.pdm.datastore.jdbc.DBType;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.HealthDataDao;
import com.bistel.pdm.datastore.jdbc.dao.oracle.ParamHealthTrxDao;
import com.bistel.pdm.datastore.jdbc.dao.postgres.ParamHealthTrxPostgreDao;
import com.bistel.pdm.datastore.model.ParamHealthData;
import com.bistel.pdm.datastore.model.ParamHealthRULData;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.InputStream;
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

    private final static int PollingDurations = 100; // milliseconds

    private HealthDataDao trxDao;

    public ParamHealthConsumerRunnable(String configPath, String groupId, String topicName) {

        this.consumer = new KafkaConsumer<>(createConsumerConfig(groupId, configPath));
        this.topicName = topicName;

        log.debug("{} - group id : {}", groupId, this.getClass().getName());

        if (DataSource.getDBType() == DBType.oracle) {
            trxDao = new ParamHealthTrxDao();
            log.info("loaded data object of oracle.");
        } else if (DataSource.getDBType() == DBType.postgresql) {
            trxDao = new ParamHealthTrxPostgreDao();
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

        try {
            while (true) {
                ConsumerRecords<String, byte[]> records = consumer.poll(TimeUnit.MILLISECONDS.toMillis(PollingDurations));
                if (records.count() > 0) {
                    log.debug(" polling {} records", records.count());

                    List<ParamHealthData> dataList = new ArrayList<>();
                    List<ParamHealthRULData> rulList = new ArrayList<>();

                    for (ConsumerRecord<String, byte[]> record : records) {
                        byte[] healthData = record.value();
                        String valueString = new String(healthData);

                        // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
                        String[] values = valueString.split(",", -1);

                        log.trace("[{}] - time : {}, eqp : {}, param : {}, health : {}", record.key(),
                                values[0], values[1], values[2], values[3]);

                        Long rawId = trxDao.getTraceRawId();

                        ParamHealthData data = new ParamHealthData();

                        data.setRawId(rawId);
                        data.setTime(Long.parseLong(values[0]));
                        data.setParamRawId(Long.parseLong(values[2]));
                        data.setParamHealthRawId(Long.parseLong(values[3]));
                        data.setStatus(values[4]);
                        data.setDataCount(Integer.parseInt(values[5]));
                        data.setIndex(Double.parseDouble(values[6]));

                        //spec
                        if (values[7].length() > 0) {
                            data.setUpperAlarmSpec(Float.parseFloat(values[7]));
                        }

                        if (values[8].length() > 0) {
                            data.setUpperWarningSpec(Float.parseFloat(values[8]));
                        }

                        if (values[9].length() > 0) {
                            data.setTarget(Float.parseFloat(values[9]));
                        }

                        if (values[10].length() > 0) {
                            data.setLowerAlarmSpec(Float.parseFloat(values[10]));
                        }

                        if (values[11].length() > 0) {
                            data.setLowerWarningSpec(Float.parseFloat(values[11]));
                        }

                        dataList.add(data);

                        if (values.length > 12) {
                            //rule based
                            ParamHealthRULData rule = new ParamHealthRULData();
                            rule.setParamHealthTrxRawId(rawId);
                            rule.setIntercept(Double.parseDouble(values[12]));
                            rule.setSlope(Double.parseDouble(values[13]));
                            rule.setX(Double.parseDouble(values[14]));
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
        } catch (Exception e) {
            log.error(e.getMessage(), e);
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
