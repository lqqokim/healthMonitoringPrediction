package com.bistel.pdm.serving.resource;

import com.bistel.pdm.common.json.MasterDataSet;
import com.bistel.pdm.common.json.ParameterSpecDataSet;
import com.bistel.pdm.serving.Exception.Message;
import com.bistel.pdm.serving.jdbc.dao.MasterDataSetDao;
import com.bistel.pdm.serving.jdbc.dao.ParameterSpecDataSetDao;
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
public class MasterDataResource {
    private static final Logger log = LoggerFactory.getLogger(MasterDataResource.class);

    @GET
    @Path("/latest")
    public Response reloadAll() {

        MasterDataSetDao repository = new MasterDataSetDao();
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

        ParameterSpecDataSetDao repository = new ParameterSpecDataSetDao();
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
}
