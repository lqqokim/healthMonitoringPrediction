package com.bistel.pdm.common;

import com.bistel.pdm.common.util.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.nio.file.Files;
import java.nio.file.attribute.PosixFilePermission;
import java.util.Set;

/**
 * An application process ID.
 */
public class ApplicationPid {
    private final static Logger log = LoggerFactory.getLogger(ApplicationPid.class);

    private static final PosixFilePermission[] WRITE_PERMISSIONS = {
            PosixFilePermission.OWNER_WRITE, PosixFilePermission.GROUP_WRITE,
            PosixFilePermission.OTHERS_WRITE};

    private final String DEFAULT_FILE_NAME = "application.pid";

    private final String pid;

    public ApplicationPid() {
        this.pid = getPid();
    }

    protected ApplicationPid(String pid) {
        this.pid = pid;
    }

    private String getPid() {
        try {
            String jvmName = ManagementFactory.getRuntimeMXBean().getName();
            return jvmName.split("@")[0];
        } catch (Throwable ex) {
            return null;
        }
    }

    @Override
    public String toString() {
        return (this.pid == null ? "???" : this.pid);
    }

    @Override
    public int hashCode() {
        return ObjectUtils.nullSafeHashCode(this.pid);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj != null && obj instanceof ApplicationPid) {
            return ObjectUtils.nullSafeEquals(this.pid, ((ApplicationPid) obj).pid);
        }
        return false;
    }

    public void writePidFile() throws IOException {
        File pidFile = new File(DEFAULT_FILE_NAME);
        write(pidFile);
        pidFile.deleteOnExit();
    }

    /**
     * Write the PID to the specified file.
     */
    private void write(File file) throws IOException {
        if (this.pid != null) {
            createParentFolder(file);
            if (file.exists()) {
                assertCanOverwrite(file);
            }
            try (FileWriter writer = new FileWriter(file)) {
                writer.append(this.pid);
            }
        } else {
            log.info("No PID available");
        }
    }

    private void createParentFolder(File file) {
        File parent = file.getParentFile();
        if (parent != null) {
            parent.mkdirs();
        }
    }

    private void assertCanOverwrite(File file) throws IOException {
        if (!file.canWrite() || !canWritePosixFile(file)) {
            throw new FileNotFoundException(file.toString() + " (permission denied)");
        }
    }

    private boolean canWritePosixFile(File file) throws IOException {
        try {
            Set<PosixFilePermission> permissions = Files
                    .getPosixFilePermissions(file.toPath());
            for (PosixFilePermission permission : WRITE_PERMISSIONS) {
                if (permissions.contains(permission)) {
                    return true;
                }
            }
            return false;
        } catch (UnsupportedOperationException ex) {
            // Assume that we can
            return true;
        }
    }
}
