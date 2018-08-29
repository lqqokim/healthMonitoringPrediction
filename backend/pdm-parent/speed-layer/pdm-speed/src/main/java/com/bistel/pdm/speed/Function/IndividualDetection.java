package com.bistel.pdm.speed.Function;

import com.bistel.pdm.data.stream.ParameterHealthMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;

public class IndividualDetection {
    private static final Logger log = LoggerFactory.getLogger(IndividualDetection.class);

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final ConcurrentHashMap<String, Integer> alarmCountMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Integer> warningCountMap = new ConcurrentHashMap<>();

    public String detect(String partitionKey, String paramKey,
                              ParameterWithSpecMaster paramInfo, String time, Double paramValue)
            throws ExecutionException {

        String msg = "";

        ParameterHealthMaster fd01Health = getParamHealth(partitionKey, paramInfo.getParameterRawId(), "FD_OOS");
        if (fd01Health != null && fd01Health.getApplyLogicYN().equalsIgnoreCase("Y")) {

            //log.debug("[{}] - value:{}, alarm:{}, warning:{}", partitionKey, paramValue, paramInfo.getUpperAlarmSpec(), paramInfo.getUpperWarningSpec());

            if (evaluateAlarm(paramInfo, paramValue)) {
                // Alarm
                if (alarmCountMap.get(paramKey) == null) {
                    alarmCountMap.put(paramKey, 1);
                } else {
                    int cnt = alarmCountMap.get(paramKey);
                    alarmCountMap.put(paramKey, cnt + 1);
                }

                msg = makeOutOfAlarmMsg(time, paramInfo, fd01Health, paramValue);

            } else if (evaluateWarning(paramInfo, paramValue)) {
                //warning
                if (warningCountMap.get(paramKey) == null) {
                    warningCountMap.put(paramKey, 1);
                } else {
                    int cnt = warningCountMap.get(paramKey);
                    warningCountMap.put(paramKey, cnt + 1);
                }

                msg = makeOutOfWarningMsg(time, paramInfo, fd01Health, paramValue);
            }
        } else {
            log.debug("[{}] - Skip the logic 1.", paramKey);
        }

        return msg;
    }

