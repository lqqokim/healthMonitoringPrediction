package com.bistel.pdm.datastore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class RepositorySinker {
    private static final Logger log = LoggerFactory.getLogger(RepositorySinker.class);

    private final String configPath;
    private final String topicPrefix;
    private final String groupId;

    private ExecutorService executor = Executors.newFixedThreadPool(4);

    public RepositorySinker(final String groupId, final String topicPrefix, String configPath) {
        this.groupId = groupId;
        this.topicPrefix = topicPrefix;
        this.configPath = configPath;
    }

    public void start() throws IOException {
        Properties producerProperties = new Properties();
        try(InputStream confStream = new FileInputStream(this.configPath)){
            producerProperties.load(confStream);
            log.debug("loaded config file : {}", this.configPath);
        }

        executor.submit(new TraceRawConsumerRunnable(
                producerProperties, this.groupId + "_raw", this.topicPrefix + "-raw"));

        executor.submit(new TraceRmsConsumerRunnable(
                producerProperties, this.groupId + "_rms", this.topicPrefix + "-trace"));

        executor.submit(new FeatureAggConsumerRunnable(
                producerProperties, this.groupId + "_feature", this.topicPrefix + "-feature"));

        executor.submit(new OutOfSpecConsumerRunnable(
                producerProperties, this.groupId + "_OOS", this.topicPrefix + "-OOS"));
    }

    public void awaitTerminationAfterShutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException ex) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    public synchronized void shutdown() {
        executor.shutdownNow();
        log.info("Datastore Sinker shutdown complete.");
    }
}
