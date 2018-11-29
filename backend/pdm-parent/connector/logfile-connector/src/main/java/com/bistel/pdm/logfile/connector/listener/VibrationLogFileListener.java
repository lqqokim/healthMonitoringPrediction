package com.bistel.pdm.logfile.connector.listener;

import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.io.monitor.FileAlterationListenerAdaptor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

/**
 *
 */
public class VibrationLogFileListener extends FileAlterationListenerAdaptor {
    private final static Logger log = LoggerFactory.getLogger(VibrationLogFileListener.class);

    private Producer<String, byte[]> producer;

    public VibrationLogFileListener(final String servingAddr,
                                    final String producerConfigPath) throws Exception {

        MasterCache.ServingAddress = servingAddr;

        Properties producerProperties = new Properties();
        try (InputStream propStream = new FileInputStream(producerConfigPath)) {
            producerProperties.load(propStream);
        }

        producer = new KafkaProducer<>(producerProperties);
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
