package com.bistel.pdm.speed.bundle;

import com.bistel.pdm.speed.SpeedTaskDef;
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
    private static final String INPUT_TOPIC = "inputTopic";
    private static final String OUTPUT_TOPIC = "outputTopic";
    private static final String SERVING_ADDR = "servingAddr";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    public static void main(String[] args) throws Exception {
        log.info("args size={}, args={}", args.length, args);

        CommandLine commandLine = parseCommandLine(args);
        String appId = commandLine.getOptionValue(APPLICATION_ID);
        String brokers = commandLine.getOptionValue(BROKERS);
        String inTopic = commandLine.getOptionValue(INPUT_TOPIC);
        String outTopic = commandLine.getOptionValue(OUTPUT_TOPIC);
        String servingAddr = commandLine.getOptionValue(SERVING_ADDR);
        String logPath = commandLine.getOptionValue(LOG_PATH);

        Properties logProperties = new Properties();
        logProperties.load(new FileInputStream(logPath));
        PropertyConfigurator.configure(logProperties);

//        try (SpeedTaskDef processor =
//                     new SpeedTaskDef(appId, brokers,
//                             inTopic, outTopic, servingAddr)) {
//
//            processor.start();
//        }
    }

    private static CommandLine parseCommandLine(String[] args) {
        Option appId = new Option(APPLICATION_ID, true, "application id");
        Option broker = new Option(BROKERS, true, "input/output broker");
        Option inTopic = new Option(INPUT_TOPIC, true, "input topic name");
        Option outTopic = new Option(OUTPUT_TOPIC, true, "output topic name");
        Option servingAddr = new Option(SERVING_ADDR, true, "serving address");
        Option logPath = new Option(LOG_PATH, true, "config path");

        options.addOption(appId).addOption(broker)
                .addOption(inTopic).addOption(outTopic)
                .addOption(servingAddr).addOption(logPath);

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
