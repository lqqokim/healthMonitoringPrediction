package com.bistel.pdm.batch.processor;

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
        String[] columns = value.split(SEPARATOR, -1);

        // input message :
        // partition key : area,eqp

        // 0      : 2018-04-27 08:50:00,
        // 1(rms) : 1.342991,
        // 2      : 0.0^0.0^0.0^0.007003599392926243^0.004083909132515738 ...,
        // 3(f.c) : 1600,
        // 4(m.f) : 500,
        // 5(rpm) : 0.0
        // 6(s.c) : 1.6
        // 7      : current status
        // 8      : prev. status

        try {
            // filter by master
            if (MasterCache.Equipment.get(partitionKey) == null) {
                log.debug("[{}] - Not existed.", partitionKey);
                context().commit();
                return;
            }

            //
            if (columns[1].equalsIgnoreCase("CMD-CACHE-REFRESH")) {
                refreshMasterCache(partitionKey);
                log.info("all master data of {} is reloaded.", partitionKey);
            } else {

                List<ParameterWithSpecMaster> parameterMasterDataSets = MasterCache.ParameterWithSpec.get(partitionKey);
                for (ParameterWithSpecMaster param : parameterMasterDataSets) {

                    if (param.getParamParseIndex() == -1) continue;

                    // param_mst_rawid, value, upper_alarm_spec, upper_warning_spec,
                    // target, lower_alarm_spec, lower_warning_spec,
                    // event_dtts,
                    // frequency, timewave, freq count, max freq, rpm,
                    // rsd01~05
                    StringBuilder sbValue = new StringBuilder();
                    if (param.getUpperAlarmSpec() == null) {
                        sbValue.append(param.getParameterRawId()).append(",")
                                .append(columns[param.getParamParseIndex()]).append(",") //value
                                .append(",") //upper_alarm
                                .append(",") //upper_warning
                                .append(",") //target
                                .append(",") //lower_alarm
                                .append(",") //lower_warning
                                .append(parseStringToTimestamp(columns[0])).append(",")
                                .append(columns[3]).append(",") // freq count
                                .append(columns[4]).append(",") // max frequency
                                .append(columns[5]).append(",") // rpm
                                .append(columns[6]).append(",") // sampling time
                                .append(columns[2]).append(",") // frequency blob
                                .append(""); // timewave blob
                    } else {
                        sbValue.append(param.getParameterRawId()).append(",")
                                .append(columns[param.getParamParseIndex()]).append(",") //value
                                .append(param.getUpperAlarmSpec()).append(",")   //upper_alarm
                                .append(param.getUpperWarningSpec()).append(",") //upper_warning
                                .append(param.getTarget()).append(",")           //target
                                .append(param.getLowerAlarmSpec()).append(",")   //lower_alarm
                                .append(param.getLowerWarningSpec()).append(",") //lower_warning
                                .append(parseStringToTimestamp(columns[0])).append(",")
                                .append(columns[3]).append(",") // freq count
                                .append(columns[4]).append(",") // max frequency
                                .append(columns[5]).append(",") // rpm
                                .append(columns[6]).append(",") // sampling time
                                .append(columns[2]).append(",") // frequency blob
                                .append(""); // timewave blob
                    }

                    //rsd 01~05
                    if (columns.length > 9) {
                        sbValue.append(columns[9]).append(","); // e.g location

                        if (columns.length > 10) {
                            sbValue.append(columns[10]).append(",");

                            if (columns.length > 11) {
                                sbValue.append(columns[11]).append(",");

                                if (columns.length > 12) {
                                    sbValue.append(columns[12]).append(",");

                                    if (columns.length > 13) {
                                        sbValue.append(columns[13]).append(",");
                                    }
                                }
                            }
                        }
                    }

                    log.debug("[{}] - parameter : {}", partitionKey, param.getParameterName());
                    context().forward(partitionKey, sbValue.toString().getBytes());
                    context().commit();
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
