package com.bistel.pdm.batch.util;

import com.bistel.pdm.data.stream.SummarizedFeatureData;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 */
public class ServingRequestor {
    private static final Logger log = LoggerFactory.getLogger(ServingRequestor.class);

    /**
     * get average of the features for some period.
     *
     * @param targetUrl
     */
    public static List<SummarizedFeatureData> getParamFeatureAvgFor(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        List<SummarizedFeatureData> paramFeatureValueList = new ArrayList<>();

        //http://192.168.7.230:28000/pdm/api/feature/1523422622885/1531198622885
        Response response = client.target(targetUrl).request().get();
        log.debug("called to " + targetUrl);

        String body = response.readEntity(String.class);
        ObjectMapper mapper = new ObjectMapper();

        try {
            if (body.length() <= 0) {
                log.info("feature's value does not exists. message: " + body);
            } else {
                paramFeatureValueList = mapper.readValue(body, new TypeReference<List<SummarizedFeatureData>>() {
                });
                log.info("{} features has been updated.", paramFeatureValueList.size());
            }
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } finally {
            response.close();
            client.close();
        }

        return paramFeatureValueList;
    }


}
