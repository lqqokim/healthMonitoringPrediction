package com.bistel.pdm.lambda.kafka.master;

import com.bistel.pdm.common.json.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class MasterDataCache {

    // EQP
    private final Map<String, Long> eqpMasterDataSet = new ConcurrentHashMap<>();

    // param
    private final Map<String, List<ParameterMasterDataSet>> paramMasterDataSet = new ConcurrentHashMap<>();

    // event
    private final Map<String, List<EventMasterDataSet>> eventMasterDataSet = new ConcurrentHashMap<>();

    // upper/lower alarm, warning
    private final Map<Long, List<ParameterSpecDataSet>> paramSpecDataSet = new ConcurrentHashMap<>();

    // health logic
    private final Map<Long, List<ParameterHealthDataSet>> paramHealthDataSet = new ConcurrentHashMap<>();

    private MailConfigDataSet mailConfigDataSet = new MailConfigDataSet();

    // Private constructor prevents instantiation from other classes
    private MasterDataCache() {
    }

    /**
     * SingletonHolder is loaded on the first execution of Singleton.getInstance()
     * or the first access to SingletonHolder.INSTANCE, not before.
     */
    private static class SingletonHolder {
        public static final MasterDataCache INSTANCE = new MasterDataCache();
    }

    public static MasterDataCache getInstance() {
        return SingletonHolder.INSTANCE;
    }

    public Map<String, Long> getEqpMasterDataSet() {
        return eqpMasterDataSet;
    }

    public Map<String, List<ParameterMasterDataSet>> getParamMasterDataSet() {
        return paramMasterDataSet;
    }

    public ParameterMasterDataSet getParamMasterDataSetWithRawId(String key, String rawId) {
        ParameterMasterDataSet param = null;

        List<ParameterMasterDataSet> paramList = paramMasterDataSet.get(key);
        for(ParameterMasterDataSet p : paramList){
            if(p.getParameterRawId() == Long.parseLong(rawId)){
                param = p;
                break;
            }
        }

        return param;
    }

    public ParameterMasterDataSet getParameter(String partitionKey, String paramName) {
        ParameterMasterDataSet param = new ParameterMasterDataSet();
        List<ParameterMasterDataSet> params = paramMasterDataSet.get(partitionKey);
        for (ParameterMasterDataSet p : params) {
            if (p.getParameterName().equalsIgnoreCase(paramName)) {
                param = p;
            }
        }

        return param;
    }

    public Map<String, List<EventMasterDataSet>> getEventMasterDataSet() {
        return eventMasterDataSet;
    }

    public Map<Long, List<ParameterHealthDataSet>> getParamHealthDataSet() {
        return paramHealthDataSet;
    }

    public ParameterHealthDataSet getParamHealthFD01(Long key) {
        ParameterHealthDataSet healthData = null;

        if (this.paramHealthDataSet.get(key) != null) {
            for (ParameterHealthDataSet health : this.paramHealthDataSet.get(key)) {
                if (health.getHealthCode().equalsIgnoreCase("FD_OOS")) {
                    healthData = health;
                    break;
                }
            }
        }

        return healthData;
    }

    public ParameterHealthDataSet getParamHealthFD02(Long key) {
        ParameterHealthDataSet healthData = null;

        if (this.paramHealthDataSet.get(key) != null) {
            for (ParameterHealthDataSet health : this.paramHealthDataSet.get(key)) {
                if (health.getHealthCode().equalsIgnoreCase("FD_RULE_1")) {
                    healthData = health;
                    break;
                }
            }
        }

        return healthData;
    }

    public EventMasterDataSet getEventForProcess(String key) {
        EventMasterDataSet result = null;

        if (eventMasterDataSet.get(key) != null) {
            for (EventMasterDataSet data : eventMasterDataSet.get(key)) {
                if (data.getProcessYN().equalsIgnoreCase("Y")
                        && data.getEventTypeCD().equalsIgnoreCase("S")) {
                    result = data;
                    break;
                }
            }
        }

        return result;
    }

    public EventMasterDataSet getEventByType(String key, String type) {
        EventMasterDataSet result = null;
        if (eventMasterDataSet.get(key) != null) {
            for (EventMasterDataSet data : eventMasterDataSet.get(key)) {
                if (data.getProcessYN().equalsIgnoreCase("Y")
                        && data.getEventTypeCD().equalsIgnoreCase(type)) {
                    result = data;
                    break;
                }
            }
        }

        return result;
    }

    public Map<Long, List<ParameterSpecDataSet>> getParamSpecDataSet() {
        return paramSpecDataSet;
    }

    public MailConfigDataSet getMailConfigDataSet() {
        return mailConfigDataSet;
    }

    public void putMailConfigDataSet(MailConfigDataSet conf) {
        mailConfigDataSet = conf;
    }
}
