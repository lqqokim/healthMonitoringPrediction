package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.EventMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class StatusMarkProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(StatusMarkProcessor.class);

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, String> kvStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        kvStore = (KeyValueStore) this.context().getStateStore("processing-previous");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);

        EventMasterDataSet event = MasterDataCache.getInstance().getEventForProcess(partitionKey);
        float paramValue = Float.parseFloat(recordColumns[event.getParamParseIndex()]);

        String statusCode;
        if (paramValue >= event.getConditionValue()) {
            statusCode = "R";
        } else {
            statusCode = "I";
        }

        // add trace with status code
        // time, area, eqp, p1, p2, p3, p4, ... pn,curr_status:time
        recordValue = recordValue + "," + statusCode + ":" + recordColumns[0];
        context().forward(partitionKey, recordValue.getBytes(), "output-trace");
        context().forward(partitionKey, recordValue.getBytes(), "event-extractor");

        // commit the current processing progress
        context().commit();
    }
}
