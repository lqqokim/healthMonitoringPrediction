package com.bistel.pdm.batch.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.math3.util.Pair;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

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
    public static ConcurrentHashMap<String, Pair<Double, Double>> getParamFeatureAvgFor(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();

        // http://localhost:28000/feature/from/to
        Response response = client.target(targetUrl).request().get();
        String body = response.readEntity(String.class);

        ConcurrentHashMap<String, Pair<Double, Double>> paramFeatureValueList = new ConcurrentHashMap<>();

        ObjectMapper mapper = new ObjectMapper();

        try {
            if (body.length() <= 0) {
                log.info("feature's value does not exists. message: " + body);
            } else {
                paramFeatureValueList = mapper.readValue(body, new TypeReference<ConcurrentHashMap<String, Double>>() {
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
