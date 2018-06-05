package com.bistel.pdm.connector.io;

import org.apache.commons.io.input.Tailer;
import org.apache.commons.io.input.TailerListenerAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TailerThreadManager extends TailerListenerAdapter {
    private final static Logger log = LoggerFactory.getLogger(TailerThreadManager.class);

    private Tailer currentTailer;
    private String currentFilePath;
    private TailerFactory tailorFactory;
    private boolean shutdownHookAdded = false;

    public TailerThreadManager(TailerFactory tailorFactory) {
        this.tailorFactory = tailorFactory;
    }

    public void startTailingFile(String newfilePath) {
        if (newfilePath != null && !newfilePath.equals(currentFilePath)) {
            if (currentTailer != null) {
                log.info("No longer tailing file: " + currentFilePath);
                currentTailer.stop();
            }

            currentTailer = tailorFactory.getNewInstance(newfilePath);

            Thread thread = new Thread(currentTailer);
            addShutdownHookOnce();
            thread.setDaemon(true);
            thread.start();

            currentFilePath = newfilePath;
            log.info("Now tailing new file: " + currentFilePath);
        }
    }

    private void addShutdownHookOnce() {
        if (!shutdownHookAdded) {
            final TailerThreadManager thisReference = this;
            Runtime.getRuntime().addShutdownHook(new Thread() {
                public void run() {
                    thisReference.shutdown();
                }
            });
            shutdownHookAdded = true;
        }
    }

    public void shutdown() {
        log.info("Shutting down...");
        if (currentTailer != null) {
            currentTailer.stop();
            log.info("No longer tailing file: " + currentFilePath);
        } else {
            log.info("No tailer currently exists.");
        }

        log.info("shutdown complete.");
    }
}
