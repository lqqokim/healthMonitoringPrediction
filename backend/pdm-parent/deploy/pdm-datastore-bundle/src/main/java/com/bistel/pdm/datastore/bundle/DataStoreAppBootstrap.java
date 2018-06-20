package com.bistel.pdm.datastore.bundle;

import com.bistel.pdm.datastore.RepositorySinker;
import org.apache.commons.cli.*;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.util.Properties;

/**
 *
 *
 */
public class DataStoreAppBootstrap {
    private final static Logger log = LoggerFactory.getLogger(DataStoreAppBootstrap.class);

    private static final String PROP_KAFKA_CONF = "kafkaConf";
    private static final String GROUP_ID = "groupId";
    private static final String TOPIC_PREFIX = "topicPrefix";
    private static final String SERVING_ADDR = "servingAddr";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    public static void main(String[] args) {
        try {
            log.info("Datastore Sinker starting...");

            if (args.length <= 0) {
                args = new String[]{"-groupId", "pdm-store-1",
                        "-topicPrefix", "pdm-output",
                        "-servingAddr", "http://192.168.7.227:28000",
                        "-kafkaConf", "/Users/hansonjang/Documents/opensource/pdm-parent/common/pdm-datastore/target/classes/consumer.properties",
                        "-log4jConf", "/Users/hansonjang/Documents/opensource/pdm-parent/deploy/pdm-datastore-sink-bundle/target/classes/log4j.properties"};
            }
            log.info("args size={}, args={}", args.length, args);

            CommandLine commandLine = parseCommandLine(args);

            String groupId = commandLine.getOptionValue(GROUP_ID);
            String topicPrefix = commandLine.getOptionValue(TOPIC_PREFIX);
            String servingAddr = commandLine.getOptionValue(SERVING_ADDR);
            String configPath = commandLine.getOptionValue(PROP_KAFKA_CONF);
            String logPath = commandLine.getOptionValue(LOG_PATH);

            Properties logProperties = new Properties();
            logProperties.load(new FileInputStream(logPath));
            PropertyConfigurator.configure(logProperties);

            RepositorySinker server = new RepositorySinker(groupId, topicPrefix, servingAddr, configPath);
            server.start();

            Runtime.getRuntime().addShutdownHook(new Thread(server::shutdown));

            server.awaitTerminationAfterShutdown();
            log.info("Datastore Sinker finished. ");

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private static CommandLine parseCommandLine(String[] args) {
        Option groupId = new Option(GROUP_ID, true, "consumer group id");
        Option topicPrefix = new Option(TOPIC_PREFIX, true, "kafka topic for input messages");
        Option servingAddr = new Option(SERVING_ADDR, true, "serving address");
        Option config = new Option(PROP_KAFKA_CONF, true, "kafka config path");
        Option logPath = new Option(LOG_PATH, true, "log config path");

        options.addOption(groupId)
                .addOption(topicPrefix)
                .addOption(servingAddr)
                .addOption(config)
                .addOption(logPath);

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
        formatter.printHelp("data store", options);
        System.exit(1);
    }
}
