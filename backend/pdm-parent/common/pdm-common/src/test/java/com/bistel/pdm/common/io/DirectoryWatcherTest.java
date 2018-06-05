package com.bistel.pdm.common.io;

import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.*;

public class DirectoryWatcherTest {

    @Test
    public void startWatching() throws IOException {
        String directoryPath = "/Users/hansonjang/Documents/opensource/pdm-parent/app/pdm-datagen/data/";
        DirectoryWatcher directoryWatcher = new DirectoryWatcher(directoryPath, null);
        directoryWatcher.startWatching();
    }
}