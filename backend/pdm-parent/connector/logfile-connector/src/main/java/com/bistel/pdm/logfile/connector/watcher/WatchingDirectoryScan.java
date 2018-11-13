package com.bistel.pdm.logfile.connector.watcher;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 *
 */
public class WatchingDirectoryScan {
    private final static Logger log = LoggerFactory.getLogger(WatchingDirectoryScan.class);

    private List<Path> concernDirectoryList = new ArrayList<>();

    public WatchingDirectoryScan(String path) {
        walkAndRegisterDirectories(path);
    }

    /**
     * Register the given directory, and all its sub-directories.
     */
    private void walkAndRegisterDirectories(String path) {
        File root = new File(path);
        File[] list = root.listFiles();

        if (list == null) return;

        for (File f : list) {
            if (f.isDirectory()) {
                walkAndRegisterDirectories(f.getAbsolutePath());
            } else {
                Path directoryPath = Paths.get(f.getParent());
                if (!concernDirectoryList.contains(directoryPath)) {
                    concernDirectoryList.add(directoryPath);
                    log.debug("target path : {}", directoryPath);
                }
            }
        }
    }

    public List<Path> getConcernDirectory() {
        return this.concernDirectoryList;
    }
}