    public String calculate(String partitionKey, String paramKey, ParameterWithSpecMaster paramInfo,
                            Long longTime, List<Double> paramHealthValues) throws ExecutionException {
        String msg = "";

        ParameterHealthMaster fd01Health = getParamHealth(partitionKey, paramInfo.getParameterRawId(), "FD_OOS");
        if (fd01Health != null && fd01Health.getApplyLogicYN().equalsIgnoreCase("Y")
                && paramInfo.getUpperAlarmSpec() != null) {

            double index;
            int dataCount = 0;
            if (existAlarm(paramKey)) {
                Double sumValue = 0D;
                for (Double dValue : paramHealthValues) {
                    if (dValue >= 1) {
                        sumValue += dValue;
                        dataCount++;
                    }
                }

                index = sumValue / dataCount;

            } else if (existWarning(paramKey)) {
                Double sumValue = 0D;
                for (Double dValue : paramHealthValues) {
                    if (dValue >= 0.8) {
                        sumValue += dValue;
                        dataCount++;
                    }
                }

                index = sumValue / dataCount;

            } else {
                //normal
                Double sumValue = 0D;
                for (Double dValue : paramHealthValues) {
                    sumValue += dValue;
                }

                dataCount = paramHealthValues.size();
                index = sumValue / dataCount;
            }

            String statusCode = "N";

            if (index >= 1.0) {
                statusCode = "A";
            } else if (index >= 0.8 && index < 1) {
                statusCode = "W";
            }

            // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
            // 1535498957495,1,1055,96,N,2,0.1489,30000.0,1.0,,,,1535498957385
            msg = longTime + ","
                    + paramInfo.getEquipmentRawId() + ","
                    + paramInfo.getParameterRawId() + ","
                    + fd01Health.getParamHealthRawId() + ","
                    + statusCode + ","
                    + dataCount + ","
                    + index + ","
                    + (paramInfo.getUpperAlarmSpec() == null ? "" : paramInfo.getUpperAlarmSpec()) + ","
                    + (paramInfo.getUpperWarningSpec() == null ? "" : paramInfo.getUpperWarningSpec()) + ","
                    + (paramInfo.getTarget() == null ? "" : paramInfo.getTarget()) + ","
                    + (paramInfo.getLowerAlarmSpec() == null ? "" : paramInfo.getLowerAlarmSpec()) + ","
                    + (paramInfo.getLowerWarningSpec() == null ? "" : paramInfo.getLowerWarningSpec());
        }

        return msg;
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



    private boolean evaluateAlarm(ParameterWithSpecMaster param, Double paramValue) {
        boolean isAlarm = false;
        if ((param.getUpperAlarmSpec() != null && paramValue >= param.getUpperAlarmSpec())
                || (param.getLowerAlarmSpec() != null && paramValue <= param.getLowerAlarmSpec())) {

            isAlarm = true;
        }

        return isAlarm;
    }

    private boolean evaluateWarning(ParameterWithSpecMaster param, Double paramValue) {
        boolean isWarning = false;
        if ((param.getUpperAlarmSpec() != null && paramValue >= param.getUpperAlarmSpec())
                || (param.getLowerAlarmSpec() != null && paramValue <= param.getLowerAlarmSpec())) {

            isWarning = true;
        }

        return isWarning;
    }

    private String makeOutOfAlarmMsg(String longTime, ParameterWithSpecMaster param,
                                           ParameterHealthMaster healthData, Double paramValue) {

        //log.trace("[{}] : check the out of individual spec. - {}", paramKey, paramValue);

        // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
        String sbMsg = parseStringToTimestamp(longTime) + "," +
                param.getParameterRawId() + "," +
                healthData.getParamHealthRawId() + ',' +
                paramValue + "," +
                "256" + "," +
                param.getUpperAlarmSpec() + "," +
                param.getUpperWarningSpec() + "," +
                "N/A" + "," +
                param.getRuleName() + "," +
                param.getCondition();

        //[{\"param_name\":\"BARCODE\",\"operand\":\"=\",\"param_value\":\"7005\"}]
        return sbMsg;

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
//            String mailText = "" + "\n" +
//                    "- Equipment ID : " + paramKey + "\n" +
//                    "- Time : " + recordColumns[0] + "\n" +
//                    "- Alarm/Warning : Alarm" + "\n" +
//                    "- Parameter Name : " + param.getParameterName() + "\n" +
//                    "- Parameter Value : " + paramValue + "\n" +
//                    "- Parameter Spec : " + param.getUpperAlarmSpec() + "\n" +
//                    "- Fault Classification : Unbalance";
//
//            log.debug("[{}] - send mail");
//            context().forward(partitionKey, mailText.getBytes(), "sendmail");

//            log.debug("[{}] - collecting the raw data.");
//            //context().forward(partitionKey, streamByteRecord, "output-raw");

    }


    private String makeOutOfWarningMsg(String longTime, ParameterWithSpecMaster param,
                                             ParameterHealthMaster healthData, Double paramValue) {

        // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
        String sbMsg = parseStringToTimestamp(longTime) + "," +
                param.getParameterRawId() + "," +
                healthData.getParamHealthRawId() + ',' +
                paramValue + "," +
                "128" + "," +
                param.getUpperAlarmSpec() + "," +
                param.getUpperWarningSpec() + "," +
                "N/A" + "," +
                param.getRuleName() + "," +
                param.getCondition();

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


        return sbMsg;
    }

    private Long parseStringToTimestamp(String item) {
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

    public boolean existAlarm(String paramKey) {
        return alarmCountMap.get(paramKey) != null && alarmCountMap.get(paramKey) > 0;
    }

    public boolean existWarning(String paramKey) {
        return warningCountMap.get(paramKey) != null && warningCountMap.get(paramKey) > 0;
    }

    public void resetAlarmCount(String paramKey){
        alarmCountMap.put(paramKey, 0);
    }

    public void resetWarningCount(String paramKey){
        warningCountMap.put(paramKey, 0);
    }
}
