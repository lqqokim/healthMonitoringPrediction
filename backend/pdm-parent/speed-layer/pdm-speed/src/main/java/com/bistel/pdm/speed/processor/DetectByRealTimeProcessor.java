package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.json.MailConfigDataSet;
import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.Email;
import org.apache.commons.mail.SimpleEmail;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 *
 */
public class DetectByRealTimeProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(DetectByRealTimeProcessor.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final static String SEPARATOR = ",";

    private KeyValueStore<String, Long> kvAlarmTimeStore;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
        kvAlarmTimeStore = (KeyValueStore) this.context().getStateStore("alarm-time-context");
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        // time, p1, p2, p3, p4, ... pn, status:time, prev:time
        String[] recordColumns = recordValue.split(SEPARATOR);

        List<ParameterMasterDataSet> paramData =
                MasterDataCache.getInstance().getParamMasterDataSet().get(partitionKey);

        if (paramData == null) {
            log.debug("[{}] - There are no registered the parameter.", partitionKey);
            return;
        }

        try {
            //------
            for (ParameterMasterDataSet param : paramData) {

                if (param.getParamParseIndex() == -1) continue;

                String paramKey = partitionKey + ":" + param.getParameterRawId();

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

                    long diffSeconds = 60;

                    if (kvAlarmTimeStore.get(paramKey) == null) {
                        kvAlarmTimeStore.put(paramKey, System.currentTimeMillis());
                    } else {
                        Long prevTime = kvAlarmTimeStore.get(paramKey);
                        long diff = System.currentTimeMillis() - prevTime;
                        diffSeconds = diff / 1000;
                    }

                    if (diffSeconds >= 60) {
                        kvAlarmTimeStore.put(paramKey, System.currentTimeMillis());

                        // time, param_rawid, health_rawid, vlaue, A/W, uas, uws, tgt, las, lws, fault_class
                        String sb = parseStringToTimestamp(recordColumns[0]) + "," +
                                param.getParameterRawId() + "," +
                                healthData.getParamHealthRawId() + ',' +
                                paramValue + "," +
                                "256" + "," +
                                param.getUpperAlarmSpec() + "," +
                                param.getUpperWarningSpec() + "," +
                                param.getTarget() + "," +
                                param.getLowerAlarmSpec() + "," +
                                param.getLowerWarningSpec() + "," + "Unbalance";

                        // to do : fault classifications

                        context().forward(partitionKey, sb.getBytes(), "output-fault");

                        //send mail
                        /*
                            - Equipment ID: EQP01
                            - Time: 2018.07.06 15:00:01
                            - Alarm/Warning: Alarm
                            - Parameter Name: Vibration
                            - Parameter Value: 0.51
                            - Parameter Spec: 0.40
                            - Fault Classification : Unbalance
                         */
                        String mailText = "" + "\n" +
                                "- Equipment ID : " + paramKey + "\n" +
                                "- Time : " + recordColumns[0] + "\n" +
                                "- Alarm/Warning : Alarm" + "\n" +
                                "- Parameter Name : " + param.getParameterName() + "\n" +
                                "- Parameter Value : " + paramValue + "\n" +
                                "- Parameter Spec : " + param.getUpperAlarmSpec() + "\n" +
                                "- Fault Classification : Unbalance";

                        context().forward(partitionKey, mailText.getBytes(), "sendmail");

                        log.debug("collecting the raw data because of OOC.");
                        context().forward(partitionKey, streamByteRecord, "output-raw");

                        context().commit();
                        log.debug("[{}] - ALARM (U:{}, L:{}) - {}", paramKey,
                                param.getUpperAlarmSpec(), param.getLowerAlarmSpec(), paramValue);
                    }

                } else if ((param.getUpperWarningSpec() != null && paramValue >= param.getUpperWarningSpec())
                        || (param.getLowerWarningSpec() != null && paramValue <= param.getLowerWarningSpec())) {

                    // Warning
                    // time, param_rawid, health_rawid, vlaue, A/W, uas, uws, tgt, las, lws, fault_class
                    String sb = parseStringToTimestamp(recordColumns[0]) + "," +
                            param.getParameterRawId() + "," +
                            healthData.getParamHealthRawId() + ',' +
                            paramValue + "," +
                            "128" + "," +
                            param.getUpperAlarmSpec() + "," +
                            param.getUpperWarningSpec() + "," +
                            param.getTarget() + "," +
                            param.getLowerAlarmSpec() + "," +
                            param.getLowerWarningSpec() + "," + "N/A";

//                    String mailText = "" + "\n" +
//                            "- Equipment ID : " + paramKey + "\n" +
//                            "- Time : " + recordColumns[0] + "\n" +
//                            "- Alarm/Warning : Warning" + "\n" +
//                            "- Parameter Name : " + param.getParameterName() + "\n" +
//                            "- Parameter Value : " + paramValue + "\n" +
//                            "- Parameter Spec : " + param.getUpperAlarmSpec() + "\n" +
//                            "- Fault Classification : Unbalance";
//
//                    context().forward(partitionKey, mailText.getBytes(), "sendmail");

                    context().forward(partitionKey, sb.getBytes(), "output-fault");

                    context().commit();
                    log.debug("[{}] - WARNING (U:{}, L:{}) - {}", paramKey,
                            param.getUpperWarningSpec(), param.getLowerWarningSpec(), paramValue);

                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private static Long parseStringToTimestamp(String item) {
        Long time = 0L;

        try {
            Date parsedDate = dateFormat.parse(item);
            Timestamp timestamp = new Timestamp(parsedDate.getTime());
            time = timestamp.getTime();
        } catch (Exception e) {
            log.error(e.getMessage() + " : " + item, e);
        }

        return time;
    }
}
