package com.bistel.pdm.serving.rest;

import com.bistel.pdm.common.json.FeatureDataSet;
import com.bistel.pdm.common.json.MasterDataSet;
import com.bistel.pdm.common.json.ParameterSpecDataSet;
import com.bistel.pdm.serving.Exception.Message;
import com.bistel.pdm.serving.jdbc.dao.ParamFeatureDataDao;
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
    @Path("/latest/param")
    public Response reloadAll() {

        StreamingMasterDataDao repository = new StreamingMasterDataDao();
        List<MasterDataSet> masterDataSet = null;

        try {
            masterDataSet = repository.getMasterDataSet();
            log.info("Provides the latest master info. count={}", masterDataSet.size());
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
            log.info("Provides the latest spec info. count={}", paramSpecDataSet.size());
            return Response.status(Response.Status.OK).entity(paramSpecDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    @GET
    @Path("/latest/features")
    public Response reloadFeatureAll() {

        ParamFeatureDataDao repository = new ParamFeatureDataDao();
        List<FeatureDataSet> featureDataSet = null;

        try {
            featureDataSet = repository.getAllFeatures();
            log.info("Provides the latest feature info. count={}", featureDataSet.size());
            return Response.status(Response.Status.OK).entity(featureDataSet).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }
}
