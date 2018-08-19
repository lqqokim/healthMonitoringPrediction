package com.bistel.pdm.speed.Function;

import com.bistel.pdm.data.stream.ParameterHealthMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class SPCRuleFunction {
    private static final Logger log = LoggerFactory.getLogger(OutOfSpecFunction.class);

    public static List<Double> evaluateAlarm(ParameterWithSpecMaster paramInfo, List<Double> paramValues,
                                             int windowSize, int outCount) {
        ArrayList<Double> outOfSpecValueList = new ArrayList<>();
        List<Double> slidingWindow = new ArrayList<>(windowSize);

        for (int i = 0; i < paramValues.size(); i++) {
            Double paramValue = paramValues.get(i);

            if (slidingWindow.size() == windowSize) {
                //check alarm
                int alarmCount = 0;
                for (Double dValue : slidingWindow) {
//                    if (dValue >= paramInfo.getUpperAlarmSpec() || dValue <= paramInfo.getLowerAlarmSpec()) {
                    if (dValue >= paramInfo.getUpperAlarmSpec()) {
                        alarmCount++;
                        outOfSpecValueList.add(dValue);
                    }
                }

                if (alarmCount > outCount) {
                    slidingWindow.clear();
                } else {
                    // remove last one
                    slidingWindow.remove(0);
                }
            }
            // add new value
            slidingWindow.add(paramValue);
        }

        return outOfSpecValueList;
    }

    public static List<Double> evaluateWarning(ParameterWithSpecMaster paramInfo, List<Double> paramValues,
                                               int windowSize, int outCount) {
        ArrayList<Double> outOfSpecValueList = new ArrayList<>();
        List<Double> slidingWindow = new ArrayList<>(windowSize);

        for (int i = 0; i < paramValues.size(); i++) {
            Double paramValue = paramValues.get(i);

            if (slidingWindow.size() == windowSize) {
                //check alarm
                int warningCount = 0;
                for (Double dValue : slidingWindow) {
//                    if (dValue >= paramInfo.getUpperWarningSpec() || dValue <= paramInfo.getLowerWarningSpec()) {
                    if (dValue >= paramInfo.getUpperWarningSpec()) {
                        warningCount++;
                        outOfSpecValueList.add(dValue);
                    }
                }

                if (warningCount > outCount) {
                    slidingWindow.clear();
                } else {
                    // remove last one
                    slidingWindow.remove(0);
                }
            }
            // add new value
            slidingWindow.add(paramValue);
        }

        return outOfSpecValueList;
    }

    public static Double calcuateHealth(ParameterWithSpecMaster paramInfo, List<Double> outOfSpecValueList) {
        // Logic 2 health with alarm
        DescriptiveStatistics stats = new DescriptiveStatistics();
        for (Double val : outOfSpecValueList) {
            stats.addValue(val);
        }

        return (stats.getMean() / paramInfo.getUpperAlarmSpec());
    }

    public static String makeOutOfRuleMsg(Long longTime, ParameterWithSpecMaster paramInfo,
                                          ParameterHealthMaster healthInfo, int outCount, String alarmTypeCode) {

        // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
        return longTime + "," +
                paramInfo.getParameterRawId() + "," +
                healthInfo.getParamHealthRawId() + ',' +
                outCount + "," +
                alarmTypeCode + "," +
                paramInfo.getUpperAlarmSpec() + "," +
                paramInfo.getUpperWarningSpec() + "," +
                "N/A";
    }

    public static String makeHealthMsg(Long longTime, String statusCode, ParameterWithSpecMaster paramInfo,
                                       ParameterHealthMaster healthInfo, Double index, int alarmCount) {
        String newMsg = longTime + ","
                + paramInfo.getEquipmentRawId() + ","
                + paramInfo.getParameterRawId() + ","
                + healthInfo.getParamHealthRawId() + ','
                + statusCode + ","
                + alarmCount + ","
                + index + ","
                + (paramInfo.getUpperAlarmSpec() == null ? "" : paramInfo.getUpperAlarmSpec()) + ","
                + (paramInfo.getUpperWarningSpec() == null ? "" : paramInfo.getUpperWarningSpec()) + ","
                + (paramInfo.getTarget() == null ? "" : paramInfo.getTarget()) + ","
                + (paramInfo.getLowerAlarmSpec() == null ? "" : paramInfo.getLowerAlarmSpec()) + ","
                + (paramInfo.getLowerWarningSpec() == null ? "" : paramInfo.getLowerWarningSpec());

        return newMsg;
    }
}
