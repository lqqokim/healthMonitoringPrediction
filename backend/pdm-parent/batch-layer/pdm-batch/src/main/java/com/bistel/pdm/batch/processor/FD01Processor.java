package com.bistel.pdm.batch.processor;

import org.apache.kafka.streams.processor.Processor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class FD01Processor implements Processor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(FD01Processor.class);

    private final static String SEPARATOR = ",";

    private ProcessorContext context;
    private KeyValueStore<String, byte[]> kvStore;


    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        // keep the processor context locally because we need it in punctuate() and commit()
        this.context = processorContext;

        // retrieve the key-value store named "persistent-processing"
        kvStore = (KeyValueStore) context.getStateStore("persistent-processing");
    }

    @Override
    public void process(String partitionKey, byte[] bytes) {
        String value = new String(bytes);
        //param_rawid, value, alarm spec, warning spec, time
        String[] columns = value.split(SEPARATOR, -1);

        if ("".equalsIgnoreCase(columns[0])) {
            double paramValue = Double.parseDouble(columns[1]);


            if (paramValue > 100) {
                //start
                kvStore.put(partitionKey, bytes);

                // check spec for raw data.

                // forward alarm / warning

                // commit the current processing progress
                context.commit();

            } else if (paramValue <= 50) {
                //end


                // do spc rule

                // forward alarm / warning

                // commit the current processing progress
                context.commit();
            }
        }
    }

    @Override
    @Deprecated
    public void punctuate(long l) {
        // this method is deprecated and should not be used anymore
    }

    @Override
    public void close() {
        // close any resources managed by this processor
        // Note: Do not close any StateStores as these are managed by the library
    }
}
