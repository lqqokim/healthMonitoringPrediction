//package com.bistel.pdm.speed.processor;
//
//import org.apache.kafka.common.serialization.*;
//import org.apache.kafka.streams.StreamsConfig;
//import org.apache.kafka.streams.Topology;
//import org.apache.kafka.streams.TopologyTestDriver;
//import org.apache.kafka.streams.state.KeyValueStore;
//import org.apache.kafka.streams.state.Stores;
//import org.apache.kafka.streams.test.ConsumerRecordFactory;
//import org.apache.kafka.streams.test.OutputVerifier;
//import org.junit.After;
//import org.junit.Assert;
//import org.junit.Before;
//import org.junit.Test;
//
//import java.util.Properties;
//
//public class ExtractEventProcessorTest {
//
//    private TopologyTestDriver testDriver;
//    private KeyValueStore<String, String> store;
//
//    private StringDeserializer stringDeserializer = new StringDeserializer();
//    private ByteArrayDeserializer byteArrayDeserializer = new ByteArrayDeserializer();
//    private ConsumerRecordFactory<String, byte[]> recordFactory =
//            new ConsumerRecordFactory<>(new StringSerializer(), new ByteArraySerializer());
//
//    @Before
//    public void setUp() throws Exception {
//        Topology topology = new Topology();
//        topology.addSource("input-trace", "pdm-input-trace")
//                .addProcessor("prepare", PrepareDataProcessor::new, "input-trace")
//                .addProcessor("speed03", ExtractEventProcessor::new, "prepare");
//
//        topology.addStateStore(
//                Stores.keyValueStoreBuilder(
//                        Stores.persistentKeyValueStore("speed-status-context"),
//                        Serdes.String(),
//                        Serdes.String()).withLoggingDisabled(), // need to disable logging to allow store pre-populating
//                "speed02");
//
//        topology.addSink("output-event", "pdm-output-event", "speed03");
//
//        // setup test driver
//        Properties config = new Properties();
//        config.setProperty(StreamsConfig.APPLICATION_ID_CONFIG, "Event");
//        config.setProperty(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "dummy:1234");
//        config.setProperty(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
//        config.setProperty(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().getClass().getName());
//        testDriver = new TopologyTestDriver(topology, config);
//
//        // pre-populate store
//        store = testDriver.getKeyValueStore("speed-status-context");
//        store.put("EQP01", ":");
//    }
//
//    @After
//    public void tearDown() throws Exception {
//        testDriver.close();
//    }
//
//    @Test
//    public void shouldFlushStoreForFirstInput() {
//        String msg = "2018-07-30 11:23:15.283,1014,0,453,855,1,100,673,0,0,320,300";
//        testDriver.pipeInput(recordFactory.create("pdm-input-trace", "EQP01", msg.getBytes(), 9999L));
//
//        OutputVerifier.compareKeyValue(testDriver.readOutput("pdm-output-event", stringDeserializer, byteArrayDeserializer),
//                "EQP01", "".getBytes());
//
//        Assert.assertNull(testDriver.readOutput("pdm-output-event", stringDeserializer, byteArrayDeserializer));
//    }
//}