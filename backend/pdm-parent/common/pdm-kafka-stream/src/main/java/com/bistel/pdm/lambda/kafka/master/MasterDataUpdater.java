//package com.bistel.pdm.lambda.kafka.master;
//
//import com.bistel.pdm.common.json.*;
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.jboss.resteasy.client.jaxrs.ResteasyClient;
//import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import javax.ws.rs.core.Response;
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.List;
//
///**
// *
// */
//public class MasterDataUpdater {
//    private static final Logger log = LoggerFactory.getLogger(MasterDataUpdater.class);
//
//    /**
//     * update equipment master into stream
//     * @param targetUrl
//     */
//    public static void updateEqpMasterDataSet(String key, String targetUrl) {
//        ResteasyClient client = new ResteasyClientBuilder().build();
//        Response response = client.target(targetUrl).request().get();
//        String body = response.readEntity(String.class);
//
//        ObjectMapper mapper = new ObjectMapper();
//        List<EquipmentMasterDataSet> masterDataList = null;
//
//        try {
//            if (body.length() <= 0) {
//                log.info("equipment master data does not exists. message: " + body);
//            } else {
//                masterDataList = mapper.readValue(body, new TypeReference<List<EquipmentMasterDataSet>>() {
//                });
//
//                if(key.equalsIgnoreCase("all")){
//                    if(MasterDataCache.getInstance().getEqpMasterDataSet() != null){
//                        MasterDataCache.getInstance().getEqpMasterDataSet().clear();
//                    }
//
//                    for (EquipmentMasterDataSet data : masterDataList) {
//                        MasterDataCache.getInstance().getEqpMasterDataSet().put(data.toKey(), data.getEqpRawId());
//                    }
//                } else {
//                    for (EquipmentMasterDataSet data : masterDataList) {
//                        MasterDataCache.getInstance().getEqpMasterDataSet().put(data.toKey(), data.getEqpRawId());
//                    }
//                }
//                log.info("{} updated.", key);
//            }
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        } finally {
//            response.close();
//            client.close();
//        }
//    }
//
//    /**
//     * update parameter master into stream
//     * @param targetUrl
//     */
//    public static void updateParameterMasterDataSet(String key, String targetUrl) {
//        ResteasyClient client = new ResteasyClientBuilder().build();
//        Response response = client.target(targetUrl).request().get();
//        String body = response.readEntity(String.class);
//
//        ObjectMapper mapper = new ObjectMapper();
//        List<ParameterMasterDataSet> masterDataList = null;
//
//        try {
//            if (body.length() <= 0) {
//                log.info("parameter master data does not exists. message: " + body);
//            } else {
//                masterDataList = mapper.readValue(body, new TypeReference<List<ParameterMasterDataSet>>() {
//                });
//
//                if(key.equalsIgnoreCase("all")){
//                    MasterDataCache.getInstance().getParamMasterDataSet().clear();
//
//                    for (ParameterMasterDataSet data : masterDataList) {
//                        if(!MasterDataCache.getInstance().getParamMasterDataSet().containsKey(data.toKey())){
//                            List<ParameterMasterDataSet> list = new ArrayList<>();
//                            list.add(data);
//                            MasterDataCache.getInstance().getParamMasterDataSet().put(data.toKey(), list);
//                        } else {
//                            List<ParameterMasterDataSet> list =
//                                    MasterDataCache.getInstance().getParamMasterDataSet().get(data.toKey());
//                            list.add(data);
//                        }
//                    }
//                } else {
//                    if(MasterDataCache.getInstance().getParamMasterDataSet().get(key) != null){
//                        MasterDataCache.getInstance().getParamMasterDataSet().get(key).clear();
//                    }
//
//                    for (ParameterMasterDataSet data : masterDataList) {
//                        if(!MasterDataCache.getInstance().getParamMasterDataSet().containsKey(data.toKey())){
//                            List<ParameterMasterDataSet> list = new ArrayList<>();
//                            list.add(data);
//                            MasterDataCache.getInstance().getParamMasterDataSet().put(data.toKey(), list);
//                        } else {
//                            List<ParameterMasterDataSet> list =
//                                    MasterDataCache.getInstance().getParamMasterDataSet().get(data.toKey());
//                            list.add(data);
//                        }
//                    }
//                }
//
//                log.info("{} updated.", key);
//            }
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        } finally {
//            response.close();
//            client.close();
//        }
//    }
//
//    public static void updateEventMasterDataSet(String key, String targetUrl) {
//        ResteasyClient client = new ResteasyClientBuilder().build();
//        Response response = client.target(targetUrl).request().get();
//        String body = response.readEntity(String.class);
//
//        ObjectMapper mapper = new ObjectMapper();
//        List<EventMasterDataSet> masterDataList = null;
//
//        try {
//            if (body.length() <= 0) {
//                log.info("event master data does not exists. message: " + body);
//            } else {
//                masterDataList = mapper.readValue(body, new TypeReference<List<EventMasterDataSet>>() {
//                });
//
//                if(key.equalsIgnoreCase("all")){
//                    MasterDataCache.getInstance().getEventMasterDataSet().clear();
//
//                    for (EventMasterDataSet data : masterDataList) {
//                        if(!MasterDataCache.getInstance().getEventMasterDataSet().containsKey(data.toKey())){
//                            List<EventMasterDataSet> list = new ArrayList<>();
//                            list.add(data);
//                            MasterDataCache.getInstance().getEventMasterDataSet().put(data.toKey(), list);
//                        } else {
//                            List<EventMasterDataSet> list =
//                                    MasterDataCache.getInstance().getEventMasterDataSet().get(data.toKey());
//                            list.add(data);
//                        }
//                    }
//                } else {
//                    if(MasterDataCache.getInstance().getEventMasterDataSet().get(key) != null){
//                        MasterDataCache.getInstance().getEventMasterDataSet().get(key).clear();
//                    }
//
//                    for (EventMasterDataSet data : masterDataList) {
//                        if(!MasterDataCache.getInstance().getEventMasterDataSet().containsKey(data.toKey())){
//                            List<EventMasterDataSet> list = new ArrayList<>();
//                            list.add(data);
//                            MasterDataCache.getInstance().getEventMasterDataSet().put(data.toKey(), list);
//                        } else {
//                            List<EventMasterDataSet> list =
//                                    MasterDataCache.getInstance().getEventMasterDataSet().get(data.toKey());
//                            list.add(data);
//                        }
//                    }
//                }
//
//                log.info("{} updated.", key);
//            }
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        } finally {
//            response.close();
//            client.close();
//        }
//    }
//
//    public static void updateParamHealthDataSet(String key, String targetUrl) {
//        ResteasyClient client = new ResteasyClientBuilder().build();
//        Response response = client.target(targetUrl).request().get();
//        String body = response.readEntity(String.class);
//
//        ObjectMapper mapper = new ObjectMapper();
//        List<ParameterHealthDataSet> paramHealthDataList = null;
//
//        try {
//            if (body.length() <= 0) {
//                log.info("parameter health data does not exists. message: " + body);
//            } else {
//                paramHealthDataList = mapper.readValue(body, new TypeReference<List<ParameterHealthDataSet>>() {
//                });
//
//                if(key.equalsIgnoreCase("all")){
//                    MasterDataCache.getInstance().getParamHealthDataSet().clear();
//
//                    for (ParameterHealthDataSet data : paramHealthDataList) {
//                        if(!MasterDataCache.getInstance().getParamHealthDataSet().containsKey(data.toKey())){
//                            List<ParameterHealthDataSet> list = new ArrayList<>();
//                            list.add(data);
//                            MasterDataCache.getInstance().getParamHealthDataSet().put(data.toKey(), list);
//                        } else {
//                            List<ParameterHealthDataSet> list =
//                                    MasterDataCache.getInstance().getParamHealthDataSet().get(data.toKey());
//                            list.add(data);
//                        }
//                    }
//                } else {
//                    List<ParameterMasterDataSet> paramList = MasterDataCache.getInstance().getParamMasterDataSet().get(key);
//                    if(paramList != null){
//                        for(ParameterMasterDataSet param : paramList){
//                            if(MasterDataCache.getInstance().getParamHealthDataSet().get(param.getParameterRawId()) != null){
//                                MasterDataCache.getInstance().getParamHealthDataSet().get(param.getParameterRawId()).clear();
//                                log.debug("clear health for {}", param.getParameterName());
//                            }
//                        }
//                    }
//
//                    if(paramHealthDataList != null){
//                        for (ParameterHealthDataSet data : paramHealthDataList) {
//                            if(!MasterDataCache.getInstance().getParamHealthDataSet().containsKey(data.toKey())){
//                                List<ParameterHealthDataSet> list = new ArrayList<>();
//                                list.add(data);
//                                MasterDataCache.getInstance().getParamHealthDataSet().put(data.toKey(), list);
//                            } else {
//                                List<ParameterHealthDataSet> list =
//                                        MasterDataCache.getInstance().getParamHealthDataSet().get(data.toKey());
//                                list.add(data);
//                            }
//                        }
//                    }
//                }
//
//                log.info("{} updated.", key);
//            }
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        } finally {
//            response.close();
//            client.close();
//        }
//    }
//
//    public static void updateSmtpConfigDataSet(String targetUrl) {
//        ResteasyClient client = new ResteasyClientBuilder().build();
//        Response response = client.target(targetUrl).request().get();
//        String body = response.readEntity(String.class);
//
//        ObjectMapper mapper = new ObjectMapper();
//        MailConfigDataSet config = null;
//
//        try {
//            if (body.length() <= 0) {
//                log.info("parameter health data does not exists. message: " + body);
//            } else {
//                config = mapper.readValue(body, new TypeReference<MailConfigDataSet>() {
//                });
//
//                MasterDataCache.getInstance().putMailConfigDataSet(config);
//
//                log.info("1 reference has been updated.");
//            }
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        } finally {
//            response.close();
//            client.close();
//        }
//    }
//}
