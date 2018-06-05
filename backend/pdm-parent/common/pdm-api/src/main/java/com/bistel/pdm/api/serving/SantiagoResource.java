package com.bistel.pdm.api.serving;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;

/**
 * A utility class that can serve as a superclass of Serving Layer application endpoints.
 *
 */
public abstract class SantiagoResource {

    @Context
    private ServletContext servletContext;

    @PostConstruct
    protected void init() {

    }


}
