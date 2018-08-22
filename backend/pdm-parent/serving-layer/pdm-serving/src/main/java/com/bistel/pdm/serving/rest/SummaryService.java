package com.bistel.pdm.serving.rest;

import com.bistel.pdm.data.stream.SummarizedFeatureData;
import com.bistel.pdm.serving.Exception.Message;
import com.bistel.pdm.serving.jdbc.dao.FeatureSummaryDataDao;
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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * The value of the 90 day summary of the original data is provided.
 */
@Singleton
@Path("/feature")
@Produces(MediaType.APPLICATION_JSON)
public class SummaryService {
    private static final Logger log = LoggerFactory.getLogger(SummaryService.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    @GET
    @Path("{from}/{to}")
    public Response getSummarizedFeature(@PathParam("from") Long from, @PathParam("to") Long to) {
        FeatureSummaryDataDao repository = new FeatureSummaryDataDao();

        try {
            String fromTime = convertTime(from);
            String endTime = convertTime(to);

            List<SummarizedFeatureData> paramFeatureValueList = repository.getParamAverage(fromTime, endTime);

            log.info("Provides the summarized features. count={}", paramFeatureValueList.size());
            return Response.status(Response.Status.OK).entity(paramFeatureValueList).build();

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }

    private String convertTime(long time) {
        Date date = new Date(time);
        return dateFormat.format(date);
    }
}
