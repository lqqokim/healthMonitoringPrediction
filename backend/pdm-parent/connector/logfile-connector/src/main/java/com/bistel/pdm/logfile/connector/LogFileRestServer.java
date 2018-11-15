package com.bistel.pdm.logfile.connector;

import com.bistel.pdm.rest.core.EmbeddedServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.Closeable;

/**
 * Top-level implementation of the Connector process.
 */
public class LogFileRestServer implements Closeable {
    private static final Logger log = LoggerFactory.getLogger(LogFileRestServer.class);

    public void start(final String ip, final int port) throws ServletException {
        log.info("Starting log file connector...");

        //http://localhost:8080/pdm/api/...
        final EmbeddedServer server = new EmbeddedServer(ip, port);
        server.contextPath("/connector")
                .deploymentName("connector")
                .appPath("/api")
                .resourcesClass(ConnectorRestApplication.class)
                .start();

        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                server.shutdown();
            }
        });

        log.info("Connector(JAX-RS) based micro-service running...");
    }

    @Override
    public void close() {
    }
}
