package com.bistel.pdm.lambda.kafka;

import com.bistel.pdm.lambda.kafka.master.MasterDataUpdater;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;

/**
 *
 *
 */
public abstract class AbstractPipeline implements Closeable {
    private static final Logger log = LoggerFactory.getLogger(AbstractPipeline.class);

    protected static final String stateDir = "/tmp/kafka-streams";

    private final String schemaRegistryUrl;

    private final String broker;

    private final String inputTraceTopic = "pdm-input-trace";
    private final String inputTimewaveTopic = "pdm-input-raw";

    private final String outputEventTopic = "pdm-output-event";
    private final String outputTraceTopic = "pdm-output-trace";
    private final String outputTimewaveTopic = "pdm-output-raw";
    private final String outputFeatureTopic = "pdm-output-feature";
    private final String outputFaultTopic = "pdm-output-fault";

    private final String routeTraceRunTopic = "pdm-route-run";
    private final String routeFeatureTopic = "pdm-route-feature";

    protected AbstractPipeline(String brokers, String schemaUrl, String servingAddr) {
//        Objects.requireNonNull(config);
//        log.info("Configuration:\n{}", ConfigUtils.prettyPrint(config));

        this.broker = brokers;
        this.schemaRegistryUrl = schemaUrl;

        // reload master
        this.reload(servingAddr);
    }

    public void reload(String servingAddr) {
        log.info("request to update master...");

        String targetUrl = servingAddr + "/pdm/api/master/latest/equipment";
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateEqpMasterDataSet(targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/param";
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateParameterMasterDataSet(targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/event";
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateEventMasterDataSet(targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/spec";
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateParamSpecDataSet(targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/features";
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateParamFeatureDataSet(targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/health";
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateParamHealthDataSet(targetUrl);

        log.info("all master data(equipment, param, event, spec, features, health) is reloaded.");
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

    public String getSchemaRegistryUrl() {
        return schemaRegistryUrl;
    }

    public String getRouteTraceRunTopic() {
        return routeTraceRunTopic;
    }
}
