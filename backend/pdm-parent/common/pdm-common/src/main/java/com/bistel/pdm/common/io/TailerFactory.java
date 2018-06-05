package com.bistel.pdm.common.io;

import org.apache.commons.io.input.Tailer;
import org.apache.commons.io.input.TailerListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

/**
 *
 *
 */
public class TailerFactory {
    private final static Logger log = LoggerFactory.getLogger(TailerFactory.class);

    private boolean startTailingFromEnd = true;
    private boolean relinquishLockBetweenChunks = false;
    private int delayInMillisecondsBetweenChecks = 1000;
    private TailerListener listener;

    public void setStartTailingFromEnd(boolean startTailingFromEnd) {
        this.startTailingFromEnd = startTailingFromEnd;
    }

    public void setRelinquishLockBetweenChunks(boolean relinquishLockBetweenChunks) {
        this.relinquishLockBetweenChunks = relinquishLockBetweenChunks;
    }

    public void setDelayInMillisecondsBetweenChecks(int delayInMillisecondsBetweenChecks) {
        this.delayInMillisecondsBetweenChecks = delayInMillisecondsBetweenChecks;
    }

    public void setListener(TailerListener listener) {
        this.listener = listener;
    }

    public Tailer getNewInstance(String filePath) {
        File file = new File(filePath);

        log.debug("delayInMillisecondsBetweenChecks : {}", delayInMillisecondsBetweenChecks);
        log.debug("startTailingFromEnd              : {}", startTailingFromEnd);
        log.debug("relinquishLockBetweenChunks      : {}", relinquishLockBetweenChunks);

        return new Tailer(file, listener, delayInMillisecondsBetweenChecks, startTailingFromEnd, relinquishLockBetweenChunks);
    }
}
