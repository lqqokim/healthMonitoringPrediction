package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.PunctuationType;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class EquipmentHealthProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(EquipmentHealthProcessor.class);

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, Integer> kvParamCountStore;
    private KeyValueStore<String, String> kvParamHealthStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext context) {
        super.init(context);

        kvParamCountStore = (KeyValueStore) this.context().getStateStore("batch-param-count");
        kvParamHealthStore = (KeyValueStore) this.context().getStateStore("batch-equipment-health");

        context().schedule(TimeUnit.SECONDS.toMillis(1),
                PunctuationType.STREAM_TIME, l -> {

                    List<String> keyList = new ArrayList<>();
                    KeyValueIterator<String, Integer> vals = kvParamCountStore.all();

                    while (vals.hasNext()) {
                        KeyValue<String, Integer> kv = vals.next();

                        try {

                            int paramCnt = MasterDataCache.getInstance().getParamCount(kv.key);

                            log.debug("[{}] - {} params.", kv.key, paramCnt);

                            if (kv.value >= paramCnt) {
                                keyList.add(kv.key);

                                String line = kvParamHealthStore.get(kv.key);
                                context().forward(kv.key, line.getBytes());
                                context().commit();
                                log.debug("[{}] - health : {}", kv.key, line);
                            }
                        } catch (Exception e){
                            log.error(e.getMessage(), e);
                        }
                    }

                    for (String key : keyList) {
                        kvParamCountStore.put(key, 0);
                    }
                });
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // time, eqpRawid, param_rawid, param_health_rawid, status_cd, index, health_logic_rawid
        String[] recordColumns = recordValue.split(SEPARATOR);

        try {
            Double dValue = Double.parseDouble(recordColumns[5]);

            log.debug("[{}} - param : {}, logic : {}, value : {}",
                    partitionKey, recordColumns[2], recordColumns[6], dValue);

            if (kvParamHealthStore.get(partitionKey) == null) {
                kvParamCountStore.put(partitionKey, 1);
                kvParamHealthStore.put(partitionKey, recordValue);
            } else {
                int cnt = kvParamCountStore.get(partitionKey);
                kvParamCountStore.put(partitionKey, cnt + 1);

                String value = kvParamHealthStore.get(partitionKey);
                String[] columns = value.split(SEPARATOR);
                Double v = Double.parseDouble(columns[5]);

                if (dValue > v) {
                    kvParamHealthStore.put(partitionKey, recordValue);
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
