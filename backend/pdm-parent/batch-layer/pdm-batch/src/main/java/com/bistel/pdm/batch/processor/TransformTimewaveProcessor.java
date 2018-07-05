package com.bistel.pdm.batch.processor;

import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 */
public class TransformTimewaveProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(TransformTimewaveProcessor.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    private final static String SEPARATOR = ",";

    @Override
    public void init(ProcessorContext context) {
        super.init(context);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String value = new String(streamByteRecord);
        String[] columns = value.split(SEPARATOR);

        // input message :
        // 0  : 2018-04-27 08:50:00,
        // 1  : fab1,
        // 2  : Demo_Area,
        // 3  : Demo1,
        // 4  : Fan DE1 Acceleration,
        // 5  : 1.342991,
        // 6  : 1.6,
        // 7  : 0.0^0.0^0.0^0.007003599392926243^0.004083909132515738 ...,
        // 8  : 0.07099906503812435^-0.007314464117938635^-0.043057812107598764...,
        // 9 : 1600,
        // 10 : 500,
        // 11 : 0.0

        // param_mst_rawid, value, alarm_spec, warning_spec, event_dtts,
        // frequency, timewave, freq count, max freq, rpm, rsd01~05

        ParameterMasterDataSet param = MasterDataCache.getInstance().getParameter(partitionKey, columns[4]);

        StringBuilder sbValue = new StringBuilder();

        if (param.getUpperAlarmSpec() == null) {
            sbValue.append(param.getParameterRawId()).append(",")
                    .append(columns[5]).append(",") //value
                    .append(",") //alarm
                    .append(",") //warning
                    .append(parseStringToTimestamp(columns[0])).append(",")
                    .append(columns[9]).append(",") // freq count
                    .append(columns[10]).append(",") // max frequency
                    .append(columns[11]).append(",") // rpm
                    .append(columns[6]).append(",") //sampling time
                    .append(columns[7]).append(",") //frequency blob
                    .append(columns[8]); // timewave blob
        } else {
            sbValue.append(param.getParameterRawId()).append(",")
                    .append(columns[5]).append(",") //value
                    .append(param.getUpperAlarmSpec()).append(",") //alarm
                    .append(param.getUpperWarningSpec()).append(",") //warning
                    .append(parseStringToTimestamp(columns[0])).append(",")
                    .append(columns[9]).append(",") // freq count
                    .append(columns[10]).append(",") // max frequency
                    .append(columns[11]).append(",") // rpm
                    .append(columns[6]).append(",") //sampling time
                    .append(columns[7]).append(",") //frequency blob
                    .append(columns[8]); // timewave blob
        }

        //rsd 01~05
        if (columns.length > 12) {
            sbValue.append(columns[12]).append(","); // e.g location

            if (columns.length > 13) {
                sbValue.append(columns[13]).append(",");

                if (columns.length > 14) {
                    sbValue.append(columns[14]).append(",");

                    if (columns.length > 15) {
                        sbValue.append(columns[15]).append(",");

                        if (columns.length > 16) {
                            sbValue.append(columns[16]).append(",");
                        }
                    }
                }
            }
        }

        log.debug("[{}] - param rawid : {}", partitionKey, param.getParameterRawId());
        context().forward(partitionKey, streamByteRecord);
        context().commit();
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