package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 *
 */
public class RealTimeDetectorProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(RealTimeDetectorProcessor.class);

    private final static String SEPARATOR = ",";

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {

        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);

        List<ParameterMasterDataSet> paramData =
                MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

        if (paramData == null) {
            log.debug("[{}] - There are no registered the parameter.", partitionKey);
            return;
        }

        // check end
        if (recordColumns[0].equalsIgnoreCase("kill-them")) {

        }

        String paramKey;
        for (ParameterMasterDataSet param : paramData) {
            paramKey = partitionKey + ":" + param.getParameterRawId();

            ParameterHealthDataSet healthData =
                    MasterDataCache.getInstance().getParamHealthFD01(param.getParameterRawId());

            if (healthData == null) {
                log.debug("[{}] - There are no registered the health spec.", partitionKey);
                continue;
            }

            float paramValue = Float.parseFloat(recordColumns[param.getParamParseIndex()]);

            if ((param.getUpperAlarmSpec() != null && paramValue >= param.getUpperAlarmSpec())
                    || (param.getLowerAlarmSpec() != null && paramValue <= param.getLowerAlarmSpec())) {
                // Alarm
                StringBuilder sb = new StringBuilder();
                sb.append(context().timestamp()).append(",")
                        .append(param.getParameterRawId()).append(",")
                        .append(healthData.getParamHealthRawId()).append(',')
                        .append(paramValue).append(",")
                        .append("A").append(",")
                        .append(healthData.getAlarmCondition());

                //time, param_rawid, health_rawid, vlaue, A/W, condition
                context().forward(partitionKey, sb.toString().getBytes(), "output-fault");
                log.debug("[{}] - ALARM to output-fault.", paramKey);

            } else if ((param.getUpperWarningSpec() != null && paramValue >= param.getUpperWarningSpec())
                    || (param.getLowerWarningSpec() != null && paramValue <= param.getLowerWarningSpec())) {

                // Warning
                StringBuilder sb = new StringBuilder();
                sb.append(context().timestamp()).append(",")
                        .append(param.getParameterRawId()).append(",")
                        .append(healthData.getParamHealthRawId()).append(',')
                        .append(paramValue).append(",")
                        .append("W").append(",")
                        .append(healthData.getWarningCondition());

                context().forward(partitionKey, sb.toString().getBytes(), "output-fault");
                log.debug("[{}] - WARNING to output-fault.", paramKey);
            } else {
                // Normal
                StringBuilder sb = new StringBuilder();
                sb.append(param.getParameterRawId()).append(",")
                        .append(healthData.getParamHealthRawId()).append(',')
                        .append(paramValue).append(",")
                        .append("N").append(",")
                        .append(context().timestamp());

                context().forward(partitionKey, sb.toString().getBytes(), "output-fault");
                log.debug("[{}] - NORMAL to output-fault.", paramKey);
            }
        }
    }
}
