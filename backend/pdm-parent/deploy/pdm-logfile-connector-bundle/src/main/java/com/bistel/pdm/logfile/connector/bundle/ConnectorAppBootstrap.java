package com.bistel.pdm.logfile.connector.bundle;

import com.bistel.pdm.logfile.connector.LogFileRestServer;
import com.bistel.pdm.logfile.connector.LogFileWatcher;
import com.bistel.pdm.logfile.connector.watcher.WatchingDirectoryScan;
import org.apache.commons.cli.*;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.net.InetAddress;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Properties;

public class ConnectorAppBootstrap {
    private final static Logger log = LoggerFactory.getLogger(ConnectorAppBootstrap.class);

    private static final String hostName = getHostname();

    private static final String SERVER = "server";
    private static final String PORT = "port";
    private static final String BROKER_NAME = "brokers";
    private static final String TOPIC_PREFIX = "topicPrefix";
    private static final String WATCH_DIR = "watchDir";
    private static final String CLIENT_ID = "clientId";
    private static final String PROP_KAFKA_CONF = "kafkaConf";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    private static ArrayList<Thread> watcherThreads = new ArrayList<>();

    public static void main(String[] args) throws Exception {
        if (args.length <= 0) {
            args = new String[]{"-server localhost" +
                    "-port 8989" +
                    "-brokers 192.168.7.228",
                    "-topicPrefix pdm-input",
                    "-watchDir /Users/hansonjang/pdm/test/",
                    "-clientId client-0",
                    "-kafkaConf /Users/hansonjang/Documents/opensource/pdm-parent/support/pdm-log-connector/target/classes/producer.properties",
                    "-log4jConf /Users/hansonjang/Documents/opensource/pdm-parent/support/pdm-log-connector/target/classes/log4j.properties"};
        }


        CommandLine commandLine = parseCommandLine(args);

        String server = commandLine.getOptionValue(SERVER);
        String port = commandLine.getOptionValue(PORT);

        String host = commandLine.getOptionValue(BROKER_NAME);
        if (host == null || host.isEmpty()) {
            host = hostName;
        }

        String watchDir = commandLine.getOptionValue(WATCH_DIR);
        String clientId = commandLine.getOptionValue(CLIENT_ID);
        String destTopicPrefix = commandLine.getOptionValue(TOPIC_PREFIX);
        String configPath = commandLine.getOptionValue(PROP_KAFKA_CONF);
        String logPath = commandLine.getOptionValue(LOG_PATH);

        Properties logProperties = new Properties();
        logProperties.load(new FileInputStream(logPath));
        PropertyConfigurator.configure(logProperties);

        log.info("Watching File : {}", watchDir);

        try {
            WatchingDirectoryScan scan = new WatchingDirectoryScan(watchDir);
            log.info("collector count : {}", scan.getConcernDirectory().size());

            int idx = 1;
            for (Path watchingPath : scan.getConcernDirectory()) {
                LogFileWatcher monitor =
                        new LogFileWatcher(configPath, clientId + idx, destTopicPrefix, watchingPath);
                monitor.setDaemon(true);
                monitor.start();
                idx++;

                watcherThreads.add(monitor);
            }

            for (Thread arrThread : watcherThreads) {
                arrThread.join();
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        // REST Server
        try (LogFileRestServer restServer = new LogFileRestServer()) {
            int portNum = Integer.parseInt(port);
            restServer.start(server, portNum);
        }
    }

    private static CommandLine parseCommandLine(String[] args) {
        Option server = new Option(SERVER, true, "rest server address");
        Option port = new Option(PORT, true, "listen port");
        Option host = new Option(BROKER_NAME, true, "kafka broker");
        Option topicPrefix = new Option(TOPIC_PREFIX, true, "kafka topic for input messages");
        Option watchDir = new Option(WATCH_DIR, true, "directory to monitor");
        Option clientId = new Option(CLIENT_ID, true, "client id");
        Option config = new Option(PROP_KAFKA_CONF, true, "kafka config path");
        Option logConfig = new Option(LOG_PATH, true, "log config path");

        options.addOption(server).addOption(port).addOption(host)
                .addOption(topicPrefix).addOption(watchDir)
                .addOption(clientId)
                .addOption(config).addOption(logConfig);

        if (args.length < 8) {
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

    public static String getHostname() {
        String hostName;
        try {
            hostName = InetAddress.getLocalHost().getHostName();
            int firstDotPos = hostName.indexOf('.');
            if (firstDotPos > 0) {
                hostName = hostName.substring(0, firstDotPos);
            }
        } catch (Exception e) {
            // fall back to env var.
            hostName = System.getenv("HOSTNAME");
        }
        return hostName;
    }

    static class cleanupThread extends Thread {
        @Override
        public void run() {
            try {

            } catch (Throwable t) {
                log.error("Shutdown failure in connector : ", t);
            }
        }
    }
}
