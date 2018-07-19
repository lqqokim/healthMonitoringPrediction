package com.bistel.pdm.batch.processor;

import com.bistel.pdm.batch.util.ServingRequestor;
import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.common.json.SummarizedFeature;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Windowed;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.PunctuationType;
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
public class TrendChangeProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(TrendChangeProcessor.class);

    private final static String SEPARATOR = ",";

    private WindowStore<String, Double> kvFeatureDataStore;

    private final static List<SummarizedFeature> paramFeatureValueList = new ArrayList<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvFeatureDataStore = (WindowStore) this.context().getStateStore("batch-fd03-feature-data");

        context().schedule(TimeUnit.DAYS.toMillis(1),
                PunctuationType.STREAM_TIME, l -> {
                    //call serving
                    Long to = l - TimeUnit.DAYS.toMillis(7);
                    Long from = to - TimeUnit.DAYS.toMillis(90);

                    paramFeatureValueList.clear();
                    String url = "http://192.168.7.230:28000/pdm/api/feature/" + from + "/" + to;
                    paramFeatureValueList.addAll(ServingRequestor.getParamFeatureAvgFor(url));
                });
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

            Double dValue = Double.parseDouble(recordColumns[7]); //avg

            Long endTime = Long.parseLong(recordColumns[1]);
            Long startTime = endTime - TimeUnit.DAYS.toMillis(7);

            kvFeatureDataStore.put(strParamRawid, dValue, endTime);

            ParameterMasterDataSet paramMaster =
                    MasterDataCache.getInstance().getParamMasterDataSetWithRawId(partitionKey, paramRawid);

            ParameterHealthDataSet fd03HealthInfo =
                    MasterDataCache.getInstance().getParamHealthFD03(paramRawid);

            if (fd03HealthInfo != null) {
                log.debug("[{}] - calculate SCR with average ({}). ", partitionKey, dValue);

                // ==========================================================================================
                // Logic 3 health

                List<Double> doubleValueList = new ArrayList<>();

                KeyValueIterator<Windowed<String>, Double> storeIterator = kvFeatureDataStore.fetchAll(startTime, endTime);
                while (storeIterator.hasNext()) {
                    KeyValue<Windowed<String>, Double> kv = storeIterator.next();

                    if (kv.key.key().equalsIgnoreCase(strParamRawid)) {
                        doubleValueList.add(kv.value);
                    }
                }

                if (doubleValueList.size() > 0) {
                    log.debug("[{}] - data size : {}", paramKey, doubleValueList.size());

                    DescriptiveStatistics stats = new DescriptiveStatistics();
                    for (Double val : doubleValueList) {
                        stats.addValue(val);
                    }

                    Double latestMean = stats.getMean();
                    Double mean = null;
                    Double sigma = null;

                    for (SummarizedFeature sf : paramFeatureValueList) {
                        if (sf.getParamRawId().equals(paramRawid)) {
                            mean = sf.getMean();
                            sigma = sf.getSigma();
                            break;
                        }
                    }

                    Double index = 0D;
                    if (mean == null || sigma == null){
                        log.info("[{}] - Historical data does not exist.", paramKey);
                    } else {
                        //logic 3 - calculate index
                        index = (latestMean - mean) / sigma;
                    }

                    log.debug("[{}] - status changes rate : {}", paramKey, index);

                    String statusCode = "N";

                    if (index >= 1) {
                        statusCode = "A";
                    } else if (index >= 0.5 && index < 1) {
                        statusCode = "W";
                    }

                    // time, eqpRawid, param_rawid, param_health_rawid, status_cd, index, health_logic_rawid
                    String newMsg = endTime + ","
                            + paramMaster.getEquipmentRawId() + ","
                            + paramRawid + ","
                            + fd03HealthInfo.getParamHealthRawId() + ","
                            + statusCode + ","
                            + doubleValueList.size() + ","
                            + index + ","
                            + fd03HealthInfo.getHealthLogicRawId();

                    context().forward(partitionKey, newMsg.getBytes());
                    context().commit();
                    log.debug("[{}] - logic 3 health : {}", paramKey, newMsg);

                } else {
                    log.debug("[{}] - Unable to calculate status change rate...", paramKey);
                }
            } else {
                log.trace("[{}] - No health info.", paramKey);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
