package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.expression.RuleEvaluator;
import com.bistel.pdm.lambda.kafka.expression.RuleVariables;
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
public class DetectOOSProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectOOSProcessor.class);

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, Integer> kvAlarmStore;
    private KeyValueStore<String, Integer> kvWarningStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);

        //retrieve the key-value store named "persistent-fd01"
        kvAlarmStore = (KeyValueStore) context().getStateStore("persistent-fd01-alarm");
        kvWarningStore = (KeyValueStore) context().getStateStore("persistent-fd01-warning");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {

        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);

        List<ParameterMasterDataSet> paramData =
                MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

        if(paramData == null){
            log.debug("There are no registered the parameter.");
            return;
        }

        if (recordColumns[0].equalsIgnoreCase("kill-them")) {
            //aggregation whether alarm or warning.

            RuleVariables ruleVariables = new RuleVariables();

            String paramKey;
            for (ParameterMasterDataSet param : paramData) {
                paramKey = partitionKey + ":" + param.getParameterRawId();

                ParameterHealthDataSet healthData =
                        MasterDataCache.getInstance().getParamHealthFD01(param.getParameterRawId());

                if(healthData == null){
                    log.debug("There are no registered the health spec.");
                    continue;
                }

                double val = (double) this.kvAlarmStore.get(paramKey);
                log.debug("alarm =[ value : {}, condition : {} ]", val, healthData.getAlarmCondition());

                ruleVariables.putValue("value", val);
                RuleEvaluator ruleEvaluator = new RuleEvaluator(ruleVariables);
                boolean isAlarm = ruleEvaluator.evaluate(healthData.getAlarmCondition()); // will return true

                if (!isAlarm) {

                    // check warning
                    val = (double) this.kvWarningStore.get(paramKey);
                    log.debug("warning =[ value : {}, condition : {} ]", val, healthData.getWarningCondition());

                    ruleVariables.putValue("value", val);
                    ruleEvaluator = new RuleEvaluator(ruleVariables);
                    boolean isWarning = ruleEvaluator.evaluate(healthData.getWarningCondition()); // will return true

                    if (isWarning) {
                        // Warning
                        StringBuilder sb = new StringBuilder();
                        sb.append(param.getParameterRawId()).append(",")
                                .append(healthData.getParamHealthRawId()).append(',')
                                .append(this.kvWarningStore.get(paramKey)).append(",")
                                .append("W").append(",")
                                .append(context().timestamp());

                        context().forward(partitionKey, sb.toString().getBytes(), "output-fault");

                        this.kvWarningStore.delete(paramKey);
                        this.kvAlarmStore.delete(paramKey);

                    } else {
                        // Normal
                        StringBuilder sb = new StringBuilder();
                        sb.append(param.getParameterRawId()).append(",")
                                .append(healthData.getParamHealthRawId()).append(',')
                                .append("0").append(",")
                                .append("N").append(",")
                                .append(context().timestamp());

                        context().forward(partitionKey, sb.toString().getBytes(), "output-fault");

                        this.kvWarningStore.delete(paramKey);
                        this.kvAlarmStore.delete(paramKey);
                    }
                } else {

                    // Alarm
                    StringBuilder sb = new StringBuilder();
                    sb.append(param.getParameterRawId()).append(",")
                            .append(healthData.getParamHealthRawId()).append(',')
                            .append(this.kvAlarmStore.get(paramKey)).append(",")
                            .append("A").append(",")
                            .append(context().timestamp());

                    context().forward(partitionKey, sb.toString().getBytes(), "output-fault");

                    this.kvWarningStore.delete(paramKey);
                    this.kvAlarmStore.delete(paramKey);
                }
            }
            // commit!!
            context().commit();

        } else {

            String paramKey;
            for (ParameterMasterDataSet param : paramData) {

                float paramValue = Float.parseFloat(recordColumns[param.getParamParseIndex()]);

                paramKey = partitionKey + ":" + param.getParameterRawId();

                if (kvAlarmStore.get(paramKey) == null) {
                    kvAlarmStore.put(paramKey, 0);
                }

                if (kvWarningStore.get(paramKey) == null) {
                    kvWarningStore.put(paramKey, 0);
                }

                if (param.getUpperAlarmSpec() != null && paramValue > param.getUpperAlarmSpec()) {
                    int count = kvAlarmStore.get(paramKey);
                    kvAlarmStore.put(paramKey, count + 1);
                } else if (param.getUpperAlarmSpec() != null && paramValue < param.getLowerAlarmSpec()) {
                    int count = kvAlarmStore.get(paramKey);
                    kvAlarmStore.put(paramKey, count + 1);
                } else if (param.getUpperWarningSpec() != null && paramValue > param.getUpperWarningSpec()) {
                    int count = kvWarningStore.get(paramKey);
                    kvWarningStore.put(paramKey, count + 1);
                } else if (param.getLowerWarningSpec() != null && paramValue < param.getLowerWarningSpec()) {
                    int count = kvWarningStore.get(paramKey);
                    kvWarningStore.put(paramKey, count + 1);
                }
            }
        } //end if
    }
}
