package com.bistel.pdm.common.lang;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;

/**
 *  JVM-related utility methods.
 *
 */
public final class JVMUtils {
    private static final Logger log = LoggerFactory.getLogger(JVMUtils.class);

    private static final InstanceShutdownHook SHUTDOWN_HOOK = new InstanceShutdownHook();

    private JVMUtils() {}

    /**
     * Adds a shutdown hook that tries to call {@link Closeable#close()} on the given argument
     * at JVM shutdown.
     *
     * @param closeable thing to close
     */
    public static void closeAtShutdown(Closeable closeable) {
        if (SHUTDOWN_HOOK.addCloseable(closeable)) {
            try {
                Runtime.getRuntime().addShutdownHook(new Thread(SHUTDOWN_HOOK, "InstanceShutdownHookThread"));
            } catch (IllegalStateException ise) {
                log.warn("Can't close {} at shutdown since shutdown is in progress", closeable);
            }
        }
    }

    /**
     * @return approximate heap used, in bytes
     */
    public static long getUsedMemory() {
        Runtime runtime = Runtime.getRuntime();
        return runtime.totalMemory() - runtime.freeMemory();
    }
}
