package com.bistel.pdm.serving;

import com.bistel.pdm.rest.core.EmbeddedServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.Closeable;

/**
 * Top-level implementation of the Serving Layer process.
 */
public class ServingLayer implements Closeable {
    private static final Logger log = LoggerFactory.getLogger(ServingLayer.class);

    public ServingLayer() {}

    public synchronized void start(final String ip, final int port) throws ServletException {

        log.info("Starting PdM Serving Layer...");

        //http://localhost:8080/pdm/api/...
        final EmbeddedServer server = new EmbeddedServer(ip, port);
        server.contextPath("/pdm")
                .deploymentName("serving layer")
                .appPath("/api")
                .resourcesClass(ServingLayerApplication.class)
                .start();

        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                server.shutdown();
            }
        });

        log.info("PdM JAX-RS based micro-service running...");
    }

    @Override
    public void close() {
    }
}
