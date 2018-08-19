package com.bistel.pdm.speed.Function;

import com.bistel.pdm.data.stream.ParameterHealthMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 */
public class OutOfSpecFunction {
    private static final Logger log = LoggerFactory.getLogger(OutOfSpecFunction.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    public static boolean evaluateAlarm(ParameterWithSpecMaster param, Double paramValue) {
        boolean isAlarm = false;
        if ((param.getUpperAlarmSpec() != null && paramValue >= param.getUpperAlarmSpec())
                || (param.getLowerAlarmSpec() != null && paramValue <= param.getLowerAlarmSpec())) {

            isAlarm = true;
        }

        return isAlarm;
    }

    public static boolean evaluateWarning(ParameterWithSpecMaster param, Double paramValue) {
        boolean isWarning = false;
        if ((param.getUpperAlarmSpec() != null && paramValue >= param.getUpperAlarmSpec())
                || (param.getLowerAlarmSpec() != null && paramValue <= param.getLowerAlarmSpec())) {

            isWarning = true;
        }

        return isWarning;
    }

    public static String makeOutOfAlarmMsg(String longTime, ParameterWithSpecMaster param,
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
                "N/A";

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


    public static String makeOutOfWarningMsg(String longTime, ParameterWithSpecMaster param,
                                             ParameterHealthMaster healthData, Double paramValue) {

        // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
        String sbMsg = parseStringToTimestamp(longTime) + "," +
                param.getParameterRawId() + "," +
                healthData.getParamHealthRawId() + ',' +
                paramValue + "," +
                "128" + "," +
                param.getUpperAlarmSpec() + "," +
                param.getUpperWarningSpec() + "," +
                "N/A";

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
