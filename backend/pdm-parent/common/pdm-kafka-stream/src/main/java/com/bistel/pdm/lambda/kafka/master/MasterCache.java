package com.bistel.pdm.lambda.kafka.master;

import com.bistel.pdm.common.json.*;
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
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class MasterCache {
    private static final Logger log = LoggerFactory.getLogger(MasterCache.class);

    public static String ServingAddress = "localhost";

    public static LoadingCache<String, EquipmentMasterDataSet> Equipment = CacheBuilder.newBuilder()
            .maximumSize(50000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, EquipmentMasterDataSet>() {
                @Override
                public EquipmentMasterDataSet load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/equipment/" + key + "";

                    EquipmentMasterDataSet masterDataList = null;

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("equipment master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<EquipmentMasterDataSet>() {
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


    public static LoadingCache<String, List<ParameterMasterDataSet>> Parameter = CacheBuilder.newBuilder()
            .maximumSize(100000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, List<ParameterMasterDataSet>>() {
                @Override
                public List<ParameterMasterDataSet> load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/param/" + key + "";

                    List<ParameterMasterDataSet> masterDataList = new ArrayList<>();

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("parameter master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<List<ParameterMasterDataSet>>() {
                            });

                            log.info("{} - parameter are reloaded.", key);
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

    public static LoadingCache<String, List<EventMasterDataSet>> Event = CacheBuilder.newBuilder()
            .maximumSize(100000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, List<EventMasterDataSet>>() {
                @Override
                public List<EventMasterDataSet> load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/event/" + key + "";

                    List<EventMasterDataSet> masterDataList = new ArrayList<>();

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("event master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<List<EventMasterDataSet>>() {
                            });

                            log.info("{} - events are reloaded.", key);
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

    public static LoadingCache<String, List<ParameterHealthDataSet>> Health = CacheBuilder.newBuilder()
            .maximumSize(10000000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, List<ParameterHealthDataSet>>() {
                @Override
                public List<ParameterHealthDataSet> load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/health/" + key + "";

                    List<ParameterHealthDataSet> masterDataList = new ArrayList<>();

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("health master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<List<ParameterHealthDataSet>>() {
                            });

                            log.info("{} - health are reloaded.", key);
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

    public static LoadingCache<String, MailConfigDataSet> Mail = CacheBuilder.newBuilder()
            .maximumSize(100000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, MailConfigDataSet>() {
                @Override
                public MailConfigDataSet load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/smtp/" + key + "";

                    MailConfigDataSet masterDataList = null;

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("mail info. does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<MailConfigDataSet>() {
                            });

                            log.info("{} reloaded.", key);
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
