package com.bistel.pdm.logfile.connector;

import com.bistel.pdm.logfile.connector.listener.TraceLogFileListener;
import org.apache.commons.io.monitor.FileAlterationMonitor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class LogFileMonitor extends Thread {
    private static final Logger log = LoggerFactory.getLogger(LogFileMonitor.class);

    private static final int POLL_INTERVAL = 500;

    private final String key;
    private final String servingAddr;
    private final String producerConfigPath;
    private final String watchingDirectoryPath;

    public LogFileMonitor(final String key,
                          final String producerConfigPath,
                          final String servingAddr,
                          final String watchingDirectoryPath) throws Exception {

        this.key = key;
        this.producerConfigPath = producerConfigPath;
        this.watchingDirectoryPath = watchingDirectoryPath;
        this.servingAddr = servingAddr;
    }

    public void run() {
        try {
            log.debug("{} watching...", watchingDirectoryPath);
            FileAlterationObserver observer = new FileAlterationObserver(watchingDirectoryPath);
            FileAlterationMonitor monitor = new FileAlterationMonitor(POLL_INTERVAL);

            TraceLogFileListener traceListener = new TraceLogFileListener(this.key, this.servingAddr, this.producerConfigPath);
//            TraceLogFileListener vibrationListener = new TraceLogFileListener(this.servingAddr, this.producerConfigPath);

            observer.addListener(traceListener);
//            observer.addListener(vibrationListener);
            monitor.addObserver(observer);
            monitor.start();

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
