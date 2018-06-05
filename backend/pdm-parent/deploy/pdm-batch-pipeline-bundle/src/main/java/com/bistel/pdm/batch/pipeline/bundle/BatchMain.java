package com.bistel.pdm.batch.pipeline.bundle;

import com.bistel.pdm.batch.filter.TraceFilterFunction;
import com.bistel.pdm.batch.filter.TraceRawFilterFunction;
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
public final class BatchMain {
    private final static Logger log = LoggerFactory.getLogger(BatchMain.class);

    private static final String APPLICATION_ID = "appId";
    private static final String INPUT_BROKERS = "inputBrokers";
    private static final String OUT_BROKERS = "outBrokers";
    private static final String SCHEMA_REGISTRY_URL = "registryUrl";
    private static final String INPUT_TOPIC = "inputTopic";
    private static final String OUTPUT_TOPIC = "outputTopic";
    private static final String SERVING_ADDR = "servingAddr";
    private static final String MODE = "mode";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    public static void main(String[] args) throws Exception {
        log.info("args size={}, args={}", args.length, args);

        CommandLine commandLine = parseCommandLine(args);
        String appId = commandLine.getOptionValue(APPLICATION_ID);
        String inBrokers = commandLine.getOptionValue(INPUT_BROKERS);
        String outBrokers = commandLine.getOptionValue(OUT_BROKERS);
        String inTopic = commandLine.getOptionValue(INPUT_TOPIC);
        String outTopic = commandLine.getOptionValue(OUTPUT_TOPIC);
        String schemaUrl = commandLine.getOptionValue(SCHEMA_REGISTRY_URL);
        String servingAddr = commandLine.getOptionValue(SERVING_ADDR);
        String mode = commandLine.getOptionValue(MODE);
        String logPath = commandLine.getOptionValue(LOG_PATH);

        Properties logProperties = new Properties();
        logProperties.load(new FileInputStream(logPath));
        PropertyConfigurator.configure(logProperties);

        if (mode.equalsIgnoreCase("RAW")) {
            try (TraceRawFilterFunction raw =
                         new TraceRawFilterFunction(appId, inBrokers, outBrokers,
                                 inTopic, outTopic, schemaUrl, servingAddr)) {
                raw.start();
            }
        } else if (mode.equalsIgnoreCase("RMS")) {
            try (TraceFilterFunction trace =
                         new TraceFilterFunction(appId, inBrokers, outBrokers,
                                 inTopic, outTopic, schemaUrl, servingAddr)) {
                trace.start();
            }
        } else {
            log.info("not supported.");
        }
    }

    private static CommandLine parseCommandLine(String[] args) {
        Option appId = new Option(APPLICATION_ID, true, "application id");
        Option inBroker = new Option(INPUT_BROKERS, true, "input broker");
        Option outBroker = new Option(OUT_BROKERS, true, "output broker");
        Option inTopic = new Option(INPUT_TOPIC, true, "input topic name");
        Option outTopic = new Option(OUTPUT_TOPIC, true, "output topic name");
        Option schemaUrl = new Option(SCHEMA_REGISTRY_URL, true, "schema registry url");
        Option servingAddr = new Option(SERVING_ADDR, true, "serving address");
        Option mode = new Option(MODE, true, "batch mode");
        Option logPath = new Option(LOG_PATH, true, "config path");

        options.addOption(appId).addOption(inBroker).addOption(outBroker)
                .addOption(inTopic).addOption(outTopic).addOption(schemaUrl)
                .addOption(servingAddr).addOption(mode).addOption(logPath);

        if (args.length < 9) {
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
        formatter.printHelp("batch", options);
        System.exit(1);
    }
}
