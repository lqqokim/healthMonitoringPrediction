package com.bistel.pdm.datastore;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Collections;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class ReloadConsumerRunnable implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(ReloadConsumerRunnable.class);

    private final KafkaConsumer<String, byte[]> consumer;
    private final String topicName;

    private final static int PollingDurations = 100; // milliseconds

    public ReloadConsumerRunnable(String configPath, String groupId, String topicName, String servingAddress) {

        this.consumer = new KafkaConsumer<>(createConsumerConfig(groupId, configPath));
        this.topicName = topicName;
        MasterCache.ServingAddress = servingAddress;

        log.debug("{} - group id : {}", groupId, this.getClass().getName());
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

                for (ConsumerRecord<String, byte[]> record : records) {
                    // refresh master info.
                    MasterCache.Parameter.refresh(record.key());
                }
                consumer.commitAsync();
                log.info("{} reloaded.", records.count());
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
