package com.bistel.pdm.datastore;

import com.bistel.pdm.lambda.kafka.master.MasterDataUpdater;
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

    private final String outputEventTopic = "pdm-output-event";
    private final String outputTraceTopic = "pdm-output-trace";
    private final String outputTimewaveTopic = "pdm-output-raw";
    private final String outputFeatureTopic = "pdm-output-feature";
    private final String outputFaultTopic = "pdm-output-fault";
    private final String outputHealthTopic = "pdm-output-health";

    private final String configPath;
    private final String groupId;

    private ExecutorService executor = Executors.newFixedThreadPool(5);

    public RepositorySinker(final String groupId, String servingAddr, String configPath) {
        this.groupId = groupId;
        this.configPath = configPath;

        String targetUrl = servingAddr + "/pdm/api/master/latest/param";
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateParameterMasterDataSet(targetUrl);
    }

    public void start() throws IOException {
        Properties producerProperties = new Properties();
        try(InputStream confStream = new FileInputStream(this.configPath)){
            producerProperties.load(confStream);
            log.debug("loaded config file : {}", this.configPath);
        }

        executor.submit(new TimewaveConsumerRunnable(
                producerProperties, this.groupId + "-raw", outputTimewaveTopic));

        executor.submit(new TraceConsumerRunnable(
                producerProperties, this.groupId + "-trace", outputTraceTopic));

        executor.submit(new FeatureConsumerRunnable(
                producerProperties, this.groupId + "-feature", outputFeatureTopic));

        executor.submit(new FaultConsumerRunnable(
                producerProperties, this.groupId + "-fault", outputFaultTopic));

        executor.submit(new EventConsumerRunnable(
                producerProperties, this.groupId + "-event", outputEventTopic));

        executor.submit(new HealthConsumerRunnable(
                producerProperties, this.groupId + "-health", outputHealthTopic));
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
