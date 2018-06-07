package com.bistel.pdm.batch.functions;

import org.apache.kafka.streams.kstream.KStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class Outlier {
    private static final Logger log = LoggerFactory.getLogger(Outlier.class);

    public static KStream<String, byte[]> build(final KStream<String, byte[]> streamRecord) {
        return null;
    }
}
