package com.bistel.pdm.speed.functions;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.KStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
public class OutOfSpecChecker {
    private static final Logger log = LoggerFactory.getLogger(OutOfSpecChecker.class);

    private final static String SEPARATOR = ",";
    private final static int FEATURE_VALUE_IDX = 2;

    public static KStream<String, byte[]> build(final KStream<String, byte[]> streamRecord) {

        return streamRecord.filter((partitionKey, byteValue) -> {
            //values : time, paramRawId, feature, value
            String valueString = new String(byteValue);
            String[] columns = valueString.split(SEPARATOR);

            Long paramRawId = Long.parseLong(columns[1]);
            double featureValue = Double.parseDouble(columns[FEATURE_VALUE_IDX]);

            if (MasterDataCache.getInstance().getAlarmWarningSpec(paramRawId) != null) {
                Pair<Float, Float> spec = MasterDataCache.getInstance().getAlarmWarningSpec(paramRawId);
                return featureValue > spec.getSecond(); //warning
            } else {
                return false;
            }
        }).map((partitionKey, byteValue) -> {
            //values : time, paramRawId, feature, value
            String valueString = new String(byteValue);
            String[] columns = valueString.split(SEPARATOR);

            Long paramRawId = Long.parseLong(columns[1]);
            double featureValue = Double.parseDouble(columns[FEATURE_VALUE_IDX]);

            Pair<Float, Float> spec = MasterDataCache.getInstance().getAlarmWarningSpec(paramRawId);

            String alarmType = "Normal";
            if (featureValue > spec.getFirst()) {
                alarmType = "Alarm";
            } else if (featureValue > spec.getSecond()) {
                alarmType = "Warning";
            }

            StringBuilder sbValue = new StringBuilder();
            sbValue.append(columns[0]).append(",")
                    .append(columns[1]).append(",")
                    .append(columns[2]).append(",")
                    .append(columns[3]).append(",")
                    .append(alarmType).append(",") // alarm type
                    .append(spec.getSecond()).append(",") //warning spec
                    .append(spec.getFirst()); //alarm spec

            return new KeyValue<>(partitionKey, sbValue.toString().getBytes());
        });
    }
}
