package com.bistel.pdm.datastore;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.datastore.jdbc.DBType;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorRawDataDao;
import com.bistel.pdm.datastore.jdbc.dao.SensorTraceDataDao;
import com.bistel.pdm.datastore.jdbc.dao.ora.SensorTraceRawTrxDao;
import com.bistel.pdm.datastore.jdbc.dao.ora.SensorTraceTrxDao;
import com.bistel.pdm.datastore.model.SensorRawData;
import com.bistel.pdm.datastore.model.SensorTraceData;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class TimewaveConsumerRunnable implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(TimewaveConsumerRunnable.class);
    private final KafkaConsumer<String, byte[]> consumer;
    private final String topicName;

    private SensorTraceDataDao trxDao;
    private SensorRawDataDao trxRawDao;

    public TimewaveConsumerRunnable(Properties property, String groupId, String topicName) {
        this.consumer = new KafkaConsumer<>(createConsumerConfig(groupId, property));
        this.topicName = topicName;

        if (DataSource.getDBType() == DBType.oracle) {
            trxRawDao = new SensorTraceRawTrxDao();
            trxDao = new SensorTraceTrxDao();
            log.info("loaded data object of oracle.");
        } else if (DataSource.getDBType() == DBType.postgresql) {
//            trxRawDao = new SensorTraceRawTrxPostgreDao();
//            trxDao = new SensorTraceTrxPostgreDao();
            log.info("loaded data object of postgresql.");
        } else {
            trxRawDao = new SensorTraceRawTrxDao();
            trxDao = new SensorTraceTrxDao();
            log.info("loaded data object of default(oracle).");
        }
    }

    @Override
    public void run() {
        Runtime.getRuntime().addShutdownHook(new Thread(consumer::close));

        consumer.subscribe(Collections.singletonList(topicName));
        log.info("Reading topic: {}, db type: {} ", topicName, DataSource.getDBType());

        while (true) {
            ConsumerRecords<String, byte[]> records = consumer.poll(TimeUnit.SECONDS.toMillis(5));
            if (records.count() <= 0) continue;

            log.debug(" polling {} records", records.count());

            try {
                Map<String, Pair<Long, SensorRawData>> rawRow = new HashMap<>();
                List<Pair<Long, SensorTraceData>> traceRow = new ArrayList<>();

                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] sensorData = record.value();
                    String valueString = new String(sensorData);
                    String[] values = valueString.split(",", -1);

                    /*
                    0 : paramRawid
                    1 : value
                    2 : upper alarm spec
                    3 : upper warning spec
                    4 : target
                    5 : lower alarm spec
                    6 : lower warning spec
                    7 : time
                    8 : frequency count
                    9 : max frequency
                    10 : rpm
                    11 : sampling time
                    12 : frequency binary
                    13 : timewave binary
                    */

                    Long rawId = trxDao.getTraceRawId();

                    log.debug("parsing trace...");
                    parseTrace(traceRow, values, rawId);

                    log.debug("parsing frequency...");
                    parseFrequency(rawRow, values, rawId);

                    if(values[13].length() > 0){
                        log.debug("parsing timewave...");
                        parseTimewave(rawRow, values, rawId);
                    }
                }

                if (traceRow.size() > 0) {
                    trxDao.storeRecord(traceRow);
                    trxRawDao.storeRecord(rawRow);
                    consumer.commitSync();
                    log.info("{} records are committed.", records.count());
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }
    }

    private void parseFrequency(Map<String, Pair<Long, SensorRawData>> rawRow, String[] values, Long rawId) {
        /*
        0 : paramRawid
        1 : value
        2 : upper alarm spec
        3 : upper warning spec
        4 : target
        5 : lower alarm spec
        6 : lower warning spec
        7 : time
        8 : frequency count
        9 : max frequency
        10 : rpm
        11 : sampling time
        12 : frequency binary
        13 : timewave binary
        */

        SensorRawData rawDataFrequency = new SensorRawData();
        rawDataFrequency.setTraceTrxRawid(rawId);
        rawDataFrequency.setParamMstRawid(Long.parseLong(values[0]));

        if (values[2].length() <= 0) {
            rawDataFrequency.setUpperAlarmSpec(null);
        } else {
            rawDataFrequency.setUpperAlarmSpec(Float.parseFloat(values[2]));
        }

        if (values[3].length() <= 0) {
            rawDataFrequency.setUpperWarningSpec(null);
        } else {
            rawDataFrequency.setUpperWarningSpec(Float.parseFloat(values[3]));
        }

        if (values[4].length() <= 0) {
            rawDataFrequency.setTarget(null);
        } else {
            rawDataFrequency.setTarget(Float.parseFloat(values[4]));
        }

        if (values[5].length() <= 0) {
            rawDataFrequency.setLowerAlarmSpec(null);
        } else {
            rawDataFrequency.setLowerAlarmSpec(Float.parseFloat(values[5]));
        }

        if (values[6].length() <= 0) {
            rawDataFrequency.setLowerWarningSpec(null);
        } else {
            rawDataFrequency.setLowerWarningSpec(Float.parseFloat(values[6]));
        }

        rawDataFrequency.setEventDtts(Long.parseLong(values[7]));

        rawDataFrequency.setFreqCount(Integer.parseInt(values[8]));
        rawDataFrequency.setMaxFreq(Double.parseDouble(values[9]));

        rawDataFrequency.setRpm(Float.parseFloat(values[10]));
        rawDataFrequency.setSamplingTime(Float.parseFloat(values[11]));
        rawDataFrequency.setFrequencyData(values[12]);

        //rsd 01~05
        if (values.length > 14) {
            rawDataFrequency.setReservedCol1(values[14]); //location

            if (values.length > 15) {
                rawDataFrequency.setReservedCol2(values[15]);

                if (values.length > 16) {
                    rawDataFrequency.setReservedCol3(values[16]);

                    if (values.length > 17) {
                        rawDataFrequency.setReservedCol4(values[17]);

                        if (values.length > 18) {
                            rawDataFrequency.setReservedCol5(values[18]);
                        }
                    }
                }
            }
        }

        rawRow.put("F," + rawId, new Pair<>(rawId, rawDataFrequency)); //frequency
    }

    private void parseTimewave(Map<String, Pair<Long, SensorRawData>> rawRow, String[] values, Long rawId) {
        /*
        0 : paramRawid
        1 : value
        2 : upper alarm spec
        3 : upper warning spec
        4 : target
        5 : lower alarm spec
        6 : lower warning spec
        7 : time
        8 : frequency count
        9 : max frequency
        10 : rpm
        11 : sampling time
        12 : frequency binary
        13 : timewave binary
        */

        SensorRawData rawDataTimeWave = new SensorRawData();
        rawDataTimeWave.setTraceTrxRawid(rawId);
        rawDataTimeWave.setParamMstRawid(Long.parseLong(values[0]));

        if (values[2].length() <= 0) {
            rawDataTimeWave.setUpperAlarmSpec(null);
        } else {
            rawDataTimeWave.setUpperAlarmSpec(Float.parseFloat(values[2]));
        }

        if (values[3].length() <= 0) {
            rawDataTimeWave.setUpperWarningSpec(null);
        } else {
            rawDataTimeWave.setUpperWarningSpec(Float.parseFloat(values[3]));
        }

        if (values[4].length() <= 0) {
            rawDataTimeWave.setTarget(null);
        } else {
            rawDataTimeWave.setTarget(Float.parseFloat(values[4]));
        }

        if (values[5].length() <= 0) {
            rawDataTimeWave.setLowerAlarmSpec(null);
        } else {
            rawDataTimeWave.setLowerAlarmSpec(Float.parseFloat(values[5]));
        }

        if (values[6].length() <= 0) {
            rawDataTimeWave.setLowerWarningSpec(null);
        } else {
            rawDataTimeWave.setLowerWarningSpec(Float.parseFloat(values[6]));
        }

        rawDataTimeWave.setEventDtts(Long.parseLong(values[7]));

        rawDataTimeWave.setFreqCount(Integer.parseInt(values[8]));
        rawDataTimeWave.setMaxFreq(Double.parseDouble(values[9]));
        rawDataTimeWave.setRpm(Float.parseFloat(values[10]));
        rawDataTimeWave.setSamplingTime(Float.parseFloat(values[11]));
        rawDataTimeWave.setTimewaveData(values[13]);

        //rsd 01~05
        if (values.length > 14) {
            rawDataTimeWave.setReservedCol1(values[14]); //location

            if (values.length > 15) {
                rawDataTimeWave.setReservedCol2(values[15]);

                if (values.length > 16) {
                    rawDataTimeWave.setReservedCol3(values[16]);

                    if (values.length > 17) {
                        rawDataTimeWave.setReservedCol4(values[17]);

                        if (values.length > 18) {
                            rawDataTimeWave.setReservedCol5(values[18]);
                        }
                    }
                }
            }
        }

        rawRow.put("T," + rawId, new Pair<>(rawId, rawDataTimeWave)); //timewave
    }

    private void parseTrace(List<Pair<Long, SensorTraceData>> traceRow, String[] values, Long rawId) {
       /*
        0 : paramRawid
        1 : value
        2 : upper alarm spec
        3 : upper warning spec
        4 : target
        5 : lower alarm spec
        6 : lower warning spec
        7 : time
        8 : frequency count
        9 : max frequency
        10 : rpm
        11 : sampling time
        12 : frequency binary
        13 : timewave binary
        */

        SensorTraceData std = new SensorTraceData();
        std.setRawid(rawId);
        std.setEventDtts(Long.parseLong(values[7]));
        std.setParamMstRawid(Long.parseLong(values[0]));
        std.setValue(Float.parseFloat(values[1]));
        //std.setRpm(Float.parseFloat(values[10]));

        if (values[2].length() <= 0) {
            std.setUpperAlarmSpec(null);
        } else {
            std.setUpperAlarmSpec(Float.parseFloat(values[2]));
        }

        if (values[3].length() <= 0) {
            std.setUpperWarningSpec(null);
        } else {
            std.setUpperWarningSpec(Float.parseFloat(values[3]));
        }

        if (values[4].length() <= 0) {
            std.setTarget(null);
        } else {
            std.setTarget(Float.parseFloat(values[4]));
        }

        if (values[5].length() <= 0) {
            std.setLowerAlarmSpec(null);
        } else {
            std.setLowerAlarmSpec(Float.parseFloat(values[5]));
        }

        if (values[6].length() <= 0) {
            std.setLowerWarningSpec(null);
        } else {
            std.setLowerWarningSpec(Float.parseFloat(values[6]));
        }

        //rsd 01~05
        if (values.length > 14) {
            std.setReservedCol1(values[14]); //location

            if (values.length > 15) {
                std.setReservedCol2(values[15]);

                if (values.length > 16) {
                    std.setReservedCol3(values[16]);

                    if (values.length > 17) {
                        std.setReservedCol4(values[17]);

                        if (values.length > 18) {
                            std.setReservedCol5(values[18]);
                        }
                    }
                }
            }
        }

        traceRow.add(new Pair<>(rawId, std));
    }

    private Properties createConsumerConfig(String groupId, Properties prop) {
        Properties props = new Properties();
        props.put("bootstrap.servers", prop.getProperty("bootstrap.servers"));

        if (groupId.length() <= 0) {
            props.put("group.id", prop.getProperty("group.id"));
        } else {
            props.put("group.id", groupId);
        }

        props.put("auto.commit.enable", prop.getProperty("enable.auto.commit"));
        props.put("auto.offset.reset", prop.getProperty("auto.offset.reset"));
        props.put("key.deserializer", prop.getProperty("key.deserializer"));
        props.put("value.deserializer", prop.getProperty("value.deserializer"));

//        props.put("schema.registry.url", prop.getProperty(""));
//        props.put("specific.avro.reader", prop.getProperty(""));

        return props;
    }
}
