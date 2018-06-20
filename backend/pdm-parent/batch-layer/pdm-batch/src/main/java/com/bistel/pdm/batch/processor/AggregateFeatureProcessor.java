//package com.bistel.pdm.batch.processor;
//
//import org.apache.kafka.streams.KeyValue;
//import org.apache.kafka.streams.processor.Processor;
//import org.apache.kafka.streams.processor.ProcessorContext;
//import org.apache.kafka.streams.processor.PunctuationType;
//import org.apache.kafka.streams.state.KeyValueIterator;
//import org.apache.kafka.streams.state.KeyValueStore;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
///**
// *
// */
//public class AggregateFeatureProcessor implements Processor<String, byte[]> {
//    private static final Logger log = LoggerFactory.getLogger(AggregateFeatureProcessor.class);
//
//    private final static String SEPARATOR = ",";
//
//    private ProcessorContext context;
//    private KeyValueStore<String, byte[]> kvStore;
//
//    @Override
//    @SuppressWarnings("unchecked")
//    public void init(ProcessorContext processorContext) {
//        // keep the processor context locally because we need it in punctuate() and commit()
//        this.context = processorContext;
//
//        // retrieve the key-value store named "persistent-processing"
//        kvStore = (KeyValueStore) context.getStateStore("persistent-processing");
//
//        // schedule a punctuate() method every 1000 milliseconds based on stream-time
//        this.context.schedule(1000, PunctuationType.STREAM_TIME, (timestamp) -> {
//            KeyValueIterator<String, byte[]> iter = this.kvStore.all();
//            while (iter.hasNext()) {
//                KeyValue<String, byte[]> entry = iter.next();
//                //context.forward(entry.key, entry.value);
//            }
//            iter.close();
//
//
//            StringBuilder sb = new StringBuilder();
//            sb.append("count,sum,min,max,avg,median,stddev");
//
//            context.forward("", sb.toString().getBytes());
//            // commit the current processing progress
//            context.commit();
//        });
//    }
//
//    @Override
//    public void process(String s, byte[] bytes) {
//
//    }
//
//    @Override
//    @Deprecated
//    public void punctuate(long l) {
//        // this method is deprecated and should not be used anymore
//    }
//
//    @Override
//    public void close() {
//        // close any resources managed by this processor
//        // Note: Do not close any StateStores as these are managed by the library
//    }
//}
