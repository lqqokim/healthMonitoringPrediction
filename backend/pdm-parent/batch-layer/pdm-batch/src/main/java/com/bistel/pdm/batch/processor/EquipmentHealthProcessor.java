package com.bistel.pdm.batch.processor;

import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, health_logic_rawid
        String[] recordColumns = recordValue.split(SEPARATOR);

        try {
            Double dValue = Double.parseDouble(recordColumns[6]);

            if (kvParamHealthStore.get(partitionKey) == null) {
                kvParamHealthStore.put(partitionKey, recordValue);
                kvParamCountStore.put(partitionKey, 1);
            } else {
                String value = kvParamHealthStore.get(partitionKey);
                String[] columns = value.split(SEPARATOR);
                Double v = Double.parseDouble(columns[6]);

                //find max
                if (dValue > v) {
                    kvParamHealthStore.put(partitionKey, recordValue);
                    log.debug("[{}} - param : {}, logic : {}, value : {}",
                            partitionKey, recordColumns[2], recordColumns[7], dValue);
                }

                int cnt = kvParamCountStore.get(partitionKey);
                kvParamCountStore.put(partitionKey, cnt + 1);
            }

            int paramCnt = MasterDataCache.getInstance().getParamCount(partitionKey);
            int cnt = kvParamCountStore.get(partitionKey);
            //log.debug("[{}] - {} : {}", partitionKey, cnt, paramCnt);

            if(cnt >= paramCnt){
                String line = kvParamHealthStore.get(partitionKey);
                context().forward(partitionKey, line.getBytes());
                context().commit();
                log.debug("[{}] - health result : {}", partitionKey, line);

                kvParamCountStore.put(partitionKey, 0);
                kvParamHealthStore.put(partitionKey, null);
            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
