package com.bistel.pdm.batch.processor;

import com.bistel.pdm.batch.util.ServingRequestor;
import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.commons.math3.util.Pair;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Windowed;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.PunctuationType;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class TrendChangeProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(TrendChangeProcessor.class);

    private final static String SEPARATOR = ",";

    private WindowStore<String, Double> kvFeatureDataStore;

    private ConcurrentHashMap<String, Pair<Double, Double>> paramFeatureValueList = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvFeatureDataStore = (WindowStore) this.context().getStateStore("batch-fd03-feature-data");

        context().schedule(TimeUnit.DAYS.toMillis(1),
                PunctuationType.STREAM_TIME, l -> {
                    //call serving
                    Long from = context().timestamp() - TimeUnit.DAYS.toMillis(7);
                    Long to = from - TimeUnit.DAYS.toMillis(90);

                    String url = "http://192.168.7.230:28000/feature/" + from + "/" + to;
                    paramFeatureValueList = ServingRequestor.getParamFeatureAvgFor(url);
                });
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);

        try {
            // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3
            String[] recordColumns = recordValue.split(SEPARATOR);
            String paramRawid = recordColumns[2];

            log.debug("[{}] - calculate Status Changes Rate with average. ");
            Double dValue = Double.parseDouble(recordColumns[7]); //avg

            ParameterMasterDataSet paramMaster =
                    MasterDataCache.getInstance().getParamMasterDataSetWithRawId(partitionKey, paramRawid);

            Long endTime = Long.parseLong(recordColumns[1]);
            Long startTime = endTime - TimeUnit.DAYS.toMillis(7);

            kvFeatureDataStore.put(paramRawid, dValue, endTime);

            HashMap<String, List<Double>> paramValueList = new HashMap<>(); // value : (time, value)

            KeyValueIterator<Windowed<String>, Double> storeIterator = kvFeatureDataStore.fetchAll(startTime, endTime);
            while (storeIterator.hasNext()) {
                KeyValue<Windowed<String>, Double> kv = storeIterator.next();

                if (!paramValueList.containsKey(kv.key.key())) {
                    ArrayList<Double> arrValue = new ArrayList<>();
                    arrValue.add(kv.value);
                    paramValueList.put(kv.key.key(), arrValue);
                } else {
                    List<Double> arrValue = paramValueList.get(kv.key.key());
                    arrValue.add(kv.value);
                }
            }


            if (paramMaster.getParamParseIndex() <= 0) return;

            String paramKey = partitionKey + ":" + paramMaster.getParameterRawId();

            ParameterHealthDataSet fd03HealthInfo =
                    MasterDataCache.getInstance().getParamHealthFD03(paramMaster.getParameterRawId());

            if (fd03HealthInfo == null) {
                log.debug("[{}] - No health info. for parameter : {}.", partitionKey, paramMaster.getParameterName());
                return;
            }

            List<Double> doubleValueList = paramValueList.get(paramKey);
            if(doubleValueList == null) {
                log.debug("[{}] - skip first time...", paramKey);
            }
            log.debug("[{}] - data size : {}", paramKey, doubleValueList.size());

            DescriptiveStatistics stats = new DescriptiveStatistics();
            for (Double val : doubleValueList) {
                stats.addValue(val);
            }

            Double latestAvg = stats.getMean();

            Pair<Double, Double> valuePair = paramFeatureValueList.get(paramRawid);

            //calculate index
            Double index = (latestAvg - valuePair.getFirst()) / valuePair.getSecond();

            log.debug("[{}] - status changes rate : {}", paramKey, index);

            String statusCode = "N";

            if (index >= 1) {
                statusCode = "A";
            } else if (index >= 0.5 && index < 1) {
                statusCode = "W";
            }

            // time, param_rawid, param_health_rawid, status_cd, index
            String newMsg = endTime + ","
                    + paramRawid + ","
                    + fd03HealthInfo.getParamHealthRawId() + ","
                    + statusCode + ","
                    + index;

            context().forward(partitionKey, newMsg.getBytes());
            context().commit();

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
