package com.bistel.pdm.common.lang;

import com.bistel.pdm.common.io.IOUtils;
import com.google.common.base.Preconditions;

import java.io.Closeable;
import java.util.Deque;
import java.util.LinkedList;
import java.util.Objects;

/**
 *
 *
 */
public final class InstanceShutdownHook implements Runnable {
    private final Deque<Closeable> closeAtShutdown = new LinkedList<>();
    private volatile boolean triggered;

    @Override
    public void run() {
        triggered = true;
        synchronized (closeAtShutdown) {
            closeAtShutdown.forEach(IOUtils::closeQuietly);
        }
    }

    public boolean addCloseable(Closeable closeable) {
        Objects.requireNonNull(closeable);
        Preconditions.checkState(!triggered, "Can't add closeable %s; already shutting down", closeable);
        synchronized (closeAtShutdown) {
            boolean wasFirst = closeAtShutdown.isEmpty();
            closeAtShutdown.push(closeable);
            return wasFirst;
        }
    }
}
