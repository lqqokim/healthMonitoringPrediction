package com.bistel.pdm.file.connector;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.lambda.kafka.partitioner.CustomStreamPartitioner;
import org.apache.commons.cli.*;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.PartitionInfo;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class Main {
    private final static Logger log = LoggerFactory.getLogger(Main.class);

//    private static final String TOPIC_PREFIX = "topicPrefix";
    private static final String WATCH_DIR = "watchDir";
    private static final String CLIENT_ID = "clientId";
    private static final String START_INDEX = "startIndex";
    private static final String PROP_KAFKA_CONF = "kafkaConf";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    private static ExecutorService executor = Executors.newFixedThreadPool(50);

    public static void main(String args[]) {

        CommandLine commandLine = parseCommandLine(args);

        String watchDir = commandLine.getOptionValue(WATCH_DIR);
        String startIndex = commandLine.getOptionValue(START_INDEX);
        String clientIdPrefix = commandLine.getOptionValue(CLIENT_ID);
        String configPath = commandLine.getOptionValue(PROP_KAFKA_CONF);
        String logPath = commandLine.getOptionValue(LOG_PATH);
        String topicName = "pdm-input-trace";

        try {
            Properties logProperties = new Properties();
            logProperties.load(new FileInputStream(logPath));
            PropertyConfigurator.configure(logProperties);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        log.debug("topic : {}", topicName);
        log.debug("client id : {}", clientIdPrefix);

        int idx = 1;
        int start = Integer.parseInt(startIndex);
        for (int i = start; i <= start + 49; i++) {
            executor.submit(new MessageSenderRunnable(configPath,
                    watchDir + "/" + idx++,
                    clientIdPrefix + i, topicName));
        }
    }

    private static CommandLine parseCommandLine(String[] args) {
//        Option topicPrefix = new Option(TOPIC_PREFIX, true, "kafka topic for input messages");
        Option watchDir = new Option(WATCH_DIR, true, "directory to monitor");
        Option clientId = new Option(CLIENT_ID, true, "client id prefix");
        Option config = new Option(PROP_KAFKA_CONF, true, "kafka config path");
        Option logConfig = new Option(LOG_PATH, true, "log config path");
        Option startIndex = new Option(START_INDEX, true, "start index");

        options.addOption(watchDir)
                .addOption(clientId)
                .addOption(startIndex)
                .addOption(config)
                .addOption(logConfig);

        if (args.length < 5) {
            printUsageAndExit();
        }
        CommandLineParser parser = new DefaultParser();
        CommandLine cmd = null;
        try {
            cmd = parser.parse(options, args);
        } catch (ParseException | NumberFormatException e) {
            log.error(e.getMessage(), e);
            printUsageAndExit();
        }
        return cmd;
    }

    private static void printUsageAndExit() {
        HelpFormatter formatter = new HelpFormatter();
        formatter.printHelp("file connector", options);
        System.exit(1);
    }

    public void awaitTerminationAfterShutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException ex) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    public synchronized void shutdown() {
        executor.shutdownNow();
        log.info("Datastore Sinker shutdown complete.");
    }

//    public static String getHostname() {
//        String hostName;
//        try {
//            hostName = InetAddress.getLocalHost().getHostName();
//            int firstDotPos = hostName.indexOf('.');
//            if (firstDotPos > 0) {
//                hostName = hostName.substring(0, firstDotPos);
//            }
//        } catch (Exception e) {
//            // fall back to env var.
//            hostName = System.getenv("HOSTNAME");
//        }
//        return hostName;
//    }
}
