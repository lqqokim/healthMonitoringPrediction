package com.bistel.pdm.logfile.connector.listener;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.logfile.connector.producer.TraceQueueService;
import org.apache.commons.io.monitor.FileAlterationListenerAdaptor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

/**
 *
 */
public class TraceLogFileListener extends FileAlterationListenerAdaptor {
    private final static Logger log = LoggerFactory.getLogger(TraceLogFileListener.class);

    private String key;
    private Properties producerProperties;

    public TraceLogFileListener(final String key,
                                final String servingAddr,
                                final String producerConfigPath) throws Exception {

        this.key = key;
        MasterCache.ServingAddress = servingAddr;

        producerProperties = new Properties();
        try (InputStream propStream = new FileInputStream(producerConfigPath)) {
            producerProperties.load(propStream);
        }

        TraceQueueService.getInstance();
    }

    /**
     * File system observer started checking event.
     *
     * @param fileAlterationObserver
     */
    @Override
    public void onStart(FileAlterationObserver fileAlterationObserver) {
        // read the unprocessed Files
    }

    /**
     * Directory created Event.
     *
     * @param file
     */
    @Override
    public void onDirectoryCreate(File file) {
        log.debug("{} created.", file.getAbsolutePath());
    }

    /**
     * File created Event.
     *
     * @param file
     */
    @Override
    public void onFileCreate(File file) {
        log.debug("{} file created.", file.getPath());
        TraceQueueService.getInstance().putFileInQueue(key, producerProperties, file);
    }

    /**
     * File system observer finished checking event.
     *
     * @param fileAlterationObserver
     */
    @Override
    public void onStop(FileAlterationObserver fileAlterationObserver) {
        // write unprocessed File list to file
    }
}
