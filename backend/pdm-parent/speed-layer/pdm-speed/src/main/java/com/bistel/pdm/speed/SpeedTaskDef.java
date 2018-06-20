package com.bistel.pdm.speed;

import com.bistel.pdm.common.enums.DataType;
import com.bistel.pdm.speed.processor.CalculateHealthIndexProcessor;
import com.bistel.pdm.speed.processor.DetectChangeProcessor;
import com.bistel.pdm.speed.processor.PredictFaultProcessor;
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

import java.util.Properties;

/**
 *
 */
public class SpeedTaskDef {
    private static final Logger log = LoggerFactory.getLogger(SpeedTaskDef.class);

    private static final String stateDir = "/tmp/kafka-streams";

    private final String applicationId;
    private final String brokers;

    public SpeedTaskDef(String applicationId, String brokers) {
        this.applicationId = applicationId;
        this.brokers = brokers;
    }

    public void start(DataType datatype) {
        String id = this.applicationId;
        if (id != null) {
            log.info("Starting Batch Layer - {}", id);
        }

        KafkaStreams streams = processStreams(datatype);
        //streams.cleanUp(); //don't do this in prod as it clears your state stores
        streams.start();

        log.info("***** Started Service - " + getClass().getSimpleName() + " *****");
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }

    private KafkaStreams processStreams(final DataType dataType) {
        final Topology topology = new Topology();

        // Using a `KeyValueStoreBuilder` to build a `KeyValueStore`.
        StoreBuilder<KeyValueStore<String, byte[]>> processingWindowSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("persistent-90days"),
                        Serdes.String(),
                        Serdes.ByteArray());

        topology.addSource("input-features", "pdm-features")
                .addProcessor("detectChange", DetectChangeProcessor::new, "input-features")
                .addSink("output-fault", "pdm-output-fault", "detectChange")

                .addProcessor("calculateHealth", CalculateHealthIndexProcessor::new, "detectChange")
                .addSink("output-health", "pdm-output-health", "calculateHealth")

                .addProcessor("predict", PredictFaultProcessor::new, "input-features")
                .addSink("output-predict", "pdm-output-predict", "predict");

        return new KafkaStreams(topology, getStreamProperties());
    }

    private Properties getStreamProperties() {
        Properties streamsConfiguration = new Properties();
        // Give the Streams application a unique name. The name must be unique in the Kafka cluster
        // against which the application is run.
        streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, this.applicationId);
        //streamsConfiguration.put(StreamsConfig.CLIENT_ID_CONFIG, "pdm-batch-02");
        // Where to find Kafka broker(s).
        streamsConfiguration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, this.brokers);

        //streamsConfiguration.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, this.getSchemaRegistryUrl());

        // Specify default (de)serializers for record keys and for record values.
        streamsConfiguration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfiguration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().getClass().getName());

        streamsConfiguration.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        streamsConfiguration.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);
        streamsConfiguration.put(StreamsConfig.STATE_DIR_CONFIG, stateDir);

        return streamsConfiguration;
    }
}
