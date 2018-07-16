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
import java.util.HashMap;
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
            String paramRawid = recordColumns[2];

            log.debug("[{}] - calculate RUL with average. ");
            Double dValue = Double.parseDouble(recordColumns[7]);

            ParameterMasterDataSet paramMaster =
                    MasterDataCache.getInstance().getParamMasterDataSetWithRawId(partitionKey, paramRawid);

            Long endTime = Long.parseLong(recordColumns[1]);
            Long startTime = endTime - TimeUnit.DAYS.toMillis(7);

            HashMap<String, List<String>> paramValueList = new HashMap<>(); // value : (time, value)

            KeyValueIterator<Windowed<String>, String> storeIterator = kvFeatureDataStore.fetchAll(startTime, endTime);
            while (storeIterator.hasNext()) {
                KeyValue<Windowed<String>, String> kv = storeIterator.next();

                if (!paramValueList.containsKey(kv.key.key())) {
                    ArrayList<String> arrValue = new ArrayList<>();
                    arrValue.add(kv.value);
                    paramValueList.put(kv.key.key(), arrValue);
                } else {
                    List<String> arrValue = paramValueList.get(kv.key.key());
                    arrValue.add(kv.value);
                }
            }

            kvFeatureDataStore.put(paramRawid, endTime + "," + dValue, endTime);

            if (paramMaster.getParamParseIndex() <= 0) return;

            String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

            ParameterHealthDataSet fd04HealthInfo =
                    MasterDataCache.getInstance().getParamHealthFD04(paramMaster.getParameterRawId());

            if (fd04HealthInfo == null) {
                log.debug("[{}] - No health info. for parameter : {}.", partitionKey, paramMaster.getParameterName());
                return;
            }

            List<String> doubleValueList = paramValueList.get(paramKey); // (time, value)
            if(doubleValueList == null) {
                log.debug("[{}] - skip first time...", paramKey);
            }
            log.debug("[{}] - data size : {}", paramKey, doubleValueList.size());

            // linear regression
            SimpleRegression regression = new SimpleRegression();
            for (String val : doubleValueList) {
                String[] dbl = val.split(","); // (time, value)
                regression.addData(Long.parseLong(dbl[0]), Double.parseDouble(dbl[1]));
            }

            double intercept = regression.getIntercept();
            double slope = regression.getSlope();
            //if(Double.isNaN(intercept) || Double.isNaN(slope) || slope <=0) return null;
            double x = (paramMaster.getUpperAlarmSpec() - intercept) / slope;
            double index = regression.predict(dValue);

            log.debug("[{}] - intercept : {}, slope : {}, X : {}, prediction : {}", paramKey,
                    intercept, slope, x, index);

            String statusCode = "N";

            if (index < 30) {
                statusCode = "A";
            } else if (index > 30 && index <= 90) {
                statusCode = "W";
            }

            // time, param_rawid, param_health_rawid, status_cd, index
            String newMsg = endTime + ","
                    + paramRawid + ","
                    + fd04HealthInfo.getParamHealthRawId() + ","
                    + statusCode + ","
                    + index;

            context().forward(partitionKey, newMsg.getBytes());
            context().commit();

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
