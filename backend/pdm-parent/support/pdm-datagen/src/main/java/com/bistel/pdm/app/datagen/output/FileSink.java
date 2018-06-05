package com.bistel.pdm.app.datagen.output;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class FileSink implements Sink {

    private Map<String, BufferedOutputStream> outputStreams = new HashMap<>();

    public FileSink() {
    }

    @Override
    public synchronized void process(String filePath, String record) {
        try {
            getStream(filePath).write(record.getBytes());
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to save: " + record, e);
        }
    }

    @Override
    public void close() {
        try {
            for (BufferedOutputStream bufferedOutputStream : outputStreams.values()) {
                bufferedOutputStream.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void close(String filePath) {
        BufferedOutputStream stream = outputStreams.get(filePath);
        try {
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private BufferedOutputStream getStream(String filePath) throws FileNotFoundException {
        BufferedOutputStream stream = outputStreams.get(filePath);

        if (stream == null) {
            File outFile = new File(filePath);
            if (!outFile.getParentFile().exists()) {
                outFile.getParentFile().mkdirs();
            }

//            double bytes = outFile.length();
//            double kilobytes = (bytes / 1024);
//            double megabytes = (kilobytes / 1024);
//            if (megabytes > 10) {
//                outFile = new File(filePath);
//            }

            stream = new BufferedOutputStream(new FileOutputStream(outFile, true));
            outputStreams.put(filePath, stream);
        }
        return stream;
    }
}
