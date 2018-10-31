package com.bistel.pdm.speed.processor;

import com.bistel.pdm.data.stream.ParameterHealthMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class IndividualHealthProcessor extends AbstractProcessor<String, String> {
    private static final Logger log = LoggerFactory.getLogger(IndividualHealthProcessor.class);
    private final static String SEPARATOR = ",";

    private final static String NEXT_OUT_STREAM_NODE = "output-health";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String key, String record) {
        // time, param_rawid, value, alarm_spec, warning_spec, fault_class, rulename, condition
        String[] columns = record.split(SEPARATOR, -1);

        try {
            Long paramRawId = Long.parseLong(columns[1]);
            Double alarmSpec = Double.parseDouble(columns[3]);
            Double warningSpec = Double.parseDouble(columns[4]);

            String[] strValue = columns[2].split("^");
            double[] doubleValues = Arrays.stream(strValue)
                    .mapToDouble(Double::parseDouble)
                    .toArray();

            ParameterHealthMaster fd01Health = getParamHealth(key, paramRawId, "FD_OOS");
            if (fd01Health != null && fd01Health.getApplyLogicYN().equalsIgnoreCase("Y")) {

                double index;
                int dataCount = 0;

                //check alarm
                Double sumValue = 0D;
                for (Double dValue : doubleValues) {
                    if (dValue >= 1) {
                        sumValue += dValue;
                        dataCount++;
                    }
                }

                //check warning
                if(dataCount <= 0){
                    sumValue = 0D;
                    for (Double dValue : doubleValues) {
                        if (dValue >= 0.8) {
                            sumValue += dValue;
                            dataCount++;
                        }
                    }
                }

                if(dataCount <= 0){
                    //normal
                    sumValue = 0D;
                    for (Double dValue : doubleValues) {
                        sumValue += dValue;
                    }

                    dataCount = doubleValues.length;
                    index = sumValue / dataCount;
                } else {
                    index = sumValue / dataCount;
                }

                String statusCode = "N";

                if (index >= 1.0) {
                    statusCode = "A";
                } else if (index >= 0.8 && index < 1) {
                    statusCode = "W";
                }

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                Date parsedDate = dateFormat.parse(columns[0]);
                Timestamp timestamp = new Timestamp(parsedDate.getTime());

                // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
                // 1535498957495,1,1055,96,N,2,0.1489,30000.0,1.0,,,,1535498957385
                String nextMsg = timestamp.getTime() + ","
                        + paramRawId + ","
                        + fd01Health.getParamHealthRawId() + ","
                        + statusCode + ","
                        + dataCount + ","
                        + index + ","
                        + alarmSpec + ","
                        + warningSpec + ","
                        + "" + ","
                        + "" + ","
                        + "";

                context().forward(key, nextMsg.getBytes(), To.child(NEXT_OUT_STREAM_NODE));

            } else {
                log.debug("[{}] - No health.", key);
            }
        } catch (Exception e){
            log.error(e.getMessage(), e);
        }

        //transaction commit.
        context().commit();
    }

    private ParameterHealthMaster getParamHealth(String partitionKey, Long paramkey, String code)
            throws ExecutionException {
        ParameterHealthMaster healthData = null;

        List<ParameterHealthMaster> healthList = MasterCache.Health.get(partitionKey);
        for (ParameterHealthMaster health : healthList) {
            if (health.getParamRawId().equals(paramkey) && health.getHealthCode().equalsIgnoreCase(code)) {
                healthData = health;
                break;
            }
        }

        return healthData;
    }
}
