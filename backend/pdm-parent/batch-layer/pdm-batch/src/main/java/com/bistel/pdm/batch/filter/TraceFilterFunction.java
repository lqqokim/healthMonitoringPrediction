package com.bistel.pdm.batch.filter;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.lambda.kafka.AbstractPipeline;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

public class TraceFilterFunction extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(TraceFilterFunction.class);

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    public TraceFilterFunction(String applicationId, String inBrokers,
                               String outBrokers, String inTopicName,
                               String outTopicName, String schemaUrl, String servingAddr) {


        super(inBrokers, outBrokers, inTopicName, outTopicName, schemaUrl, servingAddr);
        this.applicationId = applicationId;
    }

    @Override
    protected String getApplicationId() {
        return this.applicationId;
    }

    public void start() {
        String id = getApplicationId();
        if (id != null) {
            log.info("Starting Batch Layer - {}", id);
        }

        final String bootstrapServers = this.getInputBroker();
        KafkaStreams streams = processStreams(bootstrapServers, "/tmp/kafka-streams");
        //streams.cleanUp(); //don't do this in prod as it clears your state stores
        streams.start();
        log.info("***** Started Service - " + getClass().getSimpleName() + " *****");
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }

    private KafkaStreams processStreams(final String bootstrapServers, final String stateDir) {

        final Properties streamsConfiguration = new Properties();
        // Give the Streams application a unique name. The name must be unique in the Kafka cluster
        // against which the application is run.
        streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, this.getApplicationId());
        //streamsConfiguration.put(StreamsConfig.CLIENT_ID_CONFIG, "pdm-batch-02");
        // Where to find Kafka broker(s).
        streamsConfiguration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

        //streamsConfiguration.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, this.getSchemaRegistryUrl());

        // Specify default (de)serializers for record keys and for record values.
        streamsConfiguration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfiguration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().getClass().getName());

        streamsConfiguration.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        streamsConfiguration.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);
        //streamsConfiguration.put(StreamsConfig.STATE_DIR_CONFIG, stateDir);

        //Latch onto instances of the input topics
        StreamsBuilder builder = new StreamsBuilder();

        // read the source stream
        final KStream<String, byte[]> traceDataSet = builder.stream(this.getInputTopic());

        final KStream<String, byte[]> filteredDataSet = traceDataSet.filter((partitionKey, byteTraceData) -> {
            String value = new String(byteTraceData);
            String[] columns = value.split(",");

            String paramKey = partitionKey + "," + columns[4];

            if(!MasterDataCache.getInstance().getMasterContainsKey(paramKey)){
                log.debug("{} does not existed.", paramKey);
            }
            //Collect only the data that matches the registered master.
            return MasterDataCache.getInstance().getMasterContainsKey(paramKey);
        }).map((partitionKey, bytes) -> {
            String value = new String(bytes);
            String[] columns = value.split(",");

            //param_mst_rawid, value, alarm_spec, warning_spec, event_dtts, rsd01~05
            // 2018-04-27 08:49:00,
            // fab1,
            // Demo_Area,
            // Demo1,
            // Fan DE1 Acceleration,
            // RMS,
            // 1.6,
            // 0.1482648,
            // 535:267

            String paramKey = partitionKey + "," + columns[4];
            Long paramRawid = MasterDataCache.getInstance().getRawId(paramKey);
            Pair<Float, Float> paramSpec = MasterDataCache.getInstance().getAlarmWarningSpec(paramKey);

            StringBuilder sbValue = new StringBuilder();

            if(paramSpec == null){
                sbValue.append(paramRawid).append(",")
                        .append(columns[7]).append(",") //value
                        .append("").append(",") //alarm
                        .append("").append(",") //warning
                        .append(parseStringToTimestamp(columns[0])).append(",")
                        .append(columns[8]); //location
            } else {
                sbValue.append(paramRawid).append(",")
                        .append(columns[7]).append(",") //value
                        .append(paramSpec.getFirst()).append(",") //alarm
                        .append(paramSpec.getSecond()).append(",") //warning
                        .append(parseStringToTimestamp(columns[0])).append(",")
                        .append(columns[8]); //location
            }

            log.debug("throw away {} from {} to {}", partitionKey, this.getInputTopic(), this.getOutputTopic());
            return new KeyValue<>(partitionKey, sbValue.toString().getBytes());
        });

        // Write (i.e. persist) the results to a new Kafka topic called "pdm-output".
        // In this case we can rely on the default serializers for keys and values because their data
        // types did not change, i.e. we only need to provide the name of the output topic.
        filteredDataSet.to(this.getOutputTopic());
        log.debug("trace filter output : {}", this.getOutputTopic());

        return new KafkaStreams(builder.build(), streamsConfiguration);
    }

    private Long parseStringToTimestamp(String item) {
        Long time = 0L;

        try {
            Date parsedDate = dateFormat.parse(item);
            Timestamp timestamp = new Timestamp(parsedDate.getTime());
            time = timestamp.getTime();
        } catch (Exception e) {
            log.error(e.getMessage() + " : " + item, e);
        }

        return time;
    }

    @Override
    public void close() {

    }
}
