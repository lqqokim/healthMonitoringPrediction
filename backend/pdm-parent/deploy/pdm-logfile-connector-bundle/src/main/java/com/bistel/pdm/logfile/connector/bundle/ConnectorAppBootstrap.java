package com.bistel.pdm.logfile.connector.bundle;

import com.bistel.pdm.logfile.connector.LogFileMonitor;
import com.bistel.pdm.logfile.connector.watcher.WatchingDirectoryScan;
import org.apache.commons.cli.*;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Properties;

public class ConnectorAppBootstrap {
    private final static Logger log = LoggerFactory.getLogger(ConnectorAppBootstrap.class);

    private static final String SERVING_ADDR = "servingAddr";
    private static final String BROKER_NAME = "brokers";
    private static final String WATCH_DIR = "watchDir";
    private static final String KEY_LIST = "keylist";
    private static final String PROP_KAFKA_CONF = "kafkaConf";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    private static ArrayList<Thread> arrThreads = new ArrayList<>();

    public static void main(String[] args) throws Exception {
        if (args.length <= 0) {
            args = new String[]{"-servingAddr", "http://localhost:8089",
                    "-brokers", "localhost:9092",
                    "-keylist", "EQP01,EQP02",
                    "-watchDir", "data/EQP01,data/EQP02",
                    "-kafkaConf", "connector/logfile-connector/src/main/resources/producer.properties",
                    "-log4jConf", "deploy/pdm-logfile-connector-bundle/src/main/resources/log4j.properties"};
        }

        CommandLine commandLine = parseCommandLine(args);

        String servingAddr = commandLine.getOptionValue(SERVING_ADDR);
        String watchDir = commandLine.getOptionValue(WATCH_DIR);
        String eqpList = commandLine.getOptionValue(KEY_LIST);
        String producerConfigPath = commandLine.getOptionValue(PROP_KAFKA_CONF);
        String logConfigPath = commandLine.getOptionValue(LOG_PATH);

        Properties logProperties = new Properties();
        logProperties.load(new FileInputStream(logConfigPath));
        PropertyConfigurator.configure(logProperties);

        log.info("Watching Directory : {}", watchDir);

        try {
            String[] keyList = eqpList.split(",");
            String[] watchingList = watchDir.split(",");

            for (int i = 0; i < keyList.length; i++) {
                WatchingDirectoryScan scan = new WatchingDirectoryScan(watchingList[i]);
                log.info("collector count : {}", scan.getConcernDirectory().size());

                LogFileMonitor monitor =
                        new LogFileMonitor(keyList[i], producerConfigPath, servingAddr, watchingList[i]);
                monitor.start();

                arrThreads.add(monitor);
            }

            try {
                for (Thread arrThread : arrThreads) {
                    arrThread.join();
                }
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }

        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private static CommandLine parseCommandLine(String[] args) {
        Option servingAddr = new Option(SERVING_ADDR, true, "serving address");
        Option broker = new Option(BROKER_NAME, true, "kafka broker");
        Option eqpList = new Option(KEY_LIST, true, "key(equipment) lists");
        Option watchDir = new Option(WATCH_DIR, true, "directory to monitor");
        Option producerConfig = new Option(PROP_KAFKA_CONF, true, "kafka producer config path");
        Option logConfig = new Option(LOG_PATH, true, "log config path");

        options.addOption(servingAddr)
                .addOption(broker)
                .addOption(eqpList)
                .addOption(watchDir)
                .addOption(producerConfig).
                addOption(logConfig);

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
        formatter.printHelp("connector server", options);
        System.exit(1);
    }
}
