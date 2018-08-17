package com.bistel.pdm.batch.processor;

import com.bistel.pdm.batch.util.ServingRequestor;
import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.common.json.SummarizedFeature;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.apache.kafka.streams.state.WindowStoreIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class CalculateHealthProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(CalculateHealthProcessor.class);

    private final static String SEPARATOR = ",";

    private KeyValueStore<Long, String> kvMovingAvgStore;
    private WindowStore<String, String> kvFeatureDataStore;

    private final Timer timer = new Timer();

    private final static ConcurrentHashMap<Long, SummarizedFeature> paramFeatureValueList = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvMovingAvgStore = (KeyValueStore) context().getStateStore("batch-moving-average");
        kvFeatureDataStore = (WindowStore) this.context().getStateStore("batch-fd04-feature-data");

        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        cal.add(Calendar.DATE, 1);

        //next date 00h
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                Date date = new Date();
                Calendar cal = Calendar.getInstance();
                cal.setTime(date);
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);

                Long to = cal.getTime().getTime();
                Long from = to - TimeUnit.DAYS.toMillis(90);

                paramFeatureValueList.clear();
                //String url = "http://10.50.21.240:28000/pdm/api/feature/" + from + "/" + to;
                String url = MasterCache.ServingAddress + "/pdm/api/feature/" + from + "/" + to;
                List<SummarizedFeature> featureList = ServingRequestor.getParamFeatureAvgFor(url);

                for (SummarizedFeature feature : featureList) {
                    paramFeatureValueList.put(feature.getParamRawId(), feature);
                    kvMovingAvgStore.put(feature.getParamRawId(), "0,0");
                }
                log.info("schd : 90-days summary from {} to {}. - refresh count : {}",
                        new Timestamp(from), new Timestamp(to), paramFeatureValueList.size());

            }
        }, cal.getTime(), TimeUnit.DAYS.toMillis(1));

        log.debug("90 days scheduler start time : {} ", cal.getTime());


        if (paramFeatureValueList.size() <= 0) {

            Calendar calOrg = Calendar.getInstance();
            calOrg.setTime(new Date());
            calOrg.set(Calendar.HOUR_OF_DAY, 0);
            calOrg.set(Calendar.MINUTE, 0);
            calOrg.set(Calendar.SECOND, 0);
            calOrg.set(Calendar.MILLISECOND, 0);

            Long to = calOrg.getTime().getTime();
            Long from = to - TimeUnit.DAYS.toMillis(90);

            String url = MasterCache.ServingAddress + "/pdm/api/feature/" + from + "/" + to;
            List<SummarizedFeature> featureList = ServingRequestor.getParamFeatureAvgFor(url);

            if (featureList != null && featureList.size() > 0) {
                for (SummarizedFeature feature : featureList) {
                    paramFeatureValueList.put(feature.getParamRawId(), feature);
                    //kvMovingAvgStore.put(feature.getParamRawId(), "0,0");
                }
            }

            log.info("init : 90-days summary from {} to {}. - refresh count : {}",
                    new Timestamp(from), new Timestamp(to), paramFeatureValueList.size());
        }
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, refresh_cache
        String[] recordColumns = recordValue.split(SEPARATOR, -1);

        try {
            Long paramRawid = Long.parseLong(recordColumns[2]);

            ParameterMasterDataSet paramInfo = getParamMasterDataWithRawId(partitionKey, paramRawid);
            if (paramInfo == null) return;

            String strParamRawid = recordColumns[2];
            String paramKey = partitionKey + ":" + paramRawid;
            String refreshCacheFlag = recordColumns[recordColumns.length - 1];

            Long endTime = Long.parseLong(recordColumns[1]);

            // ==========================================================================================
            // Logic 3 health
            ParameterHealthDataSet fd03Health = getParamHealth(partitionKey, paramRawid, "FD_CHANGE_RATE");
            if (fd03Health != null && fd03Health.getApplyLogicYN().equalsIgnoreCase("Y")) {

                if(paramFeatureValueList.get(paramRawid) != null) {

                    Integer count = Integer.parseInt(recordColumns[3]);
                    Double dValue = Double.parseDouble(recordColumns[7]) * count; //avg * count

                    if (kvMovingAvgStore.get(paramRawid) == null) {
                        kvMovingAvgStore.put(paramRawid, dValue + ",1");
                    } else {
                        String val = kvMovingAvgStore.get(paramRawid);
                        String[] vv = val.split(",");
                        int n = Integer.parseInt(vv[1]) + 1;
                        Double ma = dValue + Double.parseDouble(vv[0]);
                        kvMovingAvgStore.put(paramRawid, ma + "," + n);

                        Double mean = null;
                        Double sigma = null;

                        SummarizedFeature feature = paramFeatureValueList.get(paramRawid);
                        mean = feature.getMean();
                        sigma = feature.getSigma();

                        Double index = 0D;
                        if (mean == null || sigma == null) {
                            log.debug("[{}] - Historical data does not exist.", paramKey);
                        } else {
                            //logic 3 - calculate index
                            index = ((ma / n) - mean) / sigma;
                        }

                        String statusCode = "N";

                        if (index >= 1) {
                            statusCode = "A";
                        } else if (index >= 0.5 && index < 1) {
                            statusCode = "W";
                        }

                        // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
                        String newMsg = endTime + ","
                                + paramInfo.getEquipmentRawId() + ","
                                + paramRawid + ","
                                + fd03Health.getParamHealthRawId() + ","
                                + statusCode + ","
                                + count + ","
                                + index + ","
                                + (paramInfo.getUpperAlarmSpec() == null ? "" : paramInfo.getUpperAlarmSpec()) + ","
                                + (paramInfo.getUpperWarningSpec() == null ? "" : paramInfo.getUpperWarningSpec()) + ","
                                + (paramInfo.getTarget() == null ? "" : paramInfo.getTarget()) + ","
                                + (paramInfo.getLowerAlarmSpec() == null ? "" : paramInfo.getLowerAlarmSpec()) + ","
                                + (paramInfo.getLowerWarningSpec() == null ? "" : paramInfo.getLowerWarningSpec());

                        context().forward(partitionKey, newMsg.getBytes());
                        context().commit();
                        log.debug("[{}] - logic 3 health : {}", paramKey, newMsg);
                    }
                }
            } else {
                //log.debug("[{}] - No health because skip the logic 3.", paramKey);
            }


            // ==========================================================================================
            // Logic 4 health
            ParameterHealthDataSet fd04Health = getParamHealth(partitionKey, paramRawid, "FP_RUL");
            if (fd04Health != null && fd04Health.getApplyLogicYN().equalsIgnoreCase("Y")
                    && paramInfo.getUpperAlarmSpec() != null) {

                Long startTime = endTime - TimeUnit.DAYS.toMillis(7);
                Double dValue = Double.parseDouble(recordColumns[7]);

                kvFeatureDataStore.put(strParamRawid, endTime + "," + dValue, endTime);

                log.debug("[{}] - calculate RUL with average ({}). ", partitionKey, dValue);

                // logic 4 - linear regression
                SimpleRegression regression = new SimpleRegression();

                int dataCount = 0;
                WindowStoreIterator<String> storeIterator = kvFeatureDataStore.fetch(strParamRawid, startTime, endTime);
                while (storeIterator.hasNext()) {
                    KeyValue<Long, String> kv = storeIterator.next();
                    //log.debug("[{}] - fetch : {}", kv.key.key(), kv.value);

                    String[] dbl = kv.value.split(","); // (time, value)
                    regression.addData(Long.parseLong(dbl[0]), Double.parseDouble(dbl[1]));
                    dataCount++;
                }
                storeIterator.close();

                if (dataCount > 0) {
                    double intercept = regression.getIntercept();
                    double slope = regression.getSlope();
                    double x = (paramInfo.getUpperAlarmSpec() - intercept) / slope;

                    // y = intercept + slope * x
                    // remain = x - today
                    long remain = TimeUnit.DAYS.convert((long) x - endTime, TimeUnit.MILLISECONDS);

                    /*
                       Convert Score
                        30 day : 1
                        60 day : 0.5
                        90 day : 0.25

                        y = -0.0167x + 1.5
                     */

                    Double index = -0.0167 * remain + 1.5;

                    String statusCode = "N";

                    if (index >= 1) {
                        statusCode = "A";
                    } else if (index >= 0.5 && index < 1) {
                        statusCode = "W";
                    }

                    // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
                    String newMsg = endTime + ","
                            + paramInfo.getEquipmentRawId() + ","
                            + paramRawid + ","
                            + fd04Health.getParamHealthRawId() + ","
                            + statusCode + ","
                            + dataCount + ","
                            + index + ","
                            + (paramInfo.getUpperAlarmSpec() == null ? "" : paramInfo.getUpperAlarmSpec()) + ","
                            + (paramInfo.getUpperWarningSpec() == null ? "" : paramInfo.getUpperWarningSpec()) + ","
                            + (paramInfo.getTarget() == null ? "" : paramInfo.getTarget()) + ","
                            + (paramInfo.getLowerAlarmSpec() == null ? "" : paramInfo.getLowerAlarmSpec()) + ","
                            + (paramInfo.getLowerWarningSpec() == null ? "" : paramInfo.getLowerWarningSpec()) + ","
                            + intercept + ","
                            + slope + ","
                            + x;

                    context().forward(partitionKey, newMsg.getBytes());
                    context().commit();
                    log.debug("[{}] - logic 4 health : {}", paramKey, newMsg);
                }
            } else {
                //log.debug("[{}] - No health because skip the logic 4.", paramKey);
            }

//            // ==========================================================================================
//            // Logic 1 health
//            ParameterHealthDataSet fd01Health = getParamHealth(paramRawid, "FD_OOS");
//            if (fd01Health != null && fd01Health.getApplyLogicYN().equalsIgnoreCase("Y")) {
//
//                if (paramInfo.getUpperAlarmSpec() == null) return;
//
//                Double davg = Double.parseDouble(recordColumns[7]);
//                double index = davg / paramInfo.getUpperAlarmSpec();
//
//                String statusCode = "N";
//
//                if (index >= 1.0) {
//                    statusCode = "A";
//                } else if (index >= 0.8 && index < 1) {
//                    statusCode = "W";
//                }
//
//                // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
//                String newMsg = endTime + ","
//                        + paramInfo.getEquipmentRawId() + ","
//                        + paramRawid + ","
//                        + fd01Health.getParamHealthRawId() + ","
//                        + statusCode + ","
//                        + recordColumns[3] + ","
//                        + index + ","
//                        + (paramInfo.getUpperAlarmSpec() == null ? "" : paramInfo.getUpperAlarmSpec()) + ","
//                        + (paramInfo.getUpperWarningSpec() == null ? "" : paramInfo.getUpperWarningSpec()) + ","
//                        + (paramInfo.getTarget() == null ? "" : paramInfo.getTarget()) + ","
//                        + (paramInfo.getLowerAlarmSpec() == null ? "" : paramInfo.getLowerAlarmSpec()) + ","
//                        + (paramInfo.getLowerWarningSpec() == null ? "" : paramInfo.getLowerWarningSpec());
//
//                context().forward(partitionKey, newMsg.getBytes());
//                context().commit();
//                log.debug("[{}] - logic 1 health : {}", paramKey, newMsg);
//            } else {
//                //log.debug("[{}] - No health because skip the logic 1.", paramKey);
//            }


            // refresh cache
            if (refreshCacheFlag.equalsIgnoreCase("CRC")) {

                MasterCache.Equipment.refresh(partitionKey);
                MasterCache.Parameter.refresh(partitionKey);
                MasterCache.Event.refresh(partitionKey);
                MasterCache.Health.refresh(partitionKey);
                MasterCache.Mail.refresh(partitionKey);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private ParameterMasterDataSet getParamMasterDataWithRawId(String key, Long rawId) throws ExecutionException {
        ParameterMasterDataSet param = null;

        List<ParameterMasterDataSet> paramList = MasterCache.Parameter.get(key);
        for (ParameterMasterDataSet p : paramList) {
            if (p.getParameterRawId().equals(rawId)) {
                param = p;
                break;
            }
        }

        return param;
    }

    private ParameterHealthDataSet getParamHealth(String partitionKey, Long paramKey, String code) throws ExecutionException {
        ParameterHealthDataSet healthData = null;

        List<ParameterHealthDataSet> healthList = MasterCache.Health.get(partitionKey);
        for (ParameterHealthDataSet health : healthList) {
            if (health.getParamRawId().equals(paramKey) && health.getHealthCode().equalsIgnoreCase(code)) {
                healthData = health;
                break;
            }
        }

        return healthData;
    }
}
