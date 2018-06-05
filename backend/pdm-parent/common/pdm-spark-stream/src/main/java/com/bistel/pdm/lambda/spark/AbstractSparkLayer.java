package com.bistel.pdm.lambda.spark;

import com.typesafe.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.util.Objects;

/**
 *
 *
 * @param <K> input topic key type
 * @param <M> input topic message type
 */
public abstract class AbstractSparkLayer<K,M> implements Closeable {

    private static final Logger log = LoggerFactory.getLogger(AbstractSparkLayer.class);

    protected AbstractSparkLayer(Config config) {
        Objects.requireNonNull(config);
    }



}
