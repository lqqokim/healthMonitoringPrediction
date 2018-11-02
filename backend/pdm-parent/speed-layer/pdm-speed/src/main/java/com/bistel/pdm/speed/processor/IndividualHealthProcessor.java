package com.bistel.pdm.speed.processor;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.data.stream.ParameterHealthMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.To;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;

public class IndividualHealthProcessor extends AbstractProcessor<String, String> {
    private static final Logger log = LoggerFactory.getLogger(IndividualHealthProcessor.class);
    private final static String SEPARATOR = ",";

    private final static String NEXT_OUT_STREAM_NODE = "output-health";

    private final ConcurrentHashMap<String, Boolean> AlarmExistence = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Boolean> WarningExistence = new ConcurrentHashMap<>();

    @Override
    @SuppressWarnings("unchecked")
    public void init(ProcessorContext processorContext) {
        super.init(processorContext);
    }

    @Override
    public void process(String key, String record) {
        //in : time, param_rawid, value, alarm_spec, warning_spec, fault_class, rulename, condition, groupid
        String[] columns = record.split(SEPARATOR, -1);

        try {
            Long paramRawId = Long.parseLong(columns[1]);
            Double alarmSpec = Double.parseDouble(columns[3]);
            Double warningSpec = Double.parseDouble(columns[4]);

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
            Date parsedDate = dateFormat.parse(columns[0]);
            Timestamp timestamp = new Timestamp(parsedDate.getTime());

            String[] strValue = columns[2].split("^");
            double[] doubleValues = Arrays.stream(strValue)
                    .mapToDouble(Double::parseDouble)
                    .toArray();

            AlarmExistence.put(key, false);
            WarningExistence.put(key, false);

            ParameterHealthMaster fd01Health = getParamHealth(key, paramRawId, "FD_OOS");
            if (fd01Health != null && fd01Health.getApplyLogicYN().equalsIgnoreCase("Y")) {

                String nextMsg = getHealthString(key, timestamp.getTime(), paramRawId,
                        alarmSpec, warningSpec, doubleValues, fd01Health);

                context().forward(key, nextMsg.getBytes(), To.child(NEXT_OUT_STREAM_NODE));

            } else {
                log.debug("[{}] - There is no health information.", key);
            }


            // Health for SPC Rule

            int windowSize = 6;
            int outCount = 3;

            ParameterHealthMaster fd02Health = getParamHealth(key, paramRawId, "FD_RULE_1");
            if (fd02Health != null && fd02Health.getApplyLogicYN().equalsIgnoreCase("Y")) {

                for (Pair<String, Integer> option : getParamHealthFD02Options(key, paramRawId)) {
                    if (option != null) {
                        if (option.getFirst().equalsIgnoreCase("M")) {
                            windowSize = option.getSecond();
                        } else {
                            outCount = option.getSecond();
                        }
                    } else {
                        log.debug("[{}] - option does not exist.", key);
                    }
                }

//                String faultMsg = "";
                String healthMsg;

                if (AlarmExistence.get(key)) {
                    List<Double> outHealthIndex = evaluate(doubleValues, windowSize, outCount, 1.0F);
                    if (outHealthIndex.size() > 0) {

//                        Double sumValue = 0D;
//                        for (Double dValue : outHealthIndex) {
//                            sumValue += dValue;
//                        }
//                        Double index = sumValue / outHealthIndex.size();
//
//                        // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
//                        faultMsg = timestamp.getTime() + "," +
//                                paramRawId + "," +
//                                fd02Health.getParamHealthRawId() + ',' +
//                                index + "," +
//                                "256" + "," +
//                                alarmSpec + "," +
//                                warningSpec + "," +
//                                fd02Health.getParameterName() + "," +
//                                columns[6] + "," +
//                                columns[7];

                        // logic 2 health
                        Double healthScore = calculateHealth(outHealthIndex);

                        healthMsg = timestamp.getTime() + ","
                                + paramRawId + ","
                                + fd02Health.getParamHealthRawId() + ','
                                + "A" + ","
                                + outHealthIndex.size() + ","
                                + healthScore + ","
                                + alarmSpec + ","
                                + warningSpec + ","
                                + "" + ","
                                + "" + ","
                                + "";

                    } else {
                        Double healthScore = calculateHealth(doubleValues);

                        healthMsg = timestamp.getTime() + ","
                                + paramRawId + ","
                                + fd02Health.getParamHealthRawId() + ','
                                + "N" + ","
                                + 0 + ","
                                + healthScore + ","
                                + alarmSpec + ","
                                + warningSpec + ","
                                + "" + ","
                                + "" + ","
                                + "";
                    }
                } else if (WarningExistence.get(key)) {
                    List<Double> outWarningValues = evaluate(doubleValues, windowSize, outCount, 0.8F);
                    if (outWarningValues.size() > 0) {

//                        Double sumValue = 0D;
//                        for (Double dValue : outWarningValues) {
//                            sumValue += dValue;
//                        }
//                        Double index = sumValue / outWarningValues.size();
//
//                        // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class
//                        faultMsg = timestamp.getTime() + "," +
//                                paramRawId + "," +
//                                fd02Health.getParamHealthRawId() + ',' +
//                                index + "," +
//                                "128" + "," +
//                                alarmSpec + "," +
//                                warningSpec + "," +
//                                fd02Health.getParameterName() + "," +
//                                columns[6] + "," +
//                                columns[7];

                        // logic 2 health
                        Double healthScore = calculateHealth(outWarningValues);

                        healthMsg = timestamp.getTime() + ","
                                + paramRawId + ","
                                + fd02Health.getParamHealthRawId() + ','
                                + "A" + ","
                                + outWarningValues.size() + ","
                                + healthScore + ","
                                + alarmSpec + ","
                                + warningSpec + ","
                                + "" + ","
                                + "" + ","
                                + "";

                    } else {
                        Double healthScore = calculateHealth(doubleValues);

                        healthMsg = timestamp.getTime() + ","
                                + paramRawId + ","
                                + fd02Health.getParamHealthRawId() + ','
                                + "N" + ","
                                + 0 + ","
                                + healthScore + ","
                                + alarmSpec + ","
                                + warningSpec + ","
                                + "" + ","
                                + "" + ","
                                + "";
                    }
                } else {
                    // Logic 2 health without alarm, warning - If no alarm goes off, calculate the average of the intervals.
                    Double healthScore = calculateHealth(doubleValues);

                    healthMsg = timestamp.getTime() + ","
                            + paramRawId + ","
                            + fd02Health.getParamHealthRawId() + ','
                            + "N" + ","
                            + 0 + ","
                            + healthScore + ","
                            + alarmSpec + ","
                            + warningSpec + ","
                            + "" + ","
                            + "" + ","
                            + "";
                }


                if (healthMsg.length() > 0) {
                    healthMsg = healthMsg + "," + columns[8]; // with group
                    context().forward(key, healthMsg.getBytes(), To.child("output-health"));
                    log.debug("[{}] - logic 2 health : {}", key, healthMsg);
                }

//                if (faultMsg.length() > 0) {
//                    context().forward(key, faultMsg.getBytes(), To.child("output-fault"));
//                    log.debug("[{}] - rule fault occurred.", key);
//                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private String getHealthString(String key, Long epochTime, Long paramRawId, Double alarmSpec,
                                   Double warningSpec, double[] doubleValues,
                                   ParameterHealthMaster fd01Health) {
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

        if (dataCount > 0) {
            AlarmExistence.put(key, true);
        }

        //check warning
        if (dataCount <= 0) {
            sumValue = 0D;
            for (Double dValue : doubleValues) {
                if (dValue >= 0.8) {
                    sumValue += dValue;
                    dataCount++;
                }
            }
        }

        if (dataCount > 0) {
            WarningExistence.put(key, true);
        }

        if (dataCount <= 0) {
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

        log.debug("[{}] - id:{}, data count:{}, score:{}, alarm:{}, warning:{}",
                key, dataCount, index, alarmSpec, warningSpec);

        // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
        // 1535498957495,1,1055,96,N,2,0.1489,30000.0,1.0,,,,1535498957385
        return epochTime + ","
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
    }

    private Double calculateHealth(List<Double> outOfSpecHealthIndexList) {
        // Logic 2 health with alarm
        DescriptiveStatistics stats = new DescriptiveStatistics();
        for (Double val : outOfSpecHealthIndexList) {
            stats.addValue(val);
        }

        return stats.getMean();
    }

    private Double calculateHealth(double[] outOfSpecHealthIndexList) {
        // Logic 2 health with alarm
        DescriptiveStatistics stats = new DescriptiveStatistics();
        for (Double val : outOfSpecHealthIndexList) {
            stats.addValue(val);
        }

        return stats.getMean();
    }

    private List<Double> evaluate(double[] paramHealthValues, int windowSize, int outCount, Float upperSpec) {
        ArrayList<Double> outOfSpecValueList = new ArrayList<>();
        List<Double> slidingWindow = new ArrayList<>(windowSize);

        for (double healthScore : paramHealthValues) {
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
}
