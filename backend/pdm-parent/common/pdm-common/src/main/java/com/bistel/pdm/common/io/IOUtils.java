package com.bistel.pdm.common.io;

import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.io.IOException;
import java.net.ServerSocket;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * IO-related utility methods.
 *
 */
public final class IOUtils {
    private static final Logger log = LoggerFactory.getLogger(IOUtils.class);

    private IOUtils() {}

    public static void deleteRecursively(Path rootDir) throws IOException {
        if (rootDir == null || !Files.exists(rootDir)) {
            return;
        }
        Files.walkFileTree(rootDir, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                Files.delete(file);
                return FileVisitResult.CONTINUE;
            }
            @Override
            public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                Files.delete(dir);
                return FileVisitResult.CONTINUE;
            }
        });
    }

    public static List<Path> listFiles(Path dir, String glob) throws IOException {
        Preconditions.checkArgument(Files.isDirectory(dir), "%s is not a directory", dir);

        List<String> globLevels;
        if (glob == null || glob.isEmpty()) {
            globLevels = Collections.singletonList("*");
        } else {
            globLevels = Arrays.asList(glob.split("/"));
        }
        Preconditions.checkState(!globLevels.isEmpty());

        List<Path> paths = new ArrayList<>();
        paths.add(dir);

        for (String globLevel : globLevels) {
            List<Path> newPaths = new ArrayList<>();
            for (Path existingPath : paths) {
                if (Files.isDirectory(existingPath)) {
                    try (DirectoryStream<Path> stream = Files.newDirectoryStream(existingPath, globLevel)) {
                        for (Path path : stream) {
                            if (!path.getFileName().toString().startsWith(".")) {
                                newPaths.add(path);
                            }
                        }
                    }
                }
            }
            paths = newPaths;
        }
        Collections.sort(paths);
        return paths;
    }

    public static void closeQuietly(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                log.warn("Unable to close", e);
            }
        }
    }

    public static int chooseFreePort() throws IOException {
        try (ServerSocket socket = new ServerSocket(0, 0)) {
            return socket.getLocalPort();
        }
    }
}
