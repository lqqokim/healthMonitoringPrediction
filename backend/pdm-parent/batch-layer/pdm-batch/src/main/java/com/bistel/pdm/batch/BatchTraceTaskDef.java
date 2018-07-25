package com.bistel.pdm.batch;

import com.bistel.pdm.batch.processor.*;
import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.processor.ProcessorSupplier;
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
public class BatchTraceTaskDef extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(BatchTraceTaskDef.class);

    private final String applicationId;

    public BatchTraceTaskDef(String applicationId, String brokers,
                             String schemaUrl, String servingAddr) {

        super(brokers, schemaUrl, servingAddr);
        this.applicationId = applicationId;

        MasterDataCache.getInstance().setServingAddress(servingAddr);
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

        StoreBuilder<KeyValueStore<String, String>> statusContextStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("batch-status-context"),
                        Serdes.String(),
                        Serdes.String());

        StoreBuilder<WindowStore<String, Double>> summaryWindowStoreSupplier =
                Stores.windowStoreBuilder(
                        Stores.persistentWindowStore("batch-feature-summary",
                                TimeUnit.DAYS.toMillis(1),
                                24,
                                TimeUnit.DAYS.toMillis(1),
                                true),
                        Serdes.String(),
                        Serdes.Double());

        StoreBuilder<KeyValueStore<String, Long>> summaryIntervalStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("batch-summary-interval"),
                        Serdes.String(),
                        Serdes.Long());

        StoreBuilder<WindowStore<String, Double>> fd03WindowStoreSupplier =
                Stores.windowStoreBuilder(
                        Stores.persistentWindowStore("batch-fd03-feature-data",
                                TimeUnit.DAYS.toMillis(8),
                                24,
                                TimeUnit.DAYS.toMillis(7),
                                true),
                        Serdes.String(),
                        Serdes.Double());

        StoreBuilder<WindowStore<String, String>> fd04WindowStoreSupplier =
                Stores.windowStoreBuilder(
                        Stores.persistentWindowStore("batch-fd04-feature-data",
                                TimeUnit.DAYS.toMillis(8),
                                24,
                                TimeUnit.DAYS.toMillis(7),
                                true),
                        Serdes.String(),
                        Serdes.String());

        topology.addSource("input-reload", "pdm-input-reload")
                .addProcessor("reload", ReloadMetadataProcessor::new, "input-reload");

        topology.addSource("input-trace", this.getInputTraceTopic())
                .addProcessor("batch01", FilterByMasterProcessor::new, "input-trace")
                .addProcessor("batch02", StatusContextProcessor::new, "batch01")
                .addStateStore(statusContextStoreSupplier, "batch02")
                .addProcessor("batch03", AggregateFeatureProcessor::new, "batch02")
                .addStateStore(summaryWindowStoreSupplier, "batch03")
                .addStateStore(summaryIntervalStoreSupplier, "batch03")
                .addSink("output-feature", this.getOutputFeatureTopic(), "batch03")
                .addSink("route-feature", this.getRouteFeatureTopic(), "batch03");

        topology.addSource("input-feature", this.getRouteFeatureTopic())
                .addProcessor("fd03", TrendChangeProcessor::new, "input-feature")
                .addStateStore(fd03WindowStoreSupplier, "fd03")
                //.addProcessor("fd04", PredictRULProcessor::new, "input-feature")
                //.addStateStore(fd04WindowStoreSupplier, "fd04")
                .addSink("output-health-fd03", this.getOutputParamHealthTopic(), "fd03")
                .addSink("route-health-fd03", this.getRouteHealthTopic(), "fd03");
        //.addSink("output-health-fd04", this.getOutputParamHealthTopic(), "fd04")
        //.addSink("route-health-fd04", this.getRouteHealthTopic(), "fd04");

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
