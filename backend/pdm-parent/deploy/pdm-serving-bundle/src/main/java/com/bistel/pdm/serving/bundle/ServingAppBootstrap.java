package com.bistel.pdm.serving.bundle;

import com.bistel.pdm.common.ApplicationPid;
import com.bistel.pdm.serving.ServingLayer;
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
public final class ServingAppBootstrap {
    private final static Logger log = LoggerFactory.getLogger(ServingAppBootstrap.class);

    private static final String SERVER = "server";
    private static final String PORT = "port";
    private static final String LOG_PATH = "log4jConf";

    private static final Options options = new Options();

    public static void main(String[] args) throws Exception {
        if (args.length <= 0) {
            args = new String[]{"-server localhost", "-port 28000", "-log4jConf log4j.properties"};
        }

        log.info("args size={}, args={}", args.length, args);
        log.info("e.g.> curl -X GET http://localhost:28000/pdm/api/master/latest/equipment ");
        log.info("e.g.> curl -X GET http://localhost:28000/pdm/api/master/latest/param ");
        log.info("e.g.> curl -X GET http://localhost:28000/pdm/api/master/latest/spec ");
        log.info("e.g.> curl -X GET http://localhost:28000/pdm/api/master/latest/feature ");
        //new ApplicationPid().writePidFile();

        CommandLine commandLine = parseCommandLine(args);

        String server = commandLine.getOptionValue(SERVER);
        String port = commandLine.getOptionValue(PORT);
        String logPath = commandLine.getOptionValue(LOG_PATH);

        Properties logProperties = new Properties();
        logProperties.load(new FileInputStream(logPath));
        PropertyConfigurator.configure(logProperties);

        try (ServingLayer servingLayer = new ServingLayer()) {
            //JVMUtils.closeAtShutdown(servingLayer);
            int portNum = Integer.parseInt(port);
            servingLayer.start(server, portNum);
        }
    }

    private static CommandLine parseCommandLine(String[] args) {
        Option server = new Option(SERVER, true, "rest server address");
        Option port = new Option(PORT, true, "listen port");
        Option logPath = new Option(LOG_PATH, true, "config path");

        options.addOption(server).addOption(port).addOption(logPath);

        if (args.length < 3) {
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
        formatter.printHelp("rest server", options);
        System.exit(1);
    }
}
