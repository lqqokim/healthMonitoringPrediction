package com.bistel.pdm.lambda.kafka.master;

import com.bistel.pdm.common.collection.Pair;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class MasterDataCache {
    private final Map<String, Long> masterDataSet = new ConcurrentHashMap<>();
    private final Map<Long, Pair<Float, Float>> paramSpecDataSet = new ConcurrentHashMap<>(); //alarm, warning

    //param_rawid : feature_rawid, param_name, feature_name, main_yn, aggregate_yn
    private final Map<Long, ArrayList<String[]>> featureDataSet = new ConcurrentHashMap<>();

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

    public void putMaster(String key, Long rawId) {
        this.masterDataSet.put(key, rawId);
    }

    public Long getRawId(String key) {
        return this.masterDataSet.get(key);
    }

    public int getMasterDataSize(){
        return this.masterDataSet.size();
    }

    public boolean getMasterContainsKey(String key) {
        return this.masterDataSet.containsKey(key);
    }

    public void putAlarmWarningSpec(Long key, Pair<Float, Float> value) {
        this.paramSpecDataSet.put(key, value);
    }

    public Pair<Float, Float> getAlarmWarningSpec(Long key) {
        return this.paramSpecDataSet.get(key);
    }

    public void putFeature(Long paramRawId, String[] columns) {
        if(!this.featureDataSet.containsKey(paramRawId)){
            ArrayList<String[]> row = new ArrayList<>();
            row.add(columns);
            this.featureDataSet.put(paramRawId, row);
        } else {
            ArrayList<String[]> row = this.featureDataSet.get(paramRawId);
            row.add(columns);

            this.featureDataSet.put(paramRawId, row);
        }
    }

    public ArrayList<String[]> getFeaturesByRawId(String paramRawId) {
        return this.featureDataSet.get(Long.parseLong(paramRawId));
    }

    public int getFeatureDataSize(){
        return this.featureDataSet.size();
    }
}
