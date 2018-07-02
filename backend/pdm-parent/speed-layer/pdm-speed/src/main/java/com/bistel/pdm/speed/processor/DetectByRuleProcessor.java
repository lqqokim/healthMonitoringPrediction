package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 *
 */
public class DetectByRuleProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectByRuleProcessor.class);

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, Integer> kvAlarmStore;
    private KeyValueStore<String, Integer> kvWarningStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        //retrieve the key-value store named "persistent-fd01"
        kvAlarmStore = (KeyValueStore) context().getStateStore("persistent-fd02-alarm");
        kvWarningStore = (KeyValueStore) context().getStateStore("persistent-fd02-warning");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // time, area, eqp, p1, p2, p3, p4, ... pn, status:time, prev:time
        String[] recordColumns = recordValue.split(SEPARATOR);

        List<ParameterMasterDataSet> paramData =
                MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

        if (paramData == null) {
            log.debug("[{}] - There are no registered the parameter.", partitionKey);
            return;
        }

        String statusCodeAndTime = recordColumns[recordColumns.length - 2];
        String[] nowStatusCodeAndTime = statusCodeAndTime.split(":");

        String prevStatusAndTime = recordColumns[recordColumns.length - 1];
        String[] prevStatusCodeAndTime = prevStatusAndTime.split(":");

        // start / end
        if (prevStatusCodeAndTime[0].equalsIgnoreCase("I")
                && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {
            // reset
            String paramKey;
            for (ParameterMasterDataSet param : paramData) {
                paramKey = partitionKey + ":" + param.getParameterRawId();
                kvAlarmStore.delete(paramKey);
                kvWarningStore.delete(paramKey);
            }
        }

        if (prevStatusCodeAndTime[0].equalsIgnoreCase("R")
                && !prevStatusCodeAndTime[0].equalsIgnoreCase(nowStatusCodeAndTime[0])) {

            // process end
            String paramKey;
            for (ParameterMasterDataSet param : paramData) {
                paramKey = partitionKey + ":" + param.getParameterRawId();

                int count = kvAlarmStore.get(paramKey);

                if (count > 6) {

                }

                // commit!!
                context().commit();
            }


            log.debug("[{}] - alarm counts : {}, warning counts : {}", partitionKey, 0, 0);
            context().forward(partitionKey, "".getBytes());
            context().commit();
        }
    }
}
