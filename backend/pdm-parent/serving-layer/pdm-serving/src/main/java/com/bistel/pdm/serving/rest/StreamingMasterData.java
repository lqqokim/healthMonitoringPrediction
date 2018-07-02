package com.bistel.pdm.serving.rest;

import com.bistel.pdm.common.json.*;
import com.bistel.pdm.serving.Exception.Message;
import com.bistel.pdm.serving.jdbc.dao.ParamFeatureDataDao;
import com.bistel.pdm.serving.jdbc.dao.ParamHealthDataDao;
import com.bistel.pdm.serving.jdbc.dao.ParameterSpecDataDao;
import com.bistel.pdm.serving.jdbc.dao.StreamingMasterDataDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

/**
 *
 */
@Singleton
@Path("/master")
@Produces(MediaType.APPLICATION_JSON)
public class StreamingMasterData {
    private static final Logger log = LoggerFactory.getLogger(StreamingMasterData.class);

    @GET
    @Path("/latest/equipment")
    public Response reloadEqpAll() {

        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<EquipmentMasterDataSet> masterDataSet = null;

        try {
            masterDataSet = repository.getEqpMasterDataSet();
            log.info("Provides the latest equipment master info. count={}", masterDataSet.size());
            return Response.status(Response.Status.OK).entity(masterDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/param")
    public Response reloadParamAll() {

        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<ParameterMasterDataSet> masterDataSet = null;

        try {
            masterDataSet = repository.getParamMasterDataSet();
            log.info("Provides the latest parameter master info. count={}", masterDataSet.size());
            return Response.status(Response.Status.OK).entity(masterDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/event")
    public Response reloadEventAll() {

        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<EventMasterDataSet> masterDataSet = null;

        try {
            masterDataSet = repository.getEventMasterDataSet();
            log.info("Provides the latest event master info. count={}", masterDataSet.size());
            return Response.status(Response.Status.OK).entity(masterDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/spec")
    public Response reloadSpecAll() {

        ParameterSpecDataDao repository = new ParameterSpecDataDao();
        List<ParameterSpecDataSet> paramSpecDataSet = null;

        try {
            paramSpecDataSet = repository.getParamSpecDataSet();
            log.info("Provides the latest parameter spec info. count={}", paramSpecDataSet.size());
            return Response.status(Response.Status.OK).entity(paramSpecDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/health")
    public Response reloadParamHealthAll() {

        ParamHealthDataDao repository = new ParamHealthDataDao();
        List<ParameterHealthDataSet> healthDataSet = null;

        try {
            healthDataSet = repository.getParamHealthDataSet();
            log.info("Provides the latest feature info. count={}", healthDataSet.size());
            return Response.status(Response.Status.OK).entity(healthDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }
}
