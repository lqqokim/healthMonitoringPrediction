package com.bistel.pdm.scheduler.bundle;

import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class SchedulerAppBootstrap {
    private final static Logger log = LoggerFactory.getLogger(SchedulerAppBootstrap.class);

    private static final Options options = new Options();

    public static void main(String[] args) throws Exception {

    }

    private static void printUsageAndExit() {
        HelpFormatter formatter = new HelpFormatter();
        formatter.printHelp("scheduler", options);
        System.exit(1);
    }
}
