package com.bistel.pdm.serving.resource;

import javax.inject.Singleton;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.Reader;

@Singleton
@Path("/create")
public class Create {

    @POST
    @Consumes({MediaType.TEXT_PLAIN, "text/csv", MediaType.APPLICATION_JSON})
    public void post(Reader reader) throws IOException {

    }

    @GET
    @Produces("application/json")
    public Object hello() {
        return new Object();
    }
}
