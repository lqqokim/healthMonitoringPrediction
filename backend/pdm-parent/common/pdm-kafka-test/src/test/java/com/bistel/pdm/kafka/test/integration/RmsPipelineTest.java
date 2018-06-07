package com.bistel.pdm.kafka.test.integration;

import com.bistel.pdm.kafka.test.EmbeddedSingleNodeKafkaCluster;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

public class RmsPipelineTest {

    @ClassRule
    public static final EmbeddedSingleNodeKafkaCluster CLUSTER = new EmbeddedSingleNodeKafkaCluster();

    private static String inputTopic = "pdm-input-trace";
    private static String outputTopic = "pdm-output-trace";

    @BeforeClass
    public static void startKafkaCluster() {
        CLUSTER.createTopic(inputTopic);
        CLUSTER.createTopic(outputTopic);
    }

    @Test
    public void shouldWriteTheInputDataAsIsToTheOutputTopic() throws Exception {

    }
}
