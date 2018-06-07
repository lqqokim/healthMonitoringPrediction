package com.bistel.pdm.batch;

import com.bistel.pdm.batch.functions.FeatureAggregator;
import com.bistel.pdm.batch.functions.ParameterFilter;
import com.bistel.pdm.batch.functions.TimewaveRawIdMapper;
import com.bistel.pdm.batch.functions.TraceRawIdMapper;
import com.bistel.pdm.common.enums.DataType;
import com.bistel.pdm.lambda.kafka.AbstractPipeline;
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
public class Preprocessor extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(Preprocessor.class);

    private static final String stateDir = "/tmp/kafka-streams";

    public Preprocessor(String applicationId, String brokers,
                        String inTopicName, String outTopicName,
                        String outputFeatureTopic, String featureTopic,
                        String schemaUrl, String servingAddr) {

        super(brokers, inTopicName, outTopicName, outputFeatureTopic, featureTopic, schemaUrl, servingAddr);
        this.applicationId = applicationId;
    }

    public void start(DataType datatype) {
        String id = getApplicationId();
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
        //Latch onto instances of the input topics
        StreamsBuilder builder = new StreamsBuilder();

        // read the source stream
        final KStream<String, byte[]> traceRecords = builder.stream(this.getInputTopic());

        // filter record
        final KStream<String, byte[]> filteredRecords = ParameterFilter.build(traceRecords);

        if (dataType == DataType.TimeWave || dataType == DataType.Frequency) {
            // mapping the param rawid
            final KStream<String, byte[]> resultRecords = TimewaveRawIdMapper.build(filteredRecords);

            // Write (i.e. persist) the results to a new Kafka topic called "pdm-output".
            // In this case we can rely on the default serializers for keys and values because their data
            // types did not change, i.e. we only need to provide the name of the output topic.
            resultRecords.to(this.getOutputTopic());
            log.debug("input : {}, output : {}", this.getInputTopic(), this.getOutputTopic());

        } else {
            // mapping the param rawid
            final KStream<String, byte[]> resultRecords = TraceRawIdMapper.build(filteredRecords);
            resultRecords.to(this.getOutputTopic());
            log.debug("input : {}, output : {}", this.getInputTopic(), this.getOutputTopic());

            if (dataType != DataType.Summarized) {
                //
                final KStream<String, byte[]> aggFeatures = FeatureAggregator.build(resultRecords);
                aggFeatures.to(this.getOutputFeatureTopic()); //pdm-output-feature
                log.info("input : {}, output : {}", this.getInputTopic(), this.getOutputFeatureTopic());

                // throw the main feature to speed layer to check spec.
                //aggFeatures.to(this.getFeatureTopic()); //pdm-feature
            }
        }

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

    @Override
    protected String getApplicationId() {
        return this.applicationId;
    }

    @Override
    public void close() throws IOException {

    }
}
