package com.bistel.pdm.speed;

import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import com.bistel.pdm.speed.processor.*;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.kafka.streams.state.Stores;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class SpeedTaskDef extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(SpeedTaskDef.class);

    private final String applicationId;

    public SpeedTaskDef(String applicationId, String brokers,
                        String schemaUrl, String servingAddr) {

        super(brokers, schemaUrl, servingAddr);
        this.applicationId = applicationId;
    }

    public void start() {
        if (this.applicationId != null) {
            log.info("Starting Speed Layer - {}", this.applicationId);
        }

        KafkaStreams streams = processStreams();
        //streams.cleanUp(); //don't do this in prod as it clears your state stores
        streams.start();

        log.info("***** Started Service - " + getClass().getSimpleName() + " *****");
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }

    private KafkaStreams processStreams() {
        final Topology topology = new Topology();

//        StoreBuilder<KeyValueStore<String, Long>> alarmTimeStoreSupplier =
//                Stores.keyValueStoreBuilder(
//                        Stores.inMemoryKeyValueStore("alarm-time-context"),
//                        Serdes.String(),
//                        Serdes.Long());

        StoreBuilder<KeyValueStore<String, String>> statusStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("status-context"),
                        Serdes.String(),
                        Serdes.String());

        StoreBuilder<WindowStore<String, Double>> paramValueStoreSupplier =
                Stores.windowStoreBuilder(
                        Stores.persistentWindowStore("fd-value-store",
                            TimeUnit.DAYS.toMillis(1),
                            24,
                            TimeUnit.HOURS.toMillis(1),
                            true),
                        Serdes.String(),
                        Serdes.Double());

        StoreBuilder<KeyValueStore<String, Long>> sumIntervalStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("fd-summary-interval"),
                        Serdes.String(),
                        Serdes.Long());

        StoreBuilder<KeyValueStore<String, Integer>> alarmCountStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("fd-alarm-count"),
                        Serdes.String(),
                        Serdes.Integer());

        StoreBuilder<KeyValueStore<String, Integer>> warningCountStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("fd-warning-count"),
                        Serdes.String(),
                        Serdes.Integer());

        topology.addSource("input-trace", this.getInputTraceTopic())
                .addProcessor("speed01", FilterByMasterProcessor::new, "input-trace")
                .addProcessor("speed02", MarkStatusProcessor::new, "speed01")
                .addProcessor("speed03", ExtractEventProcessor::new, "speed02")
                .addStateStore(statusStoreSupplier, "speed02")
                .addProcessor("fd0102", DetectFaultProcessor::new, "speed02")
                .addStateStore(paramValueStoreSupplier, "fd0102")
                .addStateStore(sumIntervalStoreSupplier, "fd0102")
                .addStateStore(alarmCountStoreSupplier, "fd0102")
                .addStateStore(warningCountStoreSupplier, "fd0102")
                .addProcessor("sendmail", SendMailProcessor::new, "fd0102")
                .addSink("output-trace", this.getOutputTraceTopic(), "speed02")
                .addSink("output-event", this.getOutputEventTopic(), "speed03")
                .addSink("output-fault", this.getOutputFaultTopic(), "fd0102")
                .addSink("output-raw", this.getInputTimewaveTopic(), "fd0102");

        topology.addSource("input-reload", "pdm-input-reload")
                .addProcessor("reload", ReloadMetadataProcessor::new, "input-reload");

        return new KafkaStreams(topology, getStreamProperties());
    }

    private Properties getStreamProperties() {
        Properties streamsConfiguration = new Properties();
        // Give the Streams application a unique name. The name must be unique in the Kafka cluster
        // against which the application is run.
        streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, this.applicationId);
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
