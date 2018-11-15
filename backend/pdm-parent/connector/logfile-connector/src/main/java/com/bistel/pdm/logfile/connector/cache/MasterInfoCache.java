package com.bistel.pdm.logfile.connector.cache;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.data.stream.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class MasterInfoCache {
    private static final Logger log = LoggerFactory.getLogger(MasterInfoCache.class);

    public static String ServingAddress = "localhost";

    // sample cache
    public static LoadingCache<String, Object> Equipment = CacheBuilder.newBuilder()
            .maximumSize(50000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, Object>() {
                @Override
                public Object load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/equipment/" + key + "";

                    Object masterDataList = null;

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("equipment master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<Object>() {
                            });

                            log.info("{} - equipments are reloaded.", key);
                        }
                    } catch (IOException e) {
                        log.error(e.getMessage(), e);
                    } finally {
                        response.close();
                        client.close();
                    }

                    return masterDataList;
                }
            });


}
