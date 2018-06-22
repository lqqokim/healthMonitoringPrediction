package com.bistel.pdm.batch.bundle;

import com.bistel.pdm.batch.BatchTimewaveTaskDef;
import com.bistel.pdm.batch.BatchTraceTaskDef;
import com.bistel.pdm.common.enums.DataType;
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
public final class BatchStreamAppBootstrap {
    private final static Logger log = LoggerFactory.getLogger(BatchStreamAppBootstrap.class);

    private static final String APPLICATION_ID = "appId";
    private static final String BROKERS = "brokers";
    private static final String SCHEMA_REGISTRY_URL = "registryUrl";
    private static final String SERVING_ADDR = "servingAddr";
    private static final String PIPELINE = "pipeline";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    public static void main(String[] args) throws Exception {
        log.info("args size={}, args={}", args.length, args);

        CommandLine commandLine = parseCommandLine(args);
        String appId = commandLine.getOptionValue(APPLICATION_ID);
        String brokers = commandLine.getOptionValue(BROKERS);
        String schemaUrl = commandLine.getOptionValue(SCHEMA_REGISTRY_URL);
        String servingAddr = commandLine.getOptionValue(SERVING_ADDR);
        String pipeline = commandLine.getOptionValue(PIPELINE);
        String logPath = commandLine.getOptionValue(LOG_PATH);

        Properties logProperties = new Properties();
        logProperties.load(new FileInputStream(logPath));
        PropertyConfigurator.configure(logProperties);

        if (pipeline.equalsIgnoreCase("TRACE")) {
            try (BatchTraceTaskDef processor = new BatchTraceTaskDef(appId, brokers, schemaUrl, servingAddr)) {
                processor.start();
            }
        } else if (pipeline.equalsIgnoreCase("RAW")) {
//            try (BatchTimewaveTaskDef processor = new BatchTimewaveTaskDef(appId, brokers, schemaUrl, servingAddr)) {
//                processor.start(DataType.TimeWave);
//            }
        } else {
            log.info("Not supported.");
        }
    }

    private static CommandLine parseCommandLine(String[] args) {
        Option appId = new Option(APPLICATION_ID, true, "application id");
        Option broker = new Option(BROKERS, true, "input/output broker");
        Option schemaUrl = new Option(SCHEMA_REGISTRY_URL, true, "schema registry url");
        Option servingAddr = new Option(SERVING_ADDR, true, "serving address");
        Option pipeline = new Option(PIPELINE, true, "streaming pipeline");
        Option logPath = new Option(LOG_PATH, true, "config path");

        options.addOption(appId)
                .addOption(broker)
                .addOption(schemaUrl)
                .addOption(servingAddr)
                .addOption(pipeline)
                .addOption(logPath);

        if (args.length < 6) {
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
