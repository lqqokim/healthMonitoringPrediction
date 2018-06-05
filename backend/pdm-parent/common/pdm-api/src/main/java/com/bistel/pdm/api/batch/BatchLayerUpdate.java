package com.bistel.pdm.api.batch;

import java.io.IOException;
import java.io.Serializable;

@FunctionalInterface
public interface BatchLayerUpdate<K,M,U> extends Serializable {

    void runUpdate() throws IOException, InterruptedException;

}
