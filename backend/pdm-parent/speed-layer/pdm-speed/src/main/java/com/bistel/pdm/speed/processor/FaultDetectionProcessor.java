package com.bistel.pdm.speed.processor;

import com.bistel.pdm.data.stream.ParameterHealthMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class FaultDetectionProcessor extends AbstractProcessor<String, String> {
    private static final Logger log = LoggerFactory.getLogger(FaultDetectionProcessor.class);
    private final static String SEPARATOR = ",";

    private final static String NEXT_OUT_STREAM_NODE = "output-fault";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String key, String record) {
        // input : time, param_rawid, value, alarm_spec, warning_spec, fault_class, rulename, condition
        String[] columns = record.split(SEPARATOR, -1);

        try {
            Long paramRawId = Long.parseLong(columns[1]);
            Double paramValue = Double.parseDouble(columns[2]);
            Double alarmSpec = Double.parseDouble(columns[3]);
            Double warningSpec = Double.parseDouble(columns[4]);

            // fault detection
            ParameterHealthMaster fd01Health = getParamHealth(key, paramRawId, "FD_OOS");
            if (fd01Health != null && fd01Health.getApplyLogicYN().equalsIgnoreCase("Y")) {

                log.debug("[{}] - id:{} value:{}, alarm:{}, warning:{}", paramRawId, paramValue, alarmSpec, warningSpec);

                if (evaluateAlarm(alarmSpec, paramValue)) {
                    // Alarm
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                    Date parsedDate = dateFormat.parse(columns[0]);
                    Timestamp timestamp = new Timestamp(parsedDate.getTime());

                    // out : time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class, rule, condition
                    String faultMsg = timestamp.getTime() + "," +
                            columns[1] + "," +
                            fd01Health.getParamHealthRawId() + ',' +
                            paramValue + "," +
                            "256" + "," +
                            alarmSpec + "," +
                            warningSpec + "," +
                            columns[5] + "," +
                            columns[6] + "," +
                            columns[7];

                    context().forward(key, faultMsg.getBytes(), To.child(NEXT_OUT_STREAM_NODE));
                    log.info("[{}] - individual fault(alarm) occurred.", key);

                } else if (evaluateWarning(warningSpec, paramValue)) {
                    //warning
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                    Date parsedDate = dateFormat.parse(columns[0]);
                    Timestamp timestamp = new Timestamp(parsedDate.getTime());

                    // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
                    String faultMsg = timestamp.getTime() + "," +
                            columns[1] + "," +
                            fd01Health.getParamHealthRawId() + ',' +
                            paramValue + "," +
                            "128" + "," +
                            alarmSpec + "," +
                            warningSpec + "," +
                            columns[5] + "," +
                            columns[6] + "," +
                            columns[7];

                    context().forward(key, faultMsg.getBytes(), To.child(NEXT_OUT_STREAM_NODE));
                    log.info("[{}] - individual fault(warning) occurred.", key);
                }
            } else {
                log.info("[{}] - No health information registered.", key);
            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private boolean evaluateAlarm(Double upperSpec, Double paramValue) {
        boolean isAlarm = false;
        if ((upperSpec != null && paramValue >= upperSpec)) {

            isAlarm = true;
        }

        return isAlarm;
    }

    private boolean evaluateWarning(Double upperSpec, Double paramValue) {
        boolean isWarning = false;
        if ((upperSpec != null && paramValue >= upperSpec)) {

            isWarning = true;
        }

        return isWarning;
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
