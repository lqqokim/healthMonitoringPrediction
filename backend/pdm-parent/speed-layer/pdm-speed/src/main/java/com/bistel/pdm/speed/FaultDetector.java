package com.bistel.pdm.speed;

import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import com.bistel.pdm.speed.functions.OutOfSpecChecker;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;

/**
 *
 */
public class FaultDetector extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(FaultDetector.class);

    private static final String stateDir = "/tmp/kafka-streams";

    public FaultDetector(String applicationId, String brokers,
                         String inTopicName, String outTopicName, String servingAddr) {

        super(brokers, inTopicName, outTopicName, servingAddr);
        this.applicationId = applicationId;
    }

    @Override
    protected String getApplicationId() {
        return this.applicationId;
    }

    @Override
    public void close() throws IOException {

    }

    public void start() {
        String id = getApplicationId();
        if (id != null) {
            log.info("Starting Speed Layer - {}", id);
        }

        KafkaStreams streams = processStreams();
        streams.start();

        log.info("***** Started Service - " + getClass().getSimpleName() + " *****");
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }

    private KafkaStreams processStreams() {
        //Latch onto instances of the input topics
        StreamsBuilder builder = new StreamsBuilder();

        // read the source stream
        final KStream<String, byte[]> featureRecords = builder.stream(this.getInputTopic());

        // check spec.
        final KStream<String, byte[]> OOS = OutOfSpecChecker.build(featureRecords);
        OOS.to(this.getOutputTopic());

        log.debug("input : {}, output : {}", this.getInputTopic(), this.getOutputTopic());

        return new KafkaStreams(builder.build(), getStreamProperties());
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

        streamsConfiguration.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        streamsConfiguration.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);
        streamsConfiguration.put(StreamsConfig.STATE_DIR_CONFIG, stateDir);

        return streamsConfiguration;
    }
}
