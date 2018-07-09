package com.bistel.pdm.lambda.kafka.master;

import com.bistel.pdm.common.json.*;
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
public class MasterDataUpdater {
    private static final Logger log = LoggerFactory.getLogger(MasterDataUpdater.class);

    /**
     * update equipment master into stream
     * @param targetUrl
     */
    public static void updateEqpMasterDataSet(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        Response response = client.target(targetUrl).request().get();
        String body = response.readEntity(String.class);

        ObjectMapper mapper = new ObjectMapper();
        List<EquipmentMasterDataSet> masterDataList = null;

        try {
            if (body.length() <= 0) {
                log.info("equipment master data does not exists. message: " + body);
            } else {
                masterDataList = mapper.readValue(body, new TypeReference<List<EquipmentMasterDataSet>>() {
                });

                for (EquipmentMasterDataSet data : masterDataList) {
                    MasterDataCache.getInstance().getEqpMasterDataSet().put(data.toKey(), data.getEqpRawId());
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

    /**
     * update parameter master into stream
     * @param targetUrl
     */
    public static void updateParameterMasterDataSet(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        Response response = client.target(targetUrl).request().get();
        String body = response.readEntity(String.class);

        ObjectMapper mapper = new ObjectMapper();
        List<ParameterMasterDataSet> masterDataList = null;

        try {
            if (body.length() <= 0) {
                log.info("parameter master data does not exists. message: " + body);
            } else {
                masterDataList = mapper.readValue(body, new TypeReference<List<ParameterMasterDataSet>>() {
                });

                for (ParameterMasterDataSet data : masterDataList) {
                    if(!MasterDataCache.getInstance().getParamMasterDataSet().containsKey(data.toKey())){
                        List<ParameterMasterDataSet> list = new ArrayList<>();
                        list.add(data);
                        MasterDataCache.getInstance().getParamMasterDataSet().put(data.toKey(), list);
                    } else {
                        List<ParameterMasterDataSet> list =
                                MasterDataCache.getInstance().getParamMasterDataSet().get(data.toKey());
                        list.add(data);
                    }
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

    public static void updateEventMasterDataSet(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        Response response = client.target(targetUrl).request().get();
        String body = response.readEntity(String.class);

        ObjectMapper mapper = new ObjectMapper();
        List<EventMasterDataSet> masterDataList = null;

        try {
            if (body.length() <= 0) {
                log.info("event master data does not exists. message: " + body);
            } else {
                masterDataList = mapper.readValue(body, new TypeReference<List<EventMasterDataSet>>() {
                });

                for (EventMasterDataSet data : masterDataList) {
                    if(!MasterDataCache.getInstance().getEventMasterDataSet().containsKey(data.toKey())){
                        List<EventMasterDataSet> list = new ArrayList<>();
                        list.add(data);
                        MasterDataCache.getInstance().getEventMasterDataSet().put(data.toKey(), list);
                    } else {
                        List<EventMasterDataSet> list =
                                MasterDataCache.getInstance().getEventMasterDataSet().get(data.toKey());
                        list.add(data);
                    }
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
                log.info("spec data does not exists. message: " + body);
            } else {
                paramSpecDataList = mapper.readValue(body, new TypeReference<List<ParameterSpecDataSet>>() {
                });

                for (ParameterSpecDataSet data : paramSpecDataList) {
                    if(!MasterDataCache.getInstance().getParamSpecDataSet().containsKey(data.toKey())){
                        List<ParameterSpecDataSet> list = new ArrayList<>();
                        list.add(data);
                        MasterDataCache.getInstance().getParamSpecDataSet().put(data.toKey(), list);
                    } else {
                        List<ParameterSpecDataSet> list =
                                MasterDataCache.getInstance().getParamSpecDataSet().get(data.toKey());
                        list.add(data);
                    }
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

    public static void updateParamHealthDataSet(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        Response response = client.target(targetUrl).request().get();
        String body = response.readEntity(String.class);

        ObjectMapper mapper = new ObjectMapper();
        List<ParameterHealthDataSet> paramHealthDataList = null;

        try {
            if (body.length() <= 0) {
                log.info("parameter health data does not exists. message: " + body);
            } else {
                paramHealthDataList = mapper.readValue(body, new TypeReference<List<ParameterHealthDataSet>>() {
                });

                for (ParameterHealthDataSet data : paramHealthDataList) {
                    if(!MasterDataCache.getInstance().getParamHealthDataSet().containsKey(data.toKey())){
                        List<ParameterHealthDataSet> list = new ArrayList<>();
                        list.add(data);
                        MasterDataCache.getInstance().getParamHealthDataSet().put(data.toKey(), list);
                    } else {
                        List<ParameterHealthDataSet> list =
                                MasterDataCache.getInstance().getParamHealthDataSet().get(data.toKey());
                        list.add(data);
                    }
                }
                log.info("{} reference has been updated.", paramHealthDataList.size());
            }
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } finally {
            response.close();
            client.close();
        }
    }

    public static void updateSmtpConfigDataSet(String targetUrl) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        Response response = client.target(targetUrl).request().get();
        String body = response.readEntity(String.class);

        ObjectMapper mapper = new ObjectMapper();
        MailConfigDataSet config = null;

        try {
            if (body.length() <= 0) {
                log.info("parameter health data does not exists. message: " + body);
            } else {
                config = mapper.readValue(body, new TypeReference<MailConfigDataSet>() {
                });

                MasterDataCache.getInstance().putMailConfigDataSet(config);

                log.info("1 reference has been updated.");
            }
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } finally {
            response.close();
            client.close();
        }
    }
}
