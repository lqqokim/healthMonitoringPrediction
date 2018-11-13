package com.bistel.pdm.logfile.connector.watcher;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.*;

/**
 *
 *
 */
public class DirectoryWatcher {
    private final static Logger log = LoggerFactory.getLogger(DirectoryWatcher.class);

    private String directoryPathString;
    private WatchService watchService;
    private TailerThreadManager tailerThreadManager;

    public DirectoryWatcher(String directoryPathString, TailerThreadManager tailerThreadManager) throws IOException {
        this.directoryPathString = directoryPathString;
        this.tailerThreadManager = tailerThreadManager;
    }

    public void startWatching() {
        Path directoryPath = Paths.get(directoryPathString);
        WatchKey watchKey = null;
        try {
            watchService = FileSystems.getDefault().newWatchService();
            watchKey = directoryPath.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);
            log.debug("registers the given directory : {}", directoryPathString);
        } catch (IOException x) {
            log.error("IOException setting up startWatching.", x);
        }

        while (true) {
            try {
                watchService.take();
            } catch (Exception x) {
                log.error(x.getMessage(), x);
                break;
            }

            for (WatchEvent<?> event : watchKey.pollEvents()) {
                log.debug("Event: {} : {}", event.kind(), event.context());
                WatchEvent.Kind<?> kind = event.kind();

                if (kind == StandardWatchEventKinds.OVERFLOW) {
                    continue;
                }

                if (kind != StandardWatchEventKinds.ENTRY_CREATE) {
                    continue;
                }

                WatchEvent<Path> watchEvent = (WatchEvent<Path>) event;
                Path filename = watchEvent.context();
                try {
                    Path filePath = directoryPath.resolve(filename);
                    tailerThreadManager.startTailingFile(filePath.toString());
                } catch (Exception x) {
                    log.error("Exception handling new file:" + filename, x);
                    continue;
                }
            }

            boolean valid = watchKey.reset();
            if (!valid) {
                log.debug("WatchKey is not valid: valid={}", valid);
                break;
            }
        }
    }
}
