package com.bistel.pdm.lambda.kafka.master;

import com.bistel.pdm.common.collection.Pair;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class MasterDataCache {
    private Map<String, Long> masterDataSet = new ConcurrentHashMap<>();
    private Map<String, Pair<Float, Float>> paramSpecDataSet = new ConcurrentHashMap<>(); //alarm, warning

    // Private constructor prevents instantiation from other classes
    private MasterDataCache() { }

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

    public void putMaster(String key, Long rawId){
        this.masterDataSet.put(key, rawId);
    }

    public Long getRawId(String key){
        return this.masterDataSet.get(key);
    }

    public boolean getMasterContainsKey(String key){
        return this.masterDataSet.containsKey(key);
    }

    public void putAlarmWarningSpec(String key, Pair<Float, Float> value){
        this.paramSpecDataSet.put(key, value);
    }

    public Pair<Float, Float> getAlarmWarningSpec(String key){
        return this.paramSpecDataSet.get(key);
    }
}
