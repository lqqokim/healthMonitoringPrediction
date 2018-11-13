package com.bistel.pdm.logfile.connector;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.logfile.connector.watcher.DirectoryWatcher;
import com.bistel.pdm.logfile.connector.watcher.TailerFactory;
import com.bistel.pdm.logfile.connector.watcher.TailerThreadManager;
import com.bistel.pdm.logfile.connector.watcher.listener.DefaultLogTailerListener;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.Properties;

/**
 *
 */
public class LogFileWatcher extends Thread {
    private static final Logger log = LoggerFactory.getLogger(LogFileWatcher.class);

    private final TailerThreadManager tailerThreadManager;

    private final String topicPrefixName;
    private final Path watchingPath;
    private final String clientId;

    public LogFileWatcher(final String configPath,
               final String clientId,
               final String topicPrefixName,
               final Path watchingPath) throws Exception {

        Properties producerProperties = new Properties();

        try (InputStream propStream = new FileInputStream(configPath)) {
            producerProperties.load(propStream);
        }

        this.watchingPath = watchingPath;
        this.clientId = clientId;
        this.topicPrefixName = topicPrefixName;

        this.tailerThreadManager = getTailerThreadManager(producerProperties);

        MasterCache.ServingAddress = "http://localhost:28000";
    }

    public void run() {
        String dirPathString = watchingPath.toFile().getAbsolutePath();
        log.info("Watching the {} folder.", dirPathString);
        try {
            final File lastModifiedFile = getLastModifiedFile(watchingPath.toFile());
            if (lastModifiedFile == null) {
                log.info("Any files does not exists.");
            } else {
                tailerThreadManager.startTailingFile(lastModifiedFile.getAbsolutePath());
                DirectoryWatcher directoryWatcher = new DirectoryWatcher(dirPathString, tailerThreadManager);
                directoryWatcher.startWatching();
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private TailerThreadManager getTailerThreadManager(Properties producerProperties) {
        TailerFactory tailerFactory = new TailerFactory();
        tailerFactory.setStartTailingFromEnd(false);
        tailerFactory.setRelinquishLockBetweenChunks(true);

        DefaultLogTailerListener listener = new DefaultLogTailerListener();
        listener.setRawProducer(getRawProducer(producerProperties));
        listener.setRmsProducer(getRmsProducer(producerProperties));
        listener.setTopic(topicPrefixName);

        tailerFactory.setListener(listener);
        return new TailerThreadManager(tailerFactory);
    }

    private File getLastModifiedFile(File fl) {
        File[] files = fl.listFiles(File::isFile);
        long lastModifiedTime = Long.MIN_VALUE;
        File lastModifiedFile = null;

        if (files != null) {
            for (File file : files) {
                if (file.lastModified() > lastModifiedTime) {
                    lastModifiedFile = file;
                    lastModifiedTime = file.lastModified();
                }
            }
        }

        return lastModifiedFile;
    }

    private Producer getRmsProducer(Properties producerProperties) {
        producerProperties.put("client.id", this.clientId + "_trace");
        Producer<String, byte[]> producer = new KafkaProducer<>(producerProperties);
        return producer;
    }

    private Producer getRawProducer(Properties producerProperties) {
        producerProperties.put("client.id", this.clientId + "_raw");
        Producer<String, byte[]> producer = new KafkaProducer<>(producerProperties);
        return producer;
    }

//    private Properties createProducerConfig(String clientId) {
//
//        Properties props = new Properties();
//        props.put("bootstrap.servers", producerProperties.getProperty("bootstrapServers"));
//
//        if (clientId.length() <= 0) {
//            props.put("client.id", producerProperties.getProperty("clientId"));
//        } else {
//            props.put("client.id", clientId);
//        }
//
//        props.put("acks", producerProperties.getProperty("acks"));
//        props.put("retries", producerProperties.getProperty("retries"));
//        props.put("batch.size", producerProperties.getProperty("batchSize"));
//        props.put("linger.ms", producerProperties.getProperty("linger-ms"));
//        //props.put("schema.registry.url", producerProperties.getProperty("schema-registry-url"));
//        props.put("key.serializer", producerProperties.getProperty("key-serializer"));
//        props.put("value.serializer", producerProperties.getProperty("value-serializer"));
//
//        return props;
//    }
}
