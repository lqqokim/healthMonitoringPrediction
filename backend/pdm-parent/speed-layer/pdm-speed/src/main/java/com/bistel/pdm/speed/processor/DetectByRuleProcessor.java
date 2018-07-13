package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Windowed;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * RULE 33. 연속적인 M개 중 N개의 값이 UCL 보다 큰 경우
 */
public class DetectByRuleProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectByRuleProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final static String SEPARATOR = ",";

    private WindowStore<String, Double> kvParamValueStore;
    private KeyValueStore<String, Long> kvSummaryIntervalStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvParamValueStore = (WindowStore) context().getStateStore("fd02-value-store");
        kvSummaryIntervalStore = (KeyValueStore) context().getStateStore("summary-interval");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3
        String[] recordColumns = recordValue.split(SEPARATOR);

        List<ParameterMasterDataSet> paramData =
                MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

        if (paramData == null) {
            log.debug("[{}] - There are no registered the parameter.", partitionKey);
            return;
        }

        try {
            String statusCodeAndTime = recordColumns[recordColumns.length - 2];
            String[] nowStatusCodeAndTime = statusCodeAndTime.split(":");

            String prevStatusAndTime = recordColumns[recordColumns.length - 1];
            String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");

            // idle -> run
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("I")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                kvSummaryIntervalStore.put(partitionKey, Long.parseLong(nowStatusCodeAndTime[1]));
            }

            // processing
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")) {
                for (ParameterMasterDataSet param : paramData) {
                    String paramKey = partitionKey + ":" + param.getParameterRawId();

                    Double value = Double.parseDouble(recordColumns[param.getParamParseIndex()]);
                    kvParamValueStore.put(paramKey, value, parseStringToTimestamp(recordColumns[0]));
                }
            }

            // run -> idle
            if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                    && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

                Long startTime = Long.parseLong(nowStatusCodeAndTime[1]);
                if (kvSummaryIntervalStore.get(partitionKey) != null) {
                    startTime = kvSummaryIntervalStore.get(partitionKey);
                }
                Long endTime = Long.parseLong(prevStatusCodeAndTime[1]);


                HashMap<String, List<Double>> paramValueList = new HashMap<>();

                KeyValueIterator<Windowed<String>, Double> storeIterator = kvParamValueStore.fetchAll(startTime, endTime);
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

                for (ParameterMasterDataSet param : paramData) {
                    String paramKey = partitionKey + ":" + param.getParameterRawId();

                    List<Double> doubleValue = paramValueList.get(paramKey);

                    this.evaluateRules(doubleValue);

//                    // time, param_rawid, health_rawid, vlaue, A/W, uas, uws, tgt, las, lws, fault_class
//                    String sb = parseStringToTimestamp(recordColumns[0]) + "," +
//                            param.getParameterRawId() + "," +
//                            healthData.getParamHealthRawId() + ',' +
//                            paramValue + "," +
//                            "256" + "," +
//                            param.getUpperAlarmSpec() + "," +
//                            param.getUpperWarningSpec() + "," +
//                            param.getTarget() + "," +
//                            param.getLowerAlarmSpec() + "," +
//                            param.getLowerWarningSpec() + "," + "Unbalance";

                    log.debug("[{}] - alarm counts : {}, warning counts : {}", partitionKey, 0, 0);
                    context().forward(partitionKey, "".getBytes());
                    context().commit();
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private int evaluateRules(List<Double> values){
        int count = 0;


        return count;
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
