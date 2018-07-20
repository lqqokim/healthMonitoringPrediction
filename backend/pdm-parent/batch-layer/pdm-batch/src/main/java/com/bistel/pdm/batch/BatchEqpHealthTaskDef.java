package com.bistel.pdm.batch;

import com.bistel.pdm.batch.processor.EquipmentHealthProcessor;
import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.kafka.streams.state.Stores;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;

/**
 *
 */
public class BatchEqpHealthTaskDef extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(BatchEqpHealthTaskDef.class);

    private final String applicationId;

    public BatchEqpHealthTaskDef(String applicationId, String brokers,
                                 String schemaUrl, String servingAddr) {

        super(brokers, schemaUrl, servingAddr);
        this.applicationId = applicationId;
    }

    public void start() {
        if (this.applicationId != null) {
            log.info("Starting Batch Layer - {}", this.applicationId);
        }

        KafkaStreams streams = processStreams();
        //streams.cleanUp(); //don't do this in prod as it clears your state stores
        streams.start();

        log.info("***** Started Service - " + getClass().getSimpleName() + " *****");
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }

    private KafkaStreams processStreams() {

        final Topology topology = new Topology();

        StoreBuilder<KeyValueStore<String, Integer>> paramCountStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("batch-param-count"),
                        Serdes.String(),
                        Serdes.Integer());

        StoreBuilder<KeyValueStore<String, String>> eqpHealthStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("batch-equipment-health"),
                        Serdes.String(),
                        Serdes.String());

        topology.addSource("input-health", this.getRouteHealthTopic())
                .addProcessor("eqp-health", EquipmentHealthProcessor::new, "input-health")
                .addStateStore(paramCountStoreSupplier, "eqp-health")
                .addStateStore(eqpHealthStoreSupplier, "eqp-health")
                .addSink("output-eqp-health", this.getOutputEQPHealthTopic(), "eqp-health");

        return new KafkaStreams(topology, getStreamProperties());
    }

    private Properties getStreamProperties() {
        Properties streamsConfiguration = new Properties();
        // Give the Streams application a unique name. The name must be unique in the Kafka cluster
        // against which the application is run.
        streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, this.getApplicationId());
        //streamsConfiguration.put(StreamsConfig.CLIENT_ID_CONFIG, "pdm-batch-02");
        // Where to find Kafka broker(s).
        streamsConfiguration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, this.getBroker());

        //streamsConfiguration.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, this.getSchemaRegistryUrl());

        // Specify default (de)serializers for record keys and for record values.
        streamsConfiguration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfiguration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().getClass().getName());

        streamsConfiguration.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, AUTO_OFFSET_RESET_CONFIG);

        streamsConfiguration.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);
        streamsConfiguration.put(StreamsConfig.STATE_DIR_CONFIG, stateDir);

        return streamsConfiguration;
    }

    @Override
    protected String getApplicationId() {
        return this.applicationId;
    }

    @Override
    public void close() throws IOException {

    }
}