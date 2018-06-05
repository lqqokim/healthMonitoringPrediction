package com.bistel.pdm.lambda.kafka;

import com.bistel.pdm.common.lang.ClassUtils;
import com.bistel.pdm.common.settings.ConfigUtils;
import com.bistel.pdm.lambda.kafka.master.ServingResource;
import com.typesafe.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.util.Objects;
import java.util.UUID;

/**
 *
 *
 */
public abstract class AbstractPipeline implements Closeable {
    private static final Logger log = LoggerFactory.getLogger(AbstractPipeline.class);

    protected String applicationId;

    private final String inputTopic;
    private final String inputBroker;

    private final String outputTopic;
    private final String outputBroker;

    private final String schemaRegistryUrl;

    protected AbstractPipeline(String inBrokers,
                               String outBrokers, String inTopicName,
                               String outTopicName, String schemaUrl, String servingAddr) {

//        Objects.requireNonNull(config);
//        log.info("Configuration:\n{}", ConfigUtils.prettyPrint(config));

        this.applicationId = this.getApplicationId();

        this.inputTopic = inTopicName;
        this.inputBroker = inBrokers;

        this.schemaRegistryUrl = schemaUrl;

        this.outputTopic = outTopicName;
        this.outputBroker = outBrokers;

        this.reload(servingAddr);
    }

    public void reload(String servingAddr) {
        log.info("request to update master...");

        String tartgetUrl = servingAddr + "/pdm/api/master/latest";
        log.info("call to {}", tartgetUrl);
        ServingResource.updateMasterDataSet(tartgetUrl);

        tartgetUrl = servingAddr + "/pdm/api/master/latest/spec";
        log.info("call to {}", tartgetUrl);
        ServingResource.updateParamSpecDataSet(tartgetUrl);

        log.info("master data is reloaded.");
    }

    protected abstract String getApplicationId();

    public String getInputTopic() {
        return inputTopic;
    }

    public String getInputBroker() {
        return inputBroker;
    }

    public String getOutputTopic() {
        return outputTopic;
    }

    public String getOutputBroker() {
        return outputBroker;
    }

    public String getSchemaRegistryUrl() {
        return schemaRegistryUrl;
    }
}
