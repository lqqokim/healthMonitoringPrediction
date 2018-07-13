package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Windowed;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.internals.RecordQueue;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;

/**
 * RULE 33. 연속적인 M개 중 N개의 값이 UCL 보다 큰 경우
 */
public class DetectByRuleProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectByRuleProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final static String SEPARATOR = ",";

    private final int N = 3;
    private final int M = 6;

    private ConcurrentHashMap<String, ArrayBlockingQueue<Double>> ruleWindow;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        ruleWindow = new ConcurrentHashMap<>();
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3
        String[] recordColumns = recordValue.split(SEPARATOR);

        try {
            String paramRawId = recordColumns[2];
            Double featureValue = Double.parseDouble(recordColumns[7]);

            ParameterMasterDataSet param =
                    MasterDataCache.getInstance().getParamMasterDataSetWithRawId(partitionKey, paramRawId);

            ParameterHealthDataSet healthData =
                    MasterDataCache.getInstance().getParamHealthFD01(param.getParameterRawId());

            if(ruleWindow.get(paramRawId) == null){
                ArrayBlockingQueue<Double> val = new ArrayBlockingQueue<>(6);
                val.add(featureValue);
                ruleWindow.put(paramRawId, val);
            } else {
                ArrayBlockingQueue<Double> val = ruleWindow.get(paramRawId);
                val.add(featureValue);
            }

            log.debug("{} - window size : {}", param.getParameterName(), ruleWindow.size());

            if(ruleWindow.size() >= M){
                ArrayBlockingQueue<Double> windowValue = ruleWindow.get(paramRawId);

                Double[] dValue = new Double[windowValue.size()];
                windowValue.toArray(dValue);

                int faultSize = 0;
                for(Double val : dValue){

                    if ((param.getUpperAlarmSpec() != null && val >= param.getUpperAlarmSpec())
                            || (param.getLowerAlarmSpec() != null && val <= param.getLowerAlarmSpec())) {
                        // Alarm
                        faultSize++;
                    }
                }
                windowValue.take();

                if(faultSize > N) {
                    String paramKey = partitionKey + ":" + param.getParameterRawId();

                    // time, param_rawid, health_rawid, vlaue, A/W, uas, uws, tgt, las, lws, fault_class
                    String sb = parseStringToTimestamp(recordColumns[1]) + "," +
                            param.getParameterRawId() + "," +
                            healthData.getParamHealthRawId() + ',' +
                            featureValue + "," +
                            "256" + "," +
                            param.getUpperAlarmSpec() + "," +
                            param.getUpperWarningSpec() + "," +
                            param.getTarget() + "," +
                            param.getLowerAlarmSpec() + "," +
                            param.getLowerWarningSpec() + "," + "Rule";

                    context().forward(partitionKey, sb.getBytes(), "output-fault");
                    context().commit();

                    log.debug("[{}] - WARNING (U:{}, L:{}) - {}", paramKey,
                            param.getUpperWarningSpec(), param.getLowerWarningSpec(), featureValue);
                }
            }
        } catch (Exception e){
            log.error(e.getMessage(), e);
        }
    }

    private static Long parseStringToTimestamp(String item) {
        Long time = 0L;

        try {
            Date parsedDate = dateFormat.parse(item);
            Timestamp timestamp = new Timestamp(parsedDate.getTime());
            time = timestamp.getTime();
        } catch (Exception e) {
            log.error(e.getMessage() + " : " + item, e);
        }

        return time;
    }
}
