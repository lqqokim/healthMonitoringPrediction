package com.bistel.pdm.lambda.kafka;

/**
 *
 *
 */
public class MicroserviceUtils {

    public static void addShutdownHookAndBlock(Service service) throws InterruptedException {
        Thread.currentThread().setUncaughtExceptionHandler((t, e) -> service.stop());
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                service.stop();
            } catch (Exception ignored) {
            }
        }));
        Thread.currentThread().join();
    }
}
