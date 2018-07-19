package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Windowed;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
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

            Double dValue = Double.parseDouble(recordColumns[7]);

            Long endTime = Long.parseLong(recordColumns[1]);
            Long startTime = endTime - TimeUnit.DAYS.toMillis(7);

            String paramKey = partitionKey + ":" + paramRawid;

            ParameterMasterDataSet paramMaster =
                    MasterDataCache.getInstance().getParamMasterDataSetWithRawId(partitionKey, paramRawid);

            ParameterHealthDataSet fd04HealthInfo =
                    MasterDataCache.getInstance().getParamHealthFD04(paramRawid);

            if (fd04HealthInfo != null) {
                log.debug("[{}] - calculate RUL with average ({}). ", partitionKey, dValue);

                // ==========================================================================================
                // Logic 4 health

                List<String> doubleValueList = new ArrayList<>();

                KeyValueIterator<Windowed<String>, String> storeIterator = kvFeatureDataStore.fetchAll(startTime, endTime);
                while (storeIterator.hasNext()) {
                    KeyValue<Windowed<String>, String> kv = storeIterator.next();

                    //log.debug("[{}] - fetch : {}", kv.key.key(), kv.value);

                    if (kv.key.key().equalsIgnoreCase(strParamRawid)) {
                        doubleValueList.add(kv.value);
                    }
                }

                if (doubleValueList.size() > 0) {
                    log.debug("[{}] - data size : {}", paramKey, doubleValueList.size());

                    // logic 4 - linear regression
                    SimpleRegression regression = new SimpleRegression();
                    for (String val : doubleValueList) {
                        String[] dbl = val.split(","); // (time, value)
                        regression.addData(Long.parseLong(dbl[0]), Double.parseDouble(dbl[1]));
                    }

                    double intercept = regression.getIntercept();
                    double slope = regression.getSlope();
                    //if(Double.isNaN(intercept) || Double.isNaN(slope) || slope <=0) return null;
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

                    // time, eqpRawid, param_rawid, param_health_rawid, status_cd, index
                    String newMsg = endTime + ","
                            + paramMaster.getEquipmentRawId() + ","
                            + paramRawid + ","
                            + fd04HealthInfo.getParamHealthRawId() + ","
                            + statusCode + ","
                            + index + ","
                            + fd04HealthInfo.getHealthLogicRawId();

                    context().forward(partitionKey, newMsg.getBytes());
                    context().commit();
                    log.debug("[{}] - logic 4 health : {}", paramKey, newMsg);

                } else {
                    log.info("[{}] - Unable to calculate RUL...", paramKey);
                }

                // ==========================================================================================
                // Logic 1 health

                // logic 1 - calculate index
                ParameterHealthDataSet fd01HealthInfo = MasterDataCache.getInstance().getParamHealthFD01(paramRawid);

                Double davg = Double.parseDouble(recordColumns[7]);
                double index = davg / paramMaster.getUpperAlarmSpec();

                String statusCode = "N";

                if (index >= 1.0) {
                    statusCode = "A";
                } else if (index >= 0.8 && index < 1) {
                    statusCode = "W";
                }

                // time, eqpRawid, param_rawid, param_health_rawid, status_cd, index
                String newMsg = endTime + ","
                        + paramMaster.getEquipmentRawId() + ","
                        + paramRawid + ","
                        + fd01HealthInfo.getParamHealthRawId() + ","
                        + statusCode + ","
                        + index + ","
                        + fd01HealthInfo.getHealthLogicRawId();

                context().forward(partitionKey, newMsg.getBytes());
                context().commit();
                log.debug("[{}] - logic 1 health : {}", paramKey, newMsg);

            } else {
                log.trace("[{}] - No health info.", paramKey);
            }

            kvFeatureDataStore.put(strParamRawid, endTime + "," + dValue, endTime);

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
