package com.bistel.pdm.datastore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class RepositorySinker {
    private static final Logger log = LoggerFactory.getLogger(RepositorySinker.class);

    private final String configPath;
    private final String groupId;
    private final String servingAddress;

    private ExecutorService executor = Executors.newFixedThreadPool(7);

    public RepositorySinker(final String groupId, String servingAddr, String configPath) {
        this.groupId = groupId;
        this.configPath = configPath;
        this.servingAddress = servingAddr;
    }

    public void start() throws IOException {
        final String outputEventTopic = "pdm-output-event";
        final String outputTraceTopic = "pdm-output-trace";
        final String outputTimewaveTopic = "pdm-output-raw";
        final String outputFeatureTopic = "pdm-output-feature";
        final String outputFaultTopic = "pdm-output-fault";
        final String outputParamHealthTopic = "pdm-output-health";
        final String outputReloadTopic = "pdm-output-reload";

        executor.submit(new TimewaveConsumerRunnable(
                this.configPath, this.groupId + "-raw", outputTimewaveTopic));

        executor.submit(new TraceConsumerRunnable(
                this.configPath, this.groupId + "-trace", outputTraceTopic));

        executor.submit(new FeatureConsumerRunnable(
                this.configPath, this.groupId + "-feature", outputFeatureTopic));

        executor.submit(new FaultConsumerRunnable(
                this.configPath, this.groupId + "-fault", outputFaultTopic));

        executor.submit(new EventConsumerRunnable(
                this.configPath, this.groupId + "-event", outputEventTopic));

        executor.submit(new ParamHealthConsumerRunnable(
                this.configPath, this.groupId + "-health", outputParamHealthTopic));

        executor.submit(new ReloadConsumerRunnable(
                this.configPath, this.groupId + "-reload", outputReloadTopic, this.servingAddress));
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
