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
public class DetectByRealTimeProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectByRealTimeProcessor.class);

    private final static String SEPARATOR = ",";

    @Override
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
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

        //------

        String paramKey;
        for (ParameterMasterDataSet param : paramData) {
            paramKey = partitionKey + ":" + param.getParameterRawId();

            ParameterHealthDataSet healthData =
                    MasterDataCache.getInstance().getParamHealthFD01(param.getParameterRawId());

            if (healthData == null) {
                log.debug("[{}] - No health info. for parameter : {}.", partitionKey, param.getParameterName());
                continue;
            }

            float paramValue = Float.parseFloat(recordColumns[param.getParamParseIndex()]);

            if ((param.getUpperAlarmSpec() != null && paramValue >= param.getUpperAlarmSpec())
                    || (param.getLowerAlarmSpec() != null && paramValue <= param.getLowerAlarmSpec())) {
                // Alarm
                //time, param_rawid, health_rawid, vlaue, A/W, condition
                String sb = String.valueOf(context().timestamp()) + "," +
                        param.getParameterRawId() + "," +
                        healthData.getParamHealthRawId() + ',' +
                        paramValue + "," +
                        "A";

                context().forward(partitionKey, sb.getBytes());
                context().commit();
                log.debug("[{}] - ALARM (U:{}, L:{}) - {}", paramKey,
                        param.getUpperAlarmSpec(), param.getLowerAlarmSpec(), paramValue);

            } else if ((param.getUpperWarningSpec() != null && paramValue >= param.getUpperWarningSpec())
                    || (param.getLowerWarningSpec() != null && paramValue <= param.getLowerWarningSpec())) {

                // Warning
                //time, param_rawid, health_rawid, vlaue, A/W, condition
                String sb = String.valueOf(context().timestamp()) + "," +
                        param.getParameterRawId() + "," +
                        healthData.getParamHealthRawId() + ',' +
                        paramValue + "," +
                        "W";

                context().forward(partitionKey, sb.getBytes());
                context().commit();
                log.debug("[{}] - WARNING (U:{}, L:{}) - {}", paramKey,
                        param.getUpperWarningSpec(), param.getLowerWarningSpec(), paramValue);

            }
        }
    }
}
