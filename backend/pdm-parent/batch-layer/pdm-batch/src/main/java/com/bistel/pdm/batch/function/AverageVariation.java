package com.bistel.pdm.batch.function;

import com.bistel.pdm.data.stream.ParameterHealthMaster;
import com.bistel.pdm.data.stream.ParameterMaster;
import com.bistel.pdm.data.stream.SummarizedFeatureData;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;

public class AverageVariation {
    private static final Logger log = LoggerFactory.getLogger(AverageVariation.class);

    private final ConcurrentHashMap<Long, Double> sumOfValue = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, Integer> countOfValue = new ConcurrentHashMap<>();

    public synchronized String calculate(String partitionKey, String paramKey,
                            String[] record, SummarizedFeatureData feature, Long longTime)
            throws ExecutionException {

        String msg = "";
        Long paramRawid = Long.parseLong(record[2]);

        ParameterMaster paramInfo = getParamMasterById(partitionKey, paramRawid);
        if(paramInfo == null) return msg;

        ParameterHealthMaster fd03Health = getParamHealth(partitionKey, paramRawid, "FD_CHANGE_RATE");
        if (fd03Health != null && fd03Health.getApplyLogicYN().equalsIgnoreCase("Y")) {

            Integer count = Integer.parseInt(record[3]);
            Double dValue = Double.parseDouble(record[7]) * count; //avg * count

            if (sumOfValue.get(paramRawid) == null) {
                sumOfValue.put(paramRawid, dValue);
                countOfValue.put(paramRawid, 1);
            } else {
                Double sumVal = dValue + sumOfValue.get(paramRawid);
                sumOfValue.put(paramRawid, sumVal);
                countOfValue.put(paramRawid, countOfValue.get(paramRawid) + 1);

                Double mean = feature.getMean();
                Double sigma = feature.getSigma();
                Double index = 0D;
                if (mean == null || sigma == null) {
                    log.debug("[{}] - Historical data does not exist.", paramKey);
                } else {
                    //logic 3 - calculate index
                    Double avgSum = sumOfValue.get(paramRawid);
                    int N = countOfValue.get(paramRawid);
                    index = ((avgSum / N) - mean) / sigma;
                }

                String statusCode = "N";

                if (index >= 1) {
                    statusCode = "A";
                } else if (index >= 0.5 && index < 1) {
                    statusCode = "W";
                }

                // time, eqpRawid, param_rawid, param_health_rawid, status_cd, data_count, index, specs
                msg = longTime + ","
                        + paramInfo.getEquipmentRawId() + ","
                        + paramRawid + ","
                        + fd03Health.getParamHealthRawId() + ","
                        + statusCode + ","
                        + count + ","
                        + index + ","
                        + "" + "," // upper alarm spec
                        + "" + "," // upper warning spec
                        + "" + "," // target
                        + "" + "," // lower alarm spec
                        + "";      // lower warning spec

            }
        }

        return msg;
    }

    private ParameterMaster getParamMasterById(String key, Long rawId) throws ExecutionException {
        ParameterMaster param = null;

        List<ParameterMaster> paramList = MasterCache.Parameter.get(key);
        for (ParameterMaster p : paramList) {
            if (p.getParameterRawId().equals(rawId)) {
                param = p;
                break;
            }
        }

        return param;
    }

    private ParameterHealthMaster getParamHealth(String partitionKey, Long paramKey, String code)
            throws ExecutionException {

        ParameterHealthMaster healthData = null;

        List<ParameterHealthMaster> healthList = MasterCache.Health.get(partitionKey);
        for (ParameterHealthMaster health : healthList) {
            if (health.getParamRawId().equals(paramKey) && health.getHealthCode().equalsIgnoreCase(code)) {
                healthData = health;
                break;
            }
        }

        return healthData;
    }

    public void clearMap(){
        sumOfValue.clear();
        countOfValue.clear();
    }
}
