package com.bistel.pdm.logfile.connector.watcher.listener;

import org.apache.commons.io.input.TailerListenerAdapter;
import org.apache.kafka.clients.producer.Producer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class DefaultLogTailerListener extends TailerListenerAdapter {
    private final static Logger log = LoggerFactory.getLogger(DefaultLogTailerListener.class);

    private Producer<String, byte[]> rawProducer;
    private Producer<String, byte[]> rmsProducer;
    private String topicPrefix;

    public void setRmsProducer(Producer rmsProducer) {
        this.rmsProducer = rmsProducer;
    }

    public void setRawProducer(Producer rawProducer) {
        this.rawProducer = rawProducer;
    }

    public void setTopic(String topic) {
        this.topicPrefix = topic;
    }

    public void handle(final String line) {
        if (line.length() <= 0) return;

        String[] columns = line.split(",");








    }
}
