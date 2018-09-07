package com.bistel.pdm.batch.processor;

import com.bistel.pdm.data.stream.ParameterMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

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
        // time, param_name, param_value(rms), freq.value, timewave, freq. count, max freq, rpm, sampling time(sec)
        String[] columns = value.split(SEPARATOR, -1);

        try {
            if (columns[1].equalsIgnoreCase("CMD-CACHE-REFRESH")) {
                refreshMasterCache(partitionKey);
                log.info("all master data of {} is reloaded.", partitionKey);
                context().commit();
                return;
            }

            // filter by master
            if (MasterCache.Equipment.get(partitionKey) == null) {
                log.debug("[{}] - Not existed.", partitionKey);
                context().commit();
                return;
            }

            String paramName = columns[1];

            List<ParameterMaster> parameterMasterDataSets = MasterCache.Parameter.get(partitionKey);
            for (ParameterMaster paramInfo : parameterMasterDataSets) {

                if(paramInfo.getParameterName().equalsIgnoreCase(paramName)){
                    // param_mst_rawid,
                    // value,
                    // upper_alarm_spec, upper_warning_spec, target, lower_alarm_spec, lower_warning_spec,
                    // event_dtts,
                    // freq count,
                    // max freq,
                    // rpm,
                    // sampling time
                    // frequency,
                    // timewave

                    // time, param_name, param_value(rms), freq.value, timewave, freq. count, max freq, rpm, sampling time(sec)
                    String sbValue = String.valueOf(paramInfo.getParameterRawId()) + "," +
                            columns[2] + "," + //value
                            "," + //upper_alarm
                            "," + //upper_warning
                            "," + //target
                            "," + //lower_alarm
                            "," + //lower_warning
                            parseStringToTimestamp(columns[0]) + "," +
                            columns[5] + "," + // freq count
                            columns[6] + "," + // max frequency
                            columns[7] + "," + // rpm
                            columns[8] + "," + // sampling time
                            columns[3] + "," + // frequency blob
                            columns[4];        // timewave blob

                    context().forward(partitionKey, sbValue.getBytes());
                    context().commit();

                    log.debug("[{}-{}] - rawid:{}, parameter:{}, line size:{}",
                            partitionKey, context().partition(),
                            paramInfo.getParameterRawId(),
                            paramInfo.getParameterName(), columns.length);
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

    private void refreshMasterCache(String partitionKey) throws ExecutionException {
        // refresh master info.
        MasterCache.Equipment.refresh(partitionKey);
        MasterCache.ParameterWithSpec.refresh(partitionKey);
    }
}
