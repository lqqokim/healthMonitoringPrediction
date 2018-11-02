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
public class SpeedRealTimeTaskDef extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(SpeedRealTimeTaskDef.class);

    private final String applicationId;
    private final int streamThreadCount;

    public SpeedRealTimeTaskDef(String applicationId, String brokers, String servingAddr,
                                String streamThreadCount) {

        super(brokers, servingAddr);
        this.applicationId = applicationId;
        this.streamThreadCount = Integer.parseInt(streamThreadCount);
    }

    public void start() {
        if (this.applicationId != null) {
            log.info("Starting Speed Layer - {}", this.applicationId);
        }

        KafkaStreams streams = processStreams();
        streams.setUncaughtExceptionHandler((Thread thread, Throwable throwable) -> {
            // here you should examine the throwable/exception and perform an appropriate action!
            log.error(throwable.getMessage(), throwable);
        });

        //streams.cleanUp(); //don't do this in prod as it clears your state stores
        streams.start();

        log.info("***** Started Service - " + getClass().getSimpleName() + " *****");
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }

    private KafkaStreams processStreams() {
        final Topology topology = new Topology();

        StoreBuilder<KeyValueStore<String, String>> statusContextStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("speed-status-context-store"),
                        Serdes.String(),
                        Serdes.String());

        StoreBuilder<KeyValueStore<String, String>> recordGroupStoreSupplier =
                Stores.keyValueStoreBuilder(
                        Stores.persistentKeyValueStore("speed-record-group-store"),
                        Serdes.String(),
                        Serdes.String());

        StoreBuilder<WindowStore<String, Double>> normalizedParamValueStoreSupplier =
                Stores.windowStoreBuilder(
                        Stores.persistentWindowStore("speed-normalized-value-store",
                                TimeUnit.DAYS.toMillis(5),
                                2,
                                TimeUnit.HOURS.toMillis(1),
                                false),
                        Serdes.String(),
                        Serdes.Double());

        topology.addSource("input-trace", this.getInputTraceTopic())
                .addProcessor("EntryPointProcessor", EntryPointProcessor::new, "input-trace")
                .addProcessor("RecordParserProcessor", RecordParserProcessor::new, "EntryPointProcessor")
                .addProcessor("StatusDecisionProcessor", StatusDecisionProcessor::new, "RecordParserProcessor")

                .addProcessor("EventProcessor", EventProcessor::new, "StatusDecisionProcessor")
                .addStateStore(statusContextStoreSupplier, "EventProcessor")
                .addStateStore(recordGroupStoreSupplier, "EventProcessor")
                .addSink("output-event", this.getOutputEventTopic(), "EventProcessor")

                .addProcessor("BranchProcessor", BranchProcessor::new, "EventProcessor")
                .addStateStore(normalizedParamValueStoreSupplier, "BranchProcessor")
                .addSink("output-trace", this.getOutputTraceTopic(), "BranchProcessor")

                .addProcessor("FaultDetectionProcessor", FaultDetectionProcessor::new, "BranchProcessor")
                .addSink("output-fault", this.getOutputFaultTopic(), "FaultDetectionProcessor")
                .addProcessor("IndividualHealthProcessor", IndividualHealthProcessor::new, "BranchProcessor")
                .addSink("output-health", this.getOutputHealthTopic(), "IndividualHealthProcessor");


//        StoreBuilder<WindowStore<String, Double>> normalizedParamValueStoreSupplier =
//                Stores.windowStoreBuilder(
//                        Stores.persistentWindowStore("speed-normalized-value",
//                                TimeUnit.DAYS.toMillis(5),
//                                2,
//                                TimeUnit.HOURS.toMillis(1),
//                                false),
//                        Serdes.String(),
//                        Serdes.Double());
//
////        CustomStreamPartitioner partitioner = new CustomStreamPartitioner();
//
//        topology.addSource("input-trace", this.getInputTraceTopic())
//                .addProcessor("speed", SpeedProcessor::new, "input-trace")
//                .addStateStore(normalizedParamValueStoreSupplier, "speed")
//
//                .addSink("output-trace", this.getOutputTraceTopic(), "speed")
//                .addSink("output-event", this.getOutputEventTopic(), "speed")
//                .addSink("output-fault", this.getOutputFaultTopic(), "speed")
//                .addSink("output-health", this.getOutputHealthTopic(), "speed")
//                .addSink("output-reload", this.getOutputReloadTopic(), "speed")
//                .addSink("output-raw", this.getInputTimewaveTopic(), "speed");

        return new KafkaStreams(topology, getStreamProperties());
    }

    private Properties getStreamProperties() {
        Properties streamProperty = new Properties();
        // Give the Streams application a unique name. The name must be unique in the Kafka cluster
        // against which the application is run.
        streamProperty.put(StreamsConfig.APPLICATION_ID_CONFIG, this.applicationId);

        // An ID string to pass to the server when making requests.
        // (This setting is passed to the consumer/producer clients used internally by Kafka Streams.)
        //streamsConfiguration.put(StreamsConfig.CLIENT_ID_CONFIG, "pdm-client-speed-1");

        // Where to find Kafka broker(s).
        streamProperty.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, this.getBroker());

        //streamsConfiguration.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, this.getSchemaRegistryUrl());

        // Specify default (de)serializers for record keys and for record values.
        streamProperty.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamProperty.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().getClass().getName());

        streamProperty.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, AUTO_OFFSET_RESET_CONFIG);

        streamProperty.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);

        // The number of threads to execute stream processing. default is 1.
        streamProperty.put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, streamThreadCount);

        // Enable record cache of size 10 MB.
        streamProperty.put(StreamsConfig.CACHE_MAX_BYTES_BUFFERING_CONFIG, 10 * 1024 * 1024L);

        // Set commit interval to 1 second.
        //streamProperty.put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000);

        streamProperty.put(StreamsConfig.STATE_DIR_CONFIG, stateDir);

        return streamProperty;
    }

    @Override
    protected String getApplicationId() {
        return this.applicationId;
    }

    @Override
    public void close() throws IOException {

    }
}
