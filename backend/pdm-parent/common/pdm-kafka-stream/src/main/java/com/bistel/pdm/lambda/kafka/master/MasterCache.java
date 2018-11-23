package com.bistel.pdm.lambda.kafka.master;

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
public class MasterCache {
    private static final Logger log = LoggerFactory.getLogger(MasterCache.class);

    public static String ServingAddress = "localhost";

    public static LoadingCache<String, EquipmentMaster> Equipment = CacheBuilder.newBuilder()
            .maximumSize(50000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, EquipmentMaster>() {
                @Override
                public EquipmentMaster load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/equipment/" + key + "";

                    EquipmentMaster masterDataList = null;

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("equipment master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<EquipmentMaster>() {
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

    public static LoadingCache<String, List<ConditionalSpecRuleMaster>> EquipmentSpecRule = CacheBuilder.newBuilder()
            .maximumSize(50000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, List<ConditionalSpecRuleMaster>>() {
                @Override
                public List<ConditionalSpecRuleMaster> load(String key) {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/equipment/specrule/" + key + "";

                    List<ConditionalSpecRuleMaster> masterDataList = null;

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("equipment master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<List<ConditionalSpecRuleMaster>>() {
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

    public static LoadingCache<String, List<ParameterMaster>> Parameter = CacheBuilder.newBuilder()
            .maximumSize(50000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, List<ParameterMaster>>() {
                @Override
                public List<ParameterMaster> load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/param/" + key + "";

                    List<ParameterMaster> masterDataList = new ArrayList<>();

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("parameter master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<List<ParameterMaster>>() {
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

    public static LoadingCache<String, List<ParameterWithSpecMaster>> ParameterWithSpec = CacheBuilder.newBuilder()
            .maximumSize(100000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, List<ParameterWithSpecMaster>>() {
                @Override
                public List<ParameterWithSpecMaster> load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/paramspec/" + key + "";

                    List<ParameterWithSpecMaster> masterDataList = new ArrayList<>();

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("parameter master with spec data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<List<ParameterWithSpecMaster>>() {
                            });

                            log.info("{} - parameter with spec are reloaded.", key);
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

    public static LoadingCache<String, Pair<EventMaster, EventMaster>> IntervalEvent = CacheBuilder.newBuilder()
            .maximumSize(100000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, Pair<EventMaster, EventMaster>>() {
                @Override
                public Pair<EventMaster, EventMaster> load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/event/" + key + "";

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    EventMaster startEvent = new EventMaster();
                    EventMaster endEvent = new EventMaster();

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("event master data does not exists. message: " + body);
                        } else {
                            List<EventMaster> masterDataList = mapper.readValue(body, new TypeReference<List<EventMaster>>() {
                            });

                            for (EventMaster eventInfo : masterDataList) {
                                if (eventInfo.getProcessYN().equalsIgnoreCase("Y")) {
                                    if (eventInfo.getEventTypeCD().equalsIgnoreCase("S")) {
                                        startEvent = eventInfo;
                                    } else if (eventInfo.getEventTypeCD().equalsIgnoreCase("E")) {
                                        endEvent = eventInfo;
                                    }
                                }
                            }

                            log.info("{} - events are reloaded.", key);
                        }
                    } catch (IOException e) {
                        log.error(e.getMessage(), e);
                    } finally {
                        response.close();
                        client.close();
                    }

                    return new Pair<>(startEvent, endEvent);
                }
            });

//    public static LoadingCache<String, List<EventMaster>> Event = CacheBuilder.newBuilder()
//            .maximumSize(100000)
//            .expireAfterAccess(24, TimeUnit.HOURS)
//            .build(new CacheLoader<String, List<EventMaster>>() {
//                @Override
//                public List<EventMaster> load(String key) throws IOException {
//                    String targetUrl = ServingAddress + "/pdm/api/master/latest/event/" + key + "";
//
//                    List<EventMaster> masterDataList = new ArrayList<>();
//
//                    ResteasyClient client = new ResteasyClientBuilder().build();
//                    Response response = client.target(targetUrl).request().get();
//                    String body = response.readEntity(String.class);
//
//                    try {
//                        ObjectMapper mapper = new ObjectMapper();
//
//                        if (body.length() <= 0) {
//                            log.info("event master data does not exists. message: " + body);
//                        } else {
//                            masterDataList = mapper.readValue(body, new TypeReference<List<EventMaster>>() {
//                            });
//
//                            log.info("{} - events are reloaded.", key);
//                        }
//                    } catch (IOException e) {
//                        log.error(e.getMessage(), e);
//                    } finally {
//                        response.close();
//                        client.close();
//                    }
//
//                    return masterDataList;
//                }
//            });

    public static LoadingCache<String, List<ParameterHealthMaster>> Health = CacheBuilder.newBuilder()
            .maximumSize(10000000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, List<ParameterHealthMaster>>() {
                @Override
                public List<ParameterHealthMaster> load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/health/" + key + "";

                    List<ParameterHealthMaster> masterDataList = new ArrayList<>();

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("health master data does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<List<ParameterHealthMaster>>() {
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

    public static LoadingCache<String, MailConfigMaster> Mail = CacheBuilder.newBuilder()
            .maximumSize(100000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, MailConfigMaster>() {
                @Override
                public MailConfigMaster load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/smtp/" + key + "";

                    MailConfigMaster masterDataList = null;

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("mail info. does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<MailConfigMaster>() {
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

    public static LoadingCache<String, Map<String, Map<String, String>>> SpecRuleExpression = CacheBuilder.newBuilder()
            .maximumSize(100000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, Map<String, Map<String, String>>>() {
                @Override
                public Map<String, Map<String, String>> load(String key) throws IOException {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/param/expr/" + key + "";

                    List<SpecRuleExpressionMaster> masterDataList;
                    Map<String, Map<String, String>> exprMap = new HashMap<>();

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("expr. parameter master does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<List<SpecRuleExpressionMaster>>() {
                            });

                            for (SpecRuleExpressionMaster expr : masterDataList) {
                                if (!exprMap.containsKey(expr.getRuleName())) {
                                    Map<String, String> map = new HashMap<>();
                                    map.put(expr.getParameterName(), expr.getSvid());
                                    exprMap.put(expr.getRuleName(), map);
                                } else {
                                    Map<String, String> map = exprMap.get(expr.getRuleName());
                                    map.put(expr.getParameterName(), expr.getSvid());
                                }
                            }

                            log.info("{} - expr. parameter are reloaded.", key);
                        }
                    } catch (IOException e) {
                        log.error(e.getMessage(), e);
                    } finally {
                        response.close();
                        client.close();
                    }

                    return exprMap;
                }
            });

    public static LoadingCache<String, ProcessGroupMaster> ProcessGroup = CacheBuilder.newBuilder()
            .maximumSize(100000)
            .expireAfterAccess(24, TimeUnit.HOURS)
            .build(new CacheLoader<String, ProcessGroupMaster>() {
                @Override
                public ProcessGroupMaster load(String key) {
                    String targetUrl = ServingAddress + "/pdm/api/master/latest/processgroup/" + key + "";

                    ProcessGroupMaster masterDataList = null;

                    ResteasyClient client = new ResteasyClientBuilder().build();
                    Response response = client.target(targetUrl).request().get();
                    String body = response.readEntity(String.class);

                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        if (body.length() <= 0) {
                            log.info("process group info. does not exists. message: " + body);
                        } else {
                            masterDataList = mapper.readValue(body, new TypeReference<ProcessGroupMaster>() {
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
