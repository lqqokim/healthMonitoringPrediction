package com.bistel.pdm.common.io;

import com.google.common.io.ByteSource;
import com.google.common.io.Resources;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;

/**
 *
 *
 */
public final class PropertyLoader {

    public static Properties load(String propertyName) {
        final URL url = Resources.getResource(propertyName);
        final ByteSource byteSource = Resources.asByteSource(url);
        final Properties properties = new Properties();

        InputStream inputStream = null;
        try {
            inputStream = byteSource.openBufferedStream();
            properties.load(inputStream);
        } catch (final IOException ioException) {
            ioException.printStackTrace();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (final IOException ioException) {
                    ioException.printStackTrace();
                }
            }
        }
        return properties;
    }
}
