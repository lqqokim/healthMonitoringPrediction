package com.bistel.pdm.speed;

import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import com.bistel.pdm.lambda.kafka.partitioner.CustomStreamPartitioner;
import com.bistel.pdm.speed.processor.SpeedProcessor;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
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

        StoreBuilder<WindowStore<String, Double>> normalizedParamValueStoreSupplier =
                Stores.windowStoreBuilder(
                        Stores.persistentWindowStore("speed-normalized-value",
                                TimeUnit.DAYS.toMillis(1),
                                24,
                                TimeUnit.HOURS.toMillis(1),
                                false),
                        Serdes.String(),
                        Serdes.Double());

        CustomStreamPartitioner partitioner = new CustomStreamPartitioner();

        topology.addSource("input-trace", this.getInputTraceTopic())
                .addSource("input-reload", this.getInputReloadTopic())
                .addProcessor("speed", SpeedProcessor::new, "input-trace", "input-reload")
                .addStateStore(normalizedParamValueStoreSupplier, "speed")

                .addSink("output-trace", this.getOutputTraceTopic(), partitioner, "speed")
                .addSink("output-event", this.getOutputEventTopic(), partitioner, "speed")
                .addSink("output-fault", this.getOutputFaultTopic(), partitioner, "speed")
                .addSink("output-health", this.getOutputHealthTopic(), partitioner, "speed")
                .addSink("output-reload", this.getOutputReloadTopic(), partitioner, "speed")
                .addSink("output-raw", this.getInputTimewaveTopic(), partitioner, "speed");

        return new KafkaStreams(topology, getStreamProperties());
    }

    private Properties getStreamProperties() {
        Properties streamProps = new Properties();
        // Give the Streams application a unique name. The name must be unique in the Kafka cluster
        // against which the application is run.
        streamProps.put(StreamsConfig.APPLICATION_ID_CONFIG, this.applicationId);

        // An ID string to pass to the server when making requests.
        // (This setting is passed to the consumer/producer clients used internally by Kafka Streams.)
        //streamsConfiguration.put(StreamsConfig.CLIENT_ID_CONFIG, "pdm-client-speed-1");

        // Where to find Kafka broker(s).
        streamProps.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, this.getBroker());

        //streamsConfiguration.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, this.getSchemaRegistryUrl());

        // Specify default (de)serializers for record keys and for record values.
        streamProps.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamProps.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().getClass().getName());

        streamProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, AUTO_OFFSET_RESET_CONFIG);

        streamProps.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);

        // The number of threads to execute stream processing. default is 1.
        streamProps.put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 9);

        streamProps.put(StreamsConfig.STATE_DIR_CONFIG, stateDir);

        return streamProps;
    }

    @Override
    protected String getApplicationId() {
        return this.applicationId;
    }

    @Override
    public void close() throws IOException {

    }
}
