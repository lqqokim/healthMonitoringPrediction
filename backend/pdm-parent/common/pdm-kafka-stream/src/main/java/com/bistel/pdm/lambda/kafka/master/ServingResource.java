package com.bistel.pdm.lambda.kafka.master;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.common.json.MasterDataSet;
import com.bistel.pdm.common.json.ParameterSpecDataSet;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;

/**
 *
 */
public class ServingResource {
    private static final Logger log = LoggerFactory.getLogger(ServingResource.class);

    public static void updateMasterDataSet(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        Response response = client.target(targetUrl).request().get();
        String body = response.readEntity(String.class);

        ObjectMapper mapper = new ObjectMapper();
        List<MasterDataSet> masterDataList = null;

        try {
            if (body.length() <= 0) {
                log.info("master data does not exists. message: " + body);
            } else {
                masterDataList = mapper.readValue(body, new TypeReference<List<MasterDataSet>>() {
                });

                for (MasterDataSet data : masterDataList) {
                    MasterDataCache.getInstance().putMaster(data.toKey(), data.getParameterRawId());
                }
                log.info("{} reference has been updated.", masterDataList.size());
            }
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } finally {
            response.close();
            client.close();
        }
    }

    public static void updateParamSpecDataSet(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        Response response = client.target(targetUrl).request().get();
        String body = response.readEntity(String.class);

        ObjectMapper mapper = new ObjectMapper();
        List<ParameterSpecDataSet> paramSpecDataList = null;

        try {
            if (body.length() <= 0) {
                log.info("master data does not exists. message: " + body);
            } else {
                paramSpecDataList = mapper.readValue(body, new TypeReference<List<ParameterSpecDataSet>>() {
                });

                for (ParameterSpecDataSet data : paramSpecDataList) {
                    MasterDataCache.getInstance().putAlarmWarningSpec(data.toKey(), new Pair<>(data.getAlarmSpec(), data.getWarningSpec()));
                }
                log.info("{} reference has been updated.", paramSpecDataList.size());
            }
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } finally {
            response.close();
            client.close();
        }
    }
}
