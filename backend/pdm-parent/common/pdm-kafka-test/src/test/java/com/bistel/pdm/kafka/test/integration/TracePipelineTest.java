package com.bistel.pdm.kafka.test.integration;

import com.bistel.pdm.batch.Preprocessor;
import com.bistel.pdm.common.enums.DataType;
import com.bistel.pdm.kafka.test.EmbeddedSingleNodeKafkaCluster;
import com.bistel.pdm.kafka.test.IntegrationTestUtils;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.*;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;

public class TracePipelineTest {

    @ClassRule
    public static final EmbeddedSingleNodeKafkaCluster CLUSTER = new EmbeddedSingleNodeKafkaCluster();

    private static String inputTopic = "pdm-input-trace";
    private static String outputTopic = "pdm-output-trace";
    private static String outputFeatureTopic = "pdm-output-feature";

    @BeforeClass
    public static void startKafkaCluster() {
        CLUSTER.createTopic(inputTopic);
        CLUSTER.createTopic(outputTopic);
        CLUSTER.createTopic(outputFeatureTopic);

        MasterDataCache.getInstance().putMaster("fab1,Demo_Area,Demo1", 1L);
        MasterDataCache.getInstance().putFeature(1L, new String[] {"1L", "1L", "", "", "", ""});
    }

    @Test
    public void shouldWriteTheInputDataAsIsToTheOutputTopic() throws Exception {
        List<String> inputValues = Arrays.asList(
                "2018-05-27 08:59:59.322,fab1,Demo_Area,Demo1,F1 CH1 V,RMS,1.6,0.1482648,1:2",
                "2018-05-27 09:01:01.601,fab1,Demo_Area,Demo1,F1 CH2 V,RMS,1.6,0.4554322,2:3"
        );

        try(Preprocessor processor =
                new Preprocessor("test", CLUSTER.bootstrapServers(),
                        inputTopic, outputTopic, outputFeatureTopic, "",
                        "", "")){

            processor.start(DataType.General);

            //
            // Step 2: Produce some input data to the input topic.
            //
            Properties producerConfig = new Properties();
            producerConfig.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, CLUSTER.bootstrapServers());
            producerConfig.put(ProducerConfig.ACKS_CONFIG, "all");
            producerConfig.put(ProducerConfig.RETRIES_CONFIG, 0);
            producerConfig.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
            producerConfig.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, BytesSerializer.class);
            IntegrationTestUtils.produceValuesSynchronously(inputTopic, inputValues, producerConfig);

            //
            // Step 3: Verify the application's output data.
            //
            Properties consumerConfig = new Properties();
            consumerConfig.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, CLUSTER.bootstrapServers());
            consumerConfig.put(ConsumerConfig.GROUP_ID_CONFIG, "pass-through-integration-test-standard-consumer");
            consumerConfig.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
            consumerConfig.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
            consumerConfig.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, BytesDeserializer.class);

            List<String> actualValues = IntegrationTestUtils.waitUntilMinValuesRecordsReceived(consumerConfig,
                    outputTopic, inputValues.size());

            assertThat(actualValues).isEqualTo(inputValues);
        }
    }
}
