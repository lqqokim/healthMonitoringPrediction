package com.bistel.pdm.batch;

import com.bistel.pdm.batch.processor.BatchProcessor;
import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import com.bistel.pdm.lambda.kafka.partitioner.CustomStreamPartitioner;
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
public class BatchSummaryTaskDef extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(BatchSummaryTaskDef.class);

    private final String applicationId;
    private final int streamThreadCount;

    public BatchSummaryTaskDef(String applicationId, String brokers,
                             String schemaUrl, String servingAddr, String streamThreadCount) {

        super(brokers, schemaUrl, servingAddr);
        this.applicationId = applicationId;
        this.streamThreadCount = Integer.parseInt(streamThreadCount);
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

        StoreBuilder<WindowStore<String, Double>> contValueWindowStoreSupplier =
                Stores.windowStoreBuilder(
                        Stores.persistentWindowStore("batch-continuous-summary",
                                TimeUnit.DAYS.toMillis(1),
                                24,
                                TimeUnit.DAYS.toMillis(1),
                                true),
                        Serdes.String(),
                        Serdes.Double());

        StoreBuilder<WindowStore<String, String>> catValueWindowStoreSupplier =
                Stores.windowStoreBuilder(
                        Stores.persistentWindowStore("batch-categorical-summary",
                                TimeUnit.DAYS.toMillis(1),
                                24,
                                TimeUnit.DAYS.toMillis(1),
                                true),
                        Serdes.String(),
                        Serdes.String());

        CustomStreamPartitioner partitioner = new CustomStreamPartitioner();

        topology.addSource("input-trace", this.getInputTraceTopic())
                .addProcessor("batch", BatchProcessor::new, "input-trace")
                .addStateStore(contValueWindowStoreSupplier, "batch")
                .addStateStore(catValueWindowStoreSupplier, "batch")
                .addSink("output-feature", this.getOutputFeatureTopic(), partitioner, "batch")
                .addSink("output-dimension", this.getOutputDimensionTopic(), partitioner, "batch");

        return new KafkaStreams(topology, getStreamProperties());
    }

    private Properties getStreamProperties() {
        Properties streamProps = new Properties();
        // Give the Streams application a unique name. The name must be unique in the Kafka cluster
        // against which the application is run.
        streamProps.put(StreamsConfig.APPLICATION_ID_CONFIG, this.applicationId);

        // An ID string to pass to the server when making requests.
        // (This setting is passed to the consumer/producer clients used internally by Kafka Streams.)
        //streamsConfiguration.put(StreamsConfig.CLIENT_ID_CONFIG, "pdm-batch-trace-1");

        // Where to find Kafka broker(s).
        streamProps.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, this.getBroker());

        //streamsConfiguration.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, this.getSchemaRegistryUrl());

        // Specify default (de)serializers for record keys and for record values.
        streamProps.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamProps.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().getClass().getName());

        streamProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, AUTO_OFFSET_RESET_CONFIG);

        streamProps.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);

        // The number of threads to execute stream processing. default is 1.
        streamProps.put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, streamThreadCount);

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
