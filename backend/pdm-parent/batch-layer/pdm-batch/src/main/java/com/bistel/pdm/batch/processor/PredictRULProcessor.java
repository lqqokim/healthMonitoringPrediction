package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.WindowStore;
import org.apache.kafka.streams.state.WindowStoreIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

/**
 *
 */
public class PredictRULProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(PredictRULProcessor.class);

    private final static String SEPARATOR = ",";

    private WindowStore<String, String> kvFeatureDataStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
        kvFeatureDataStore = (WindowStore) this.context().getStateStore("batch-fd04-feature-data");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);

        try {
            // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3
            String[] recordColumns = recordValue.split(SEPARATOR);
            String strParamRawid = recordColumns[2];
            Long paramRawid = Long.parseLong(strParamRawid);
            String paramKey = partitionKey + ":" + paramRawid;

            ParameterMasterDataSet paramMaster =
                    MasterDataCache.getInstance().getParamMasterDataSetWithRawId(partitionKey, paramRawid);

            if (paramMaster == null) return;

            Long endTime = Long.parseLong(recordColumns[1]);
            Long startTime = endTime - TimeUnit.DAYS.toMillis(7);

            ParameterHealthDataSet fd04HealthInfo =
                    MasterDataCache.getInstance().getParamHealthFD04(paramRawid);
            if (fd04HealthInfo != null && fd04HealthInfo.getApplyLogicYN().equalsIgnoreCase("Y")) {

                if (paramMaster.getUpperAlarmSpec() == null) return;

                Double dValue = Double.parseDouble(recordColumns[7]);

                kvFeatureDataStore.put(strParamRawid, endTime + "," + dValue, endTime);

                log.debug("[{}] - calculate RUL with average ({}). ", partitionKey, dValue);

                // ==========================================================================================
                // Logic 4 health

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
                    log.trace("[{}] - data size : {}", paramKey, dataCount);

                    double intercept = regression.getIntercept();
                    double slope = regression.getSlope();
                    double x = (paramMaster.getUpperAlarmSpec() - intercept) / slope;

                    // y = intercept + slope * x
                    log.debug("[{}] - intercept : {}, slope : {}, X : {}", paramKey, intercept, slope, x);

                    // x - today
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
                            + paramMaster.getEquipmentRawId() + ","
                            + paramRawid + ","
                            + fd04HealthInfo.getParamHealthRawId() + ","
                            + statusCode + ","
                            + dataCount + ","
                            + index + ","
                            + (paramMaster.getUpperAlarmSpec() == null ? "" : paramMaster.getUpperAlarmSpec()) + ","
                            + (paramMaster.getUpperWarningSpec() == null ? "" : paramMaster.getUpperWarningSpec()) + ","
                            + (paramMaster.getTarget() == null ? "" : paramMaster.getTarget()) + ","
                            + (paramMaster.getLowerAlarmSpec() == null ? "" : paramMaster.getLowerAlarmSpec()) + ","
                            + (paramMaster.getLowerWarningSpec() == null ? "" : paramMaster.getLowerWarningSpec()) + ","
                            + intercept + ","
                            + slope + ","
                            + x;

                    context().forward(partitionKey, newMsg.getBytes());
                    context().commit();
                    log.debug("[{}] - logic 4 health : {}", paramKey, newMsg);

                } else {
                    log.debug("[{}] - Unable to calculate RUL...", paramKey);
                }
            } else {
                log.debug("[{}] - No health because skip the logic 4.", paramKey);
            }

            // ==========================================================================================
            // Logic 1 health
            // logic 1 - calculate index
            ParameterHealthDataSet fd01HealthInfo = MasterDataCache.getInstance().getParamHealthFD01(paramRawid);
            if (fd01HealthInfo != null && fd01HealthInfo.getApplyLogicYN().equalsIgnoreCase("Y")) {

                if (paramMaster.getUpperAlarmSpec() == null) return;

                Double davg = Double.parseDouble(recordColumns[7]);
                double index = davg / paramMaster.getUpperAlarmSpec();

                String statusCode = "N";

                if (index >= 1.0) {
                    statusCode = "A";
                } else if (index >= 0.8 && index < 1) {
                    statusCode = "W";
                }

                // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
                String newMsg = endTime + ","
                        + paramMaster.getEquipmentRawId() + ","
                        + paramRawid + ","
                        + fd01HealthInfo.getParamHealthRawId() + ","
                        + statusCode + ","
                        + recordColumns[3] + ","
                        + index + ","
                        + (paramMaster.getUpperAlarmSpec() == null ? "" : paramMaster.getUpperAlarmSpec()) + ","
                        + (paramMaster.getUpperWarningSpec() == null ? "" : paramMaster.getUpperWarningSpec()) + ","
                        + (paramMaster.getTarget() == null ? "" : paramMaster.getTarget()) + ","
                        + (paramMaster.getLowerAlarmSpec() == null ? "" : paramMaster.getLowerAlarmSpec()) + ","
                        + (paramMaster.getLowerWarningSpec() == null ? "" : paramMaster.getLowerWarningSpec());

                context().forward(partitionKey, newMsg.getBytes());
                context().commit();
                log.debug("[{}] - logic 1 health : {}", paramKey, newMsg);
            } else {
                log.debug("[{}] - No health because skip the logic 1.", paramKey);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
