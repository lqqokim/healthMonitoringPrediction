package com.bistel.pdm.speed.bundle;

import com.bistel.pdm.speed.SpeedRealTimeTaskDef;
import com.bistel.pdm.speed.SpeedTimeOutTaskDef;
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
public class SpeedStreamAppBootstrap {
    private final static Logger log = LoggerFactory.getLogger(SpeedStreamAppBootstrap.class);

    private static final String APPLICATION_ID = "appId";
    private static final String BROKERS = "brokers";
    private static final String SERVING_ADDR = "servingAddr";
    private static final String LOG_PATH = "log4jConf";
    private static final String PIPELINE = "pipeline";
    private static final String STREAM_THREADS = "streamThreads";
//    private static final String RECORD_TYPE = "recordType";

    private static final Options options = new Options();

    public static void main(String[] args) throws Exception {
        log.info("args size={}, args={}", args.length, args);

        CommandLine commandLine = parseCommandLine(args);
        String appId = commandLine.getOptionValue(APPLICATION_ID);
        String brokers = commandLine.getOptionValue(BROKERS);
        String servingAddr = commandLine.getOptionValue(SERVING_ADDR);
        String logPath = commandLine.getOptionValue(LOG_PATH);
        String pipeline = commandLine.getOptionValue(PIPELINE);
        String streamThreads = commandLine.getOptionValue(STREAM_THREADS, "1");
//        String recordType = commandLine.getOptionValue(RECORD_TYPE, "MP");

        Properties logProperties = new Properties();
        logProperties.load(new FileInputStream(logPath));
        PropertyConfigurator.configure(logProperties);

        if (pipeline.equalsIgnoreCase("REALTIME")) {
            try (SpeedRealTimeTaskDef processor =
                         new SpeedRealTimeTaskDef(appId, brokers, servingAddr, streamThreads)) {
                processor.start();
            }
        } else if (pipeline.equalsIgnoreCase("TIMEOUT")) {
            try (SpeedTimeOutTaskDef processor =
                         new SpeedTimeOutTaskDef(appId, brokers, servingAddr, streamThreads)) {
                processor.start();
            }
        } else {
            log.info("Not supported.");
        }
    }

    private static CommandLine parseCommandLine(String[] args) {
        Option appId = new Option(APPLICATION_ID, true, "application id");
        Option broker = new Option(BROKERS, true, "input/output broker");
        Option servingAddr = new Option(SERVING_ADDR, true, "serving address");
        Option pipeline = new Option(PIPELINE, true, "streaming pipeline");
        Option logPath = new Option(LOG_PATH, true, "config path");
        Option streamThreads = new Option(STREAM_THREADS, true, "stream thread count");
//        Option recordType = new Option(RECORD_TYPE, true, "record type");

        options.addOption(appId)
                .addOption(broker)
                .addOption(servingAddr)
                .addOption(pipeline)
                .addOption(logPath)
                .addOption(streamThreads);

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
        formatter.printHelp("speed", options);
        System.exit(1);
    }
}
