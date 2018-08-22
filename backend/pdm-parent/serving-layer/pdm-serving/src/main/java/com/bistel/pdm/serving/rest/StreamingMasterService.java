package com.bistel.pdm.serving.rest;

import com.bistel.pdm.data.stream.*;
import com.bistel.pdm.serving.Exception.Message;
import com.bistel.pdm.serving.jdbc.dao.AlarmMailConfigDataDao;
import com.bistel.pdm.serving.jdbc.dao.ParamHealthDataDao;
import com.bistel.pdm.serving.jdbc.dao.ParameterSpecDataDao;
import com.bistel.pdm.serving.jdbc.dao.StreamingMasterDataDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
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
public class StreamingMasterService {
    private static final Logger log = LoggerFactory.getLogger(StreamingMasterService.class);

    @GET
    @Path("/latest/equipment")
    public Response reloadEqpAll() {

        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<EquipmentMaster> masterDataSet = null;

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
    @Path("/latest/equipment/{eqpid}")
    public Response reloadEqp(@PathParam("eqpid") String eqpId) {

        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        EquipmentMaster masterDataSet = null;

        try {
            masterDataSet = repository.getEqpMasterDataSet(eqpId);
            log.info("Provides the latest equipment master info. {}", eqpId);
            return Response.status(Response.Status.OK).entity(masterDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/equipment/condspec/{eqpid}")
    public Response reloadConditionalSpec(@PathParam("eqpid") String eqpId) {
        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<ConditionalSpecMaster> masterDataSet = null;

        try {
            masterDataSet = repository.getConditionalSpecMasterDataSet(eqpId);
            log.info("Provides the latest conditional spec. master info. count={}", masterDataSet.size());
            return Response.status(Response.Status.OK).entity(masterDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/param/{eqpid}")
    public Response reloadParam(@PathParam("eqpid") String eqpId) {
        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<ParameterMaster> masterDataSet = null;

        try {
            masterDataSet = repository.getParamMasterDataSet(eqpId);
            log.info("Provides the latest parameter master info. count={}", masterDataSet.size());
            return Response.status(Response.Status.OK).entity(masterDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/paramspec/{eqpid}")
    public Response reloadParamWithSpec(@PathParam("eqpid") String eqpId) {
        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<ParameterWithSpecMaster> masterDataSet = null;

        try {
            masterDataSet = repository.getParamWithSpecMasterDataSet(eqpId);
            log.info("Provides the latest parameter master info. count={}", masterDataSet.size());
            return Response.status(Response.Status.OK).entity(masterDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/param/expr/{eqpid}")
    public Response reloadExprParam(@PathParam("eqpid") String eqpId) {
        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<ExpressionParamMaster> masterDataSet = null;

        try {
            masterDataSet = repository.getExprParamMasterDataSet(eqpId);
            log.info("Provides the latest expr parameter master info. count={}", masterDataSet.size());
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
        List<EventMaster> masterDataSet = null;

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
    @Path("/latest/event/{eqpid}")
    public Response reloadEvent(@PathParam("eqpid") String eqpId) {
        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<EventMaster> masterDataSet = null;

        try {
            masterDataSet = repository.getEventMasterDataSet(eqpId);
            log.info("Provides the latest event master info. count={}", masterDataSet.size());
            return Response.status(Response.Status.OK).entity(masterDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

//    @GET
//    @Path("/latest/spec")
//    public Response reloadSpecAll() {
//        ParameterSpecDataDao repository = new ParameterSpecDataDao();
//        List<ParameterWithSpecMaster> paramSpecDataSet = null;
//
//        try {
//            paramSpecDataSet = repository.getParamSpecDataSet();
//            log.info("Provides the latest parameter spec info. count={}", paramSpecDataSet.size());
//            return Response.status(Response.Status.OK).entity(paramSpecDataSet).build();
//
//        } catch (SQLException e) {
//            log.error(e.getMessage(), e);
//            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
//        }
//    }

//    @GET
//    @Path("/latest/spec/{eqpid}")
//    public Response reloadSpec(@PathParam("eqpid") String eqpId) {
//        ParameterSpecDataDao repository = new ParameterSpecDataDao();
//        List<ParameterWithSpecMaster> paramSpecDataSet = null;
//
//        try {
//            paramSpecDataSet = repository.getParamSpecDataSet(eqpId);
//            log.info("Provides the latest parameter spec info. count={}", paramSpecDataSet.size());
//            return Response.status(Response.Status.OK).entity(paramSpecDataSet).build();
//
//        } catch (SQLException e) {
//            log.error(e.getMessage(), e);
//            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
//        }
//    }

    @GET
    @Path("/latest/health")
    public Response reloadParamHealthAll() {

        ParamHealthDataDao repository = new ParamHealthDataDao();
        List<ParameterHealthMaster> healthDataSet = null;

        try {
            healthDataSet = repository.getParamHealthDataSet();
            log.info("Provides the latest feature info. count={}", healthDataSet.size());
            return Response.status(Response.Status.OK).entity(healthDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/health/{eqpid}")
    public Response reloadParamHealth(@PathParam("eqpid") String eqpId) {

        ParamHealthDataDao repository = new ParamHealthDataDao();
        List<ParameterHealthMaster> healthDataSet = null;

        try {
            healthDataSet = repository.getParamHealthDataSet(eqpId);
            log.info("Provides the latest feature info. count={}", healthDataSet.size());
            return Response.status(Response.Status.OK).entity(healthDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/smtp")
    public Response reloadMailConfig() {

        AlarmMailConfigDataDao repository = new AlarmMailConfigDataDao();
        MailConfigMaster ds = null;

        try {
            ds = repository.getMailConfigDataSet();
            log.info("Provides the latest feature info.");
            return Response.status(Response.Status.OK).entity(ds).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }
}
