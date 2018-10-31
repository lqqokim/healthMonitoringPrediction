package com.bistel.pdm.batch;

import com.bistel.pdm.batch.processor.TransformTimewaveProcessor;
import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;

/**
 *
 */
public class BatchTimewaveTaskDef extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(BatchTimewaveTaskDef.class);

    private final String applicationId;
    private final int streamThreadCount;

    public BatchTimewaveTaskDef(String applicationId, String brokers, String servingAddr, String streamThreadCount) {

        super(brokers, servingAddr);
        this.applicationId = applicationId;
        this.streamThreadCount = Integer.parseInt(streamThreadCount);
    }

    public void start() {
        if (this.applicationId != null) {
            log.info("Starting Batch Layer - {}", this.applicationId);
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

        topology.addSource("input-raw", this.getInputTimewaveTopic())
                .addProcessor("transform", TransformTimewaveProcessor::new, "input-raw")
                .addSink("output-raw", this.getOutputTimewaveTopic(), "transform");

        return new KafkaStreams(topology, getStreamProperties());
    }

    private Properties getStreamProperties() {
        Properties streamProperty = new Properties();
        // Give the Streams application a unique name. The name must be unique in the Kafka cluster
        // against which the application is run.
        streamProperty.put(StreamsConfig.APPLICATION_ID_CONFIG, this.applicationId);

        // An ID string to pass to the server when making requests.
        // (This setting is passed to the consumer/producer clients used internally by Kafka Streams.)
        //streamsConfiguration.put(StreamsConfig.CLIENT_ID_CONFIG, "pdm-batch-raw-1");

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
