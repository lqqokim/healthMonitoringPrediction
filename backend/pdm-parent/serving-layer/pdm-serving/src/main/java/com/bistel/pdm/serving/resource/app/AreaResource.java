package com.bistel.pdm.serving.resource.app;

import com.bistel.pdm.serving.Exception.Message;
import com.bistel.pdm.serving.json.Area;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

/**
 * This REST resource has common path "/fabs/{fabId}/areas" and represents area collection resource
 * as well as individual collection resources.
 */
@Singleton
@Path("/fabs/{fabId}/areas")
@Produces(MediaType.APPLICATION_JSON)
public class AreaResource {
    private static final Logger log = LoggerFactory.getLogger(AreaResource.class);

    @GET
    @Path("{areaId}")
    public Response getAreaById(@PathParam("fabId") String fabId, @PathParam("areaId") Long areaId) {
        List<Area> areaList = new ArrayList<Area>();
        Area area = new Area();
        area.setArea_id(1L);
        area.setName("TEST1");
        areaList.add(area);

        log.info("OK!");

        return Response.status(Response.Status.OK).entity(areaList).build();
    }

    @GET
    public Response getArea(@PathParam("fabId") Integer fabId, @DefaultValue("0") @QueryParam("parentId") Long parentId) {

        if (fabId == null && parentId == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Area> areaList = new ArrayList<Area>();
        Area area = new Area();
        area.setArea_id(1L);
        area.setName("TEST2");
        areaList.add(area);

        return Response.status(Response.Status.OK).entity(areaList).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateArea(@PathParam("fabId") String fabId, Area area) {

        return Response.status(Response.Status.OK).entity(new Message("Area Updated Successfully")).build();
    }

    @DELETE
    @Path("{areaId}")
    public Response deleteArea(@PathParam("fabId") String fabId, @PathParam("areaId") Long areaId) {

        return Response.status(Response.Status.OK).build();
    }

}
