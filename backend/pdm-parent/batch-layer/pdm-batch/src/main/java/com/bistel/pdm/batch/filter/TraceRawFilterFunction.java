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
import org.apache.kafka.streams.kstream.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

public class TraceRawFilterFunction extends AbstractPipeline {
    private static final Logger log = LoggerFactory.getLogger(TraceRawFilterFunction.class);

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    public TraceRawFilterFunction(String applicationId, String inBrokers,
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
        //streamsConfiguration.put(StreamsConfig.CLIENT_ID_CONFIG, "pdm-batch-01");
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
        final KStream<String, byte[]> rawDataSet = builder.stream(this.getInputTopic());

        final KStream<String, byte[]> filteredDataSet = rawDataSet.filter((partitionKey, traceRawData) -> {
            String value = new String(traceRawData);
            String[] columns = value.split(",");

            String paramKey = partitionKey + "," + columns[4]; //area,eqp,param

            if(!MasterDataCache.getInstance().getMasterContainsKey(paramKey)){
                log.info("{} does not existed.", paramKey);
            }
            //Collect only the data that matches the registered master.
            return MasterDataCache.getInstance().getMasterContainsKey(paramKey);
        }).map((partitionKey, bytes) -> {
            String value = new String(bytes);
            String[] columns = value.split(",");

            String paramKey = partitionKey + "," + columns[4];

            Long paramRawid = MasterDataCache.getInstance().getRawId(paramKey);
            Pair<Float, Float> paramSpec = MasterDataCache.getInstance().getAlarmWarningSpec(paramKey);

            // param_mst_rawid, value, alarm_spec, warning_spec, event_dtts,
            // frequency, timewave, freq count, max freq, rpm, rsd01~05

            // 0  : 2018-04-27 08:50:00,
            // 1  : fab1,
            // 2  : Demo_Area,
            // 3  : Demo1,
            // 4  : Fan DE1 Acceleration,
            // 5  : RAW,
            // 6  : 1.6,
            // 7  : 1.342991,
            // 8  : 0.0^0.0^0.0^0.007003599392926243^0.004083909132515738 ...,
            // 9  : 0.07099906503812435^-0.007314464117938635^-0.043057812107598764...,
            // 10 : 1600,
            // 11 : 500,
            // 12 : 0.0

            StringBuilder sbValue = new StringBuilder();

            if(paramSpec == null){
                sbValue.append(paramRawid).append(",")
                        .append(columns[7]).append(",") //value
                        .append("").append(",") //alarm
                        .append("").append(",") //warning
                        .append(parseStringToTimestamp(columns[0])).append(",")

                        .append(columns[11]).append(",") // max frequency
                        .append(columns[10]).append(",") // freq count
                        .append(columns[12]).append(",") // rpm
                        .append(columns[6]).append(",") //sampling time
                        .append(columns[8]).append(",") //frequency blob
                        .append(columns[9]); // timewave blob
            } else {
                sbValue.append(paramRawid).append(",")
                        .append(columns[7]).append(",") //value
                        .append(paramSpec.getFirst()).append(",") //alarm
                        .append(paramSpec.getSecond()).append(",") //warning
                        .append(parseStringToTimestamp(columns[0])).append(",")

                        .append(columns[11]).append(",") // max frequency
                        .append(columns[10]).append(",") // freq count
                        .append(columns[12]).append(",") // rpm
                        .append(columns[6]).append(",") //sampling time
                        .append(columns[8]).append(",") //frequency blob
                        .append(columns[9]); // timewave blob
            }

            return new KeyValue<>(partitionKey, sbValue.toString().getBytes());
        });

        // Write (i.e. persist) the results to a new Kafka topic called "pdm-output".
        // In this case we can rely on the default serializers for keys and values because their data
        // types did not change, i.e. we only need to provide the name of the output topic.
        filteredDataSet.to(this.getOutputTopic());
        log.debug("raw filter output : {}", this.getOutputTopic());

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
    public void close() throws IOException {

    }
}
