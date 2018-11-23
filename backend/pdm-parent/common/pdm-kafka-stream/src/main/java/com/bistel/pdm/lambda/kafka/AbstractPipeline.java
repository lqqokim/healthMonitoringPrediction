package com.bistel.pdm.lambda.kafka;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;

/**
 *
 */
public abstract class AbstractPipeline implements Closeable {
    private static final Logger log = LoggerFactory.getLogger(AbstractPipeline.class);
//    protected static final String stateDir = "/tmp/kafka-streams";

    private final String broker;

    private final String inputTraceTopic = "pdm-input-trace";
    private final String inputTimewaveTopic = "pdm-input-raw";
    private final String inputReloadTopic = "pdm-input-reload";

    private final String outputEventTopic = "pdm-output-event";
    private final String outputTraceTopic = "pdm-output-trace";
    private final String outputTimewaveTopic = "pdm-output-raw";
    private final String outputFeatureTopic = "pdm-output-feature";
    private final String outputFaultTopic = "pdm-output-fault";
    private final String outputHealthTopic = "pdm-output-health";
    private final String outputReloadTopic = "pdm-output-reload";
    private final String outputDimensionTopic = "pdm-output-dimension";

    private final String routeFeatureTopic = "pdm-route-feature";

    /**
     * What to do when there is no initial offset in Kafka or if the current offset does not exist
     * any more on the server (e.g. because that data has been deleted):
     *
     * earliest: automatically reset the offset to the earliest offset
     * latest: automatically reset the offset to the latest offset
     * none: throw exception to the consumer if no previous offset is found for the consumer's group
     * anything else: throw exception to the consumer.
     */
    protected final String AUTO_OFFSET_RESET_CONFIG = "latest";

    protected AbstractPipeline(String brokers, String servingAddr) {
//        Objects.requireNonNull(config);
//        log.info("Configuration:\n{}", ConfigUtils.prettyPrint(config));

        this.broker = brokers;

        log.info("setting the serving address...");
        MasterCache.ServingAddress = servingAddr;
    }

    protected abstract String getApplicationId();

    public String getBroker() {
        return broker;
    }

    public String getInputTraceTopic() {
        return inputTraceTopic;
    }

    public String getInputTimewaveTopic() {
        return inputTimewaveTopic;
    }

    public String getOutputEventTopic() {
        return outputEventTopic;
    }

    public String getOutputTraceTopic() {
        return outputTraceTopic;
    }

    public String getOutputTimewaveTopic() {
        return outputTimewaveTopic;
    }

    public String getOutputFeatureTopic() {
        return outputFeatureTopic;
    }

    public String getOutputFaultTopic() {
        return outputFaultTopic;
    }

    public String getRouteFeatureTopic() {
        return routeFeatureTopic;
    }

    public String getOutputHealthTopic() {
        return outputHealthTopic;
    }

    public String getOutputReloadTopic() {
        return outputReloadTopic;
    }

    public String getOutputDimensionTopic() {
        return outputDimensionTopic;
    }

    public String getInputReloadTopic() {
        return inputReloadTopic;
    }
}
