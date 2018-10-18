package com.bistel.pdm.speed.Function;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.data.stream.ParameterHealthMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class RuleBasedDetection {
    private static final Logger log = LoggerFactory.getLogger(RuleBasedDetection.class);

    private int windowSize = 6;
    private int outCount = 3;

    private String outOfSpecMsg = "";
    private String healthMsg = "";

    public synchronized void detect(String partitionKey, String paramKey, Long longTime,
                       ParameterWithSpecMaster paramInfo, List<Double> paramHealthValues,
                       boolean existAlarm, boolean existWarning) throws ExecutionException {

        ParameterHealthMaster fd02Health = getParamHealth(partitionKey, paramInfo.getParameterRawId(), "FD_RULE_1");
        if (fd02Health != null && fd02Health.getApplyLogicYN().equalsIgnoreCase("Y")
                && paramInfo.getUpperAlarmSpec() != null) {

            for (Pair<String, Integer> option : getParamHealthFD02Options(partitionKey, paramInfo.getParameterRawId())) {

                if (option != null) {
                    if (option.getFirst().equalsIgnoreCase("M")) {
                        windowSize = option.getSecond();
                    } else {
                        outCount = option.getSecond();
                    }
                } else {
                    log.debug("[{}] - option does not exist.", paramKey);
                }
            }

            if (existAlarm) {
                List<Double> outHealthIndex = evaluate(paramHealthValues, windowSize, outCount, 1.0F);
                if (outHealthIndex.size() > 0) {
                    outOfSpecMsg = makeOutOfRuleMsg(longTime, paramInfo, fd02Health, outHealthIndex.size(), "256");
                    Double healthScore = calculateHealth(outHealthIndex);
                    healthMsg = makeHealthMsg(longTime, "A", paramInfo, fd02Health, healthScore, outHealthIndex.size());
                }
            } else if (existWarning) {
                List<Double> outWarningValues = evaluate(paramHealthValues, windowSize, outCount, 0.8F);
                if (outWarningValues.size() > 0) {
                    outOfSpecMsg = makeOutOfRuleMsg(longTime, paramInfo, fd02Health, outWarningValues.size(), "128");
                    healthMsg = "";
                }
            } else {
                // Logic 2 health without alarm, warning - If no alarm goes off, calculate the average of the intervals.
                Double healthScore = calculateHealth(paramHealthValues);
                healthMsg = makeHealthMsg(longTime, "N", paramInfo, fd02Health, healthScore, paramHealthValues.size());
                outOfSpecMsg = "";
            }
        } else {
            log.debug("[{}] - Skip the logic 2.", paramKey);
        }
    }

    private List<Double> evaluate(List<Double> paramHealthValues, int windowSize, int outCount, Float upperSpec) {
        ArrayList<Double> outOfSpecValueList = new ArrayList<>();
        List<Double> slidingWindow = new ArrayList<>(windowSize);

        for (int i = 0; i < paramHealthValues.size(); i++) {
            Double healthScore = paramHealthValues.get(i);

            if (slidingWindow.size() == windowSize) {
                //check alarm
                int alarmCount = 0;
                for (Double index : slidingWindow) {
//                    if (dValue >= paramInfo.getUpperAlarmSpec() || dValue <= paramInfo.getLowerAlarmSpec()) {
                    if (index >= upperSpec) {
                        alarmCount++;
                        outOfSpecValueList.add(index);
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
            slidingWindow.add(healthScore);
        }

        return outOfSpecValueList;
    }

    private Double calculateHealth(List<Double> outOfSpecHealthIndexList) {
        // Logic 2 health with alarm
        DescriptiveStatistics stats = new DescriptiveStatistics();
        for (Double val : outOfSpecHealthIndexList) {
            stats.addValue(val);
        }

        return stats.getMean();
    }

    private String makeOutOfRuleMsg(Long longTime, ParameterWithSpecMaster paramInfo,
                                    ParameterHealthMaster healthInfo, int outCount, String alarmTypeCode) {

        // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
        return longTime + "," +
                paramInfo.getParameterRawId() + "," +
                healthInfo.getParamHealthRawId() + ',' +
                outCount + "," +
                alarmTypeCode + "," +
                paramInfo.getUpperAlarmSpec() + "," +
                paramInfo.getUpperWarningSpec() + "," +
                paramInfo.getParameterName() + "," +
                paramInfo.getRuleName() + "," +
                paramInfo.getCondition().replaceAll(",", ";");
    }

    private String makeHealthMsg(Long longTime, String statusCode, ParameterWithSpecMaster paramInfo,
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

    private List<Pair<String, Integer>> getParamHealthFD02Options(String partitionKey, Long paramkey)
            throws ExecutionException {

        List<Pair<String, Integer>> optionList = new ArrayList<>();

        List<ParameterHealthMaster> healthList = MasterCache.Health.get(partitionKey);
        for (ParameterHealthMaster health : healthList) {
            if (health.getParamRawId().equals(paramkey)
                    && health.getHealthCode().equalsIgnoreCase("FD_RULE_1")) {
                optionList.add(new Pair<>(health.getOptionName(), health.getOptionValue()));
            }
        }

        return optionList;
    }

    public String getOutOfSpecMsg() {
        return outOfSpecMsg;
    }

    public String getHealthMsg() {
        return healthMsg;
    }
}
