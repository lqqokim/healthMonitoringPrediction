package com.bistel.pdm.datastore;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.datastore.jdbc.DBType;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorRawDataDao;
import com.bistel.pdm.datastore.jdbc.dao.SensorTraceDataDao;
import com.bistel.pdm.datastore.jdbc.dao.ora.SensorTraceRawTrxDao;
import com.bistel.pdm.datastore.jdbc.dao.ora.SensorTraceTrxDao;
import com.bistel.pdm.datastore.jdbc.dao.pg.SensorTraceRawTrxPostgreDao;
import com.bistel.pdm.datastore.jdbc.dao.pg.SensorTraceTrxPostgreDao;
import com.bistel.pdm.datastore.model.SensorRawData;
import com.bistel.pdm.datastore.model.SensorTraceData;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 *
 */
public class TraceRawConsumerRunnable implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(TraceRawConsumerRunnable.class);
    private final KafkaConsumer<String, byte[]> consumer;
    private final String topicName;

    private SensorTraceDataDao trxDao;
    private SensorRawDataDao trxRawDao;

    public TraceRawConsumerRunnable(Properties property, String groupId, String topicName) {
        this.consumer = new KafkaConsumer<>(createConsumerConfig(groupId, property));
        this.topicName = topicName;

        if (DataSource.getDBType() == DBType.oracle) {
            trxRawDao = new SensorTraceRawTrxDao();
            trxDao = new SensorTraceTrxDao();
            log.info("loaded data object of oracle.");
        } else if (DataSource.getDBType() == DBType.postgresql) {
            trxRawDao = new SensorTraceRawTrxPostgreDao();
            trxDao = new SensorTraceTrxPostgreDao();
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
            ConsumerRecords<String, byte[]> records = consumer.poll(10000); //10 sec.
            if (records.count() <= 0) continue;

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
                    2 : alarm spec
                    3 : warning spec
                    4 : time
                    5 : max frequency
                    6 : frequency count
                    7 : rpm
                    8 : sampling time
                    9 : frequency binary
                    10 : timewave binary
                    */

                    Long rawId = trxDao.getTraceRawId();

                    parseTrace(traceRow, values, rawId);

                    parseTimewave(rawRow, values, rawId);

                    parseFrequency(rawRow, values, rawId);
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
            2 : alarm spec
            3 : warning spec
            4 : time
            5 : frequency count
            6 : max frequency
            7 : rpm
            8 : sampling time
            9 : frequency binary
            10 : timewave binary
        */

        SensorRawData rawDataFrequency = new SensorRawData();
        rawDataFrequency.setTraceTrxRawid(rawId);
        rawDataFrequency.setParamMstRawid(Long.parseLong(values[0]));

        if (values[2].length() <= 0) {
            rawDataFrequency.setAlarmSpec(null);
        } else {
            rawDataFrequency.setAlarmSpec(Float.parseFloat(values[2]));
        }

        if (values[3].length() <= 0) {
            rawDataFrequency.setWarningSpec(null);
        } else {
            rawDataFrequency.setWarningSpec(Float.parseFloat(values[3]));
        }
        rawDataFrequency.setEventDtts(Long.parseLong(values[4]));

        rawDataFrequency.setFreqCount(Integer.parseInt(values[5]));
        rawDataFrequency.setMaxFreq(Integer.parseInt(values[6]));
        rawDataFrequency.setRpm(Float.parseFloat(values[7]));
        rawDataFrequency.setSamplingTime(Float.parseFloat(values[8]));
        rawDataFrequency.setFrequencyData(values[9]);

        //rsd 01~05
        if (values.length > 11) {
            rawDataFrequency.setReservedCol1(values[11]); //location

            if (values.length > 12) {
                rawDataFrequency.setReservedCol2(values[12]);

                if (values.length > 13) {
                    rawDataFrequency.setReservedCol3(values[13]);

                    if (values.length > 14) {
                        rawDataFrequency.setReservedCol4(values[14]);

                        if (values.length > 15) {
                            rawDataFrequency.setReservedCol5(values[15]);
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
            2 : alarm spec
            3 : warning spec
            4 : time
            5 : frequency count
            6 : max frequency
            7 : rpm
            8 : sampling time
            9 : frequency binary
            10 : timewave binary
        */

        SensorRawData rawDataTimeWave = new SensorRawData();
        rawDataTimeWave.setTraceTrxRawid(rawId);
        rawDataTimeWave.setParamMstRawid(Long.parseLong(values[0]));

        if (values[2].length() <= 0) {
            rawDataTimeWave.setAlarmSpec(null);
        } else {
            rawDataTimeWave.setAlarmSpec(Float.parseFloat(values[2]));
        }

        if (values[3].length() <= 0) {
            rawDataTimeWave.setWarningSpec(null);
        } else {
            rawDataTimeWave.setWarningSpec(Float.parseFloat(values[3]));
        }
        rawDataTimeWave.setEventDtts(Long.parseLong(values[4]));

        rawDataTimeWave.setFreqCount(Integer.parseInt(values[5]));
        rawDataTimeWave.setMaxFreq(Integer.parseInt(values[6]));
        rawDataTimeWave.setRpm(Float.parseFloat(values[7]));
        rawDataTimeWave.setSamplingTime(Float.parseFloat(values[8]));
        rawDataTimeWave.setTimewaveData(values[10]);

        //rsd 01~05
        if (values.length > 11) {
            rawDataTimeWave.setReservedCol1(values[11]); //location

            if (values.length > 12) {
                rawDataTimeWave.setReservedCol2(values[12]);

                if (values.length > 13) {
                    rawDataTimeWave.setReservedCol3(values[13]);

                    if (values.length > 14) {
                        rawDataTimeWave.setReservedCol4(values[14]);

                        if (values.length > 15) {
                            rawDataTimeWave.setReservedCol5(values[15]);
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
            2 : alarm spec
            3 : warning spec
            4 : time
            5 : frequency count
            6 : max frequency
            7 : rpm
            8 : sampling time
            9 : frequency binary
            10 : timewave binary
        */
        SensorTraceData std = new SensorTraceData();
        std.setRawid(rawId);
        std.setEventDtts(Long.parseLong(values[4]));
        std.setParamMstRawid(Long.parseLong(values[0]));
        std.setValue(Float.parseFloat(values[1]));
        std.setRpm(Float.parseFloat(values[7]));

        if (values[2].length() <= 0) {
            std.setAlarmSpec(null);
        } else {
            std.setAlarmSpec(Float.parseFloat(values[2]));
        }

        if (values[3].length() <= 0) {
            std.setWarningSpec(null);
        } else {
            std.setWarningSpec(Float.parseFloat(values[3]));
        }

        //rsd 01~05
        if (values.length > 11) {
            std.setReservedCol1(values[11]); //location

            if (values.length > 12) {
                std.setReservedCol2(values[12]);

                if (values.length > 13) {
                    std.setReservedCol3(values[13]);

                    if (values.length > 14) {
                        std.setReservedCol4(values[14]);

                        if (values.length > 15) {
                            std.setReservedCol5(values[15]);
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
