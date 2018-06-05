package com.bistel.pdm.scheduler;

import com.bistel.pdm.rest.core.EmbeddedServer;
import com.bistel.pdm.scheduler.wrapper.QuartzScheduler;
import com.typesafe.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;

/**
 * Top-level implementation of the scheduler process.
 */
public class SchedulerServer implements Closeable {
    private static final Logger log = LoggerFactory.getLogger(SchedulerServer.class);

    private final Config config;

    private QuartzScheduler scheduler;

    public SchedulerServer(Config config) {
        this.config = config;
    }

    public synchronized void start() throws Exception {

        log.info("Starting scheduler server...");

        EmbeddedServer server = new EmbeddedServer("localhost", 8081);
        server.contextPath("/schd")
                .deploymentName("scheduler")
                .resourcesClass(SchedulerApplication.class)
                .start();

        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                server.shutdown();
            }
        });

        final QuartzScheduler scheduler = new QuartzScheduler(config.getString("pdm.scheduler.path"));
        scheduler.start();

        Runtime.getRuntime().addShutdownHook(new Thread() {
                @Override
                public void run() {
                    scheduler.shutdown();
                }
            });

        log.info("scheduler server running...");
    }

    public void await() {
        //Blocks and waits until the server shuts down.
    }

    @Override
    public void close() {
        //clear the resources
    }
}
