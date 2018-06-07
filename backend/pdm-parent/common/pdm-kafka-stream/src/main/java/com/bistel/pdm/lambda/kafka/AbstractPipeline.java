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

    protected String applicationId;

    private final String broker;
    private final String inputTopic;

    private final String outputTopic;
    private final String outputFeatureTopic;

    private final String featureTopic;

    private final String schemaRegistryUrl;

    protected AbstractPipeline(String brokers,
                               String inTopicName,
                               String outTopicName,
                               String outputFeatureTopic,
                               String featureTopic,
                               String schemaUrl,
                               String servingAddr) {

//        Objects.requireNonNull(config);
//        log.info("Configuration:\n{}", ConfigUtils.prettyPrint(config));

        this.applicationId = this.getApplicationId();
        this.broker = brokers;

        this.inputTopic = inTopicName;
        this.outputTopic = outTopicName;
        this.outputFeatureTopic = outputFeatureTopic;
        this.featureTopic = featureTopic;

        this.schemaRegistryUrl = schemaUrl;

        this.reload(servingAddr);
    }

    protected AbstractPipeline(String brokers,
                               String inTopicName,
                               String outTopicName,
                               String servingAddr) {

//        Objects.requireNonNull(config);
//        log.info("Configuration:\n{}", ConfigUtils.prettyPrint(config));

        this.applicationId = this.getApplicationId();
        this.broker = brokers;

        this.inputTopic = inTopicName;
        this.outputTopic = outTopicName;

        this.outputFeatureTopic = "";
        this.featureTopic = "";
        this.schemaRegistryUrl = "";

        this.reload(servingAddr);
    }

    public void reload(String servingAddr) {
        log.info("request to update master...");

        String tartgetUrl = servingAddr + "/pdm/api/master/latest/param";
        log.info("call to {}", tartgetUrl);
        MasterDataUpdater.updateMasterDataSet(tartgetUrl);

        tartgetUrl = servingAddr + "/pdm/api/master/latest/spec";
        log.info("call to {}", tartgetUrl);
        MasterDataUpdater.updateParamSpecDataSet(tartgetUrl);

        tartgetUrl = servingAddr + "/pdm/api/master/latest/features";
        log.info("call to {}", tartgetUrl);
        MasterDataUpdater.updateParamFeatureDataSet(tartgetUrl);

        log.info("all master data(param, spec, features) is reloaded.");
    }

    protected abstract String getApplicationId();

    public String getBroker() {
        return broker;
    }

    public String getInputTopic() {
        return inputTopic;
    }

    public String getOutputFeatureTopic() {
        return outputFeatureTopic;
    }

    public String getFeatureTopic() {
        return featureTopic;
    }

    public String getOutputTopic() {
        return outputTopic;
    }

    public String getSchemaRegistryUrl() {
        return schemaRegistryUrl;
    }
}
