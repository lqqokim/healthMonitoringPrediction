//package com.bistel.pdm.speed.processor;
//
//        import org.apache.kafka.streams.processor.AbstractProcessor;
//        import org.apache.kafka.streams.processor.ProcessorContext;
//        import org.apache.kafka.streams.processor.To;
//        import org.apache.kafka.streams.state.WindowStore;
//        import org.slf4j.Logger;
//        import org.slf4j.LoggerFactory;
//
//        import java.sql.Timestamp;
//        import java.text.SimpleDateFormat;
//        import java.util.Date;
//
//public class TestProcessor extends AbstractProcessor<String, String> {
//    private final static String SEPARATOR = ",";
//
//    private WindowStore<String, Double> kvStore;
//
//    @Override
//    @SuppressWarnings("unchecked")
//    public void init(ProcessorContext processorContext) {
//        super.init(processorContext);
//
//        kvStore = (WindowStore) context().getStateStore("test");
//    }
//
//    @Override
//    public void process(String key, String value) {
//        // value : time, key, value
//        // value : 2018-10-10 22:34:12.311,eqp01,0.324232
//
//        try {
//
//            String[] columns = value.split(SEPARATOR, -1);
//
//            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//            Date parsedDate = dateFormat.parse(columns[0]);
//            Long nowMessageTime = new Timestamp(parsedDate.getTime()).getTime();
//
//            double val = Double.parseDouble(columns[2]);
//
//            kvStore.put(columns[1], val, nowMessageTime); // ** error
//
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//    }
//}
