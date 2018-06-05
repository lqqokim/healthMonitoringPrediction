package com.bistel.pdm.serving;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.Part;
import javax.ws.rs.core.Context;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipInputStream;

/**
 *
 *
 */
public abstract class AbstractServingResource {

    private static final Logger log = LoggerFactory.getLogger(AbstractServingResource.class);

    @Context
    private ServletContext servletContext;

    @PostConstruct
    protected void init() {

    }

    protected static InputStream maybeDecompress(Part item) throws IOException {
        InputStream in = item.getInputStream();
        String contentType = item.getContentType();
        if (contentType != null) {
            switch (contentType) {
                case "application/zip":
                    in = new ZipInputStream(in);
                    break;
                case "application/gzip":
                case "application/x-gzip":
                    in = new GZIPInputStream(in);
                    break;
            }
        }
        return in;
    }
}
