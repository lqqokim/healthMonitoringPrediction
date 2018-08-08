package com.bistel.pdm.datastore.jdbc.dao.pg;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorTraceDataDao;
import com.bistel.pdm.datastore.model.SensorTraceData;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 *
 */
public class TraceTrxPostgreDao implements SensorTraceDataDao {
    private static final Logger log = LoggerFactory.getLogger(TraceTrxPostgreDao.class);

    private static final String TRX_SEQ_SQL = "select nextval from nextval('seq_trace_trx_pdm')";

    private static final String INSERT_SQL =
            "insert into trace_trx_pdm (PARAM_MST_RAWID, VALUE, RPM, ALARM_SPEC, " +
                    "WARNING_SPEC, STATUS_CD, EVENT_DTTS, RESERVED_COL1, RESERVED_COL2, " +
                    "RESERVED_COL3, RESERVED_COL4, RESERVED_COL5) " +
                    "values (?,?,?,?,?,?,?,?,?,?,?,?)";

    private static final String INSERT_SQL_WITH_RAW =
            "insert into trace_trx_pdm (RAWID, PARAM_MST_RAWID, VALUE, RPM, ALARM_SPEC, " +
                    "WARNING_SPEC, STATUS_CD, EVENT_DTTS, RESERVED_COL1, RESERVED_COL2, " +
                    "RESERVED_COL3, RESERVED_COL4, RESERVED_COL5) " +
                    "values (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    @Override
    public Long getTraceRawId() throws SQLException {
        Long trxRawId = Long.MIN_VALUE;

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement psmt = conn.prepareStatement(TRX_SEQ_SQL)) {
                ResultSet rs = psmt.executeQuery();
                if (rs.next()) {
                    trxRawId = rs.getLong(1);
                }
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
                throw e;
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return trxRawId;
    }

    @Override
    public void storeRecord(ConsumerRecords<String, byte[]> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);

            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                int batchCount = 0;
                Timestamp ts = null;

                for (ConsumerRecord<String, byte[]> record : records) {
                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                    byte[] sensorData = record.value();
                    String valueString = new String(sensorData);
                    // time, p1, p2, p3, p4, ... pn, status:time, prev:time
                    String[] values = valueString.split(",");

                    List<ParameterMasterDataSet> paramData = MasterCache.Parameter.get(record.key());

                    if (paramData == null) {
                        log.debug("[{}] - parameter does not existed.", record.key());
                        return;
                    }

                    log.debug("{} - {} parameters", record.key(), paramData.size());

                    for (ParameterMasterDataSet param : paramData) {
                        if (param.getParamParseIndex() == -1) continue;

                        pstmt.setLong(1, param.getParameterRawId()); //param rawid

                        String strValue = values[param.getParamParseIndex()];
                        if (strValue.length() <= 0) {
                            log.debug("key:{}, param:{}, index:{} - value is empty.",
                                    record.key(), param.getParameterName(), param.getParamParseIndex());
                            pstmt.setFloat(2, Types.FLOAT); //value
                        } else {
                            pstmt.setFloat(2, Float.parseFloat(strValue)); //value
                        }

                        if (param.getUpperAlarmSpec() != null) {
                            pstmt.setFloat(3, param.getUpperAlarmSpec()); //upper alarm spec
                        } else {
                            pstmt.setNull(3, Types.FLOAT);
                        }

                        if (param.getUpperWarningSpec() != null) {
                            pstmt.setFloat(4, param.getUpperWarningSpec()); //upper warning spec
                        } else {
                            pstmt.setNull(4, Types.FLOAT);
                        }

//                        if (param.getTarget() != null) {
//                            pstmt.setFloat(5, param.getTarget()); //target
//                        } else {
//                            pstmt.setNull(5, Types.FLOAT);
//                        }
//
//                        if (param.getLowerAlarmSpec() != null) {
//                            pstmt.setFloat(6, param.getLowerAlarmSpec()); //lower alarm spec
//                        } else {
//                            pstmt.setNull(6, Types.FLOAT);
//                        }
//
//                        if (param.getLowerWarningSpec() != null) {
//                            pstmt.setFloat(7, param.getLowerWarningSpec()); //lower warning spec
//                        } else {
//                            pstmt.setNull(7, Types.FLOAT);
//                        }

                        //status
                        String statusCodeAndTime = values[values.length - 2];
                        String[] nowStatusCodeAndTime = statusCodeAndTime.split(":");
                        pstmt.setString(5, nowStatusCodeAndTime[0]);

                        ts = getTimeStampFromString(values[0]);
                        pstmt.setTimestamp(6, ts);

                        pstmt.setNull(7, Types.VARCHAR);
                        pstmt.setNull(8, Types.VARCHAR);
                        pstmt.setNull(9, Types.VARCHAR);
                        pstmt.setNull(10, Types.VARCHAR);
                        pstmt.setNull(11, Types.VARCHAR);


                    }

                    pstmt.addBatch();

                    if (++batchCount == 100) {
                        totalCount += batchCount;
                        pstmt.executeBatch();
                        pstmt.clearBatch();
                        batchCount = 0;
                    }
                }

                if (batchCount > 0) {
                    totalCount += batchCount;
                    pstmt.executeBatch();
                    pstmt.clearBatch();
                }
                conn.commit();
                log.debug("{} records are inserted into TRACE_TRX_PDM.", totalCount);

            } catch (Exception e) {
                conn.rollback();
                log.error(e.getMessage(), e);

            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public void storeRecord(List<Pair<Long, SensorTraceData>> records) throws SQLException {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL_WITH_RAW)) {

                int totalCount = 0;
                int batchCount = 0;
                for (Pair<Long, SensorTraceData> record : records) {
                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                    SensorTraceData sensorData = record.getSecond();
                    pstmt.setLong(1, record.getFirst());
                    pstmt.setLong(2, sensorData.getParamMstRawid());
                    pstmt.setFloat(3, sensorData.getValue());


                    if (sensorData.getUpperAlarmSpec() != null) {
                        pstmt.setFloat(4, sensorData.getUpperAlarmSpec()); //upper alarm spec
                    } else {
                        pstmt.setNull(4, Types.FLOAT);
                    }

                    if (sensorData.getUpperWarningSpec() != null) {
                        pstmt.setFloat(5, sensorData.getUpperWarningSpec()); //upper warning spec
                    } else {
                        pstmt.setNull(5, Types.FLOAT);
                    }

//                    if (sensorData.getTarget() != null) {
//                        pstmt.setFloat(6, sensorData.getTarget()); //target
//                    } else {
//                        pstmt.setNull(6, Types.FLOAT);
//                    }
//
//                    if (sensorData.getLowerAlarmSpec() != null) {
//                        pstmt.setFloat(7, sensorData.getLowerAlarmSpec()); //lower alarm spec
//                    } else {
//                        pstmt.setNull(7, Types.FLOAT);
//                    }
//
//                    if (sensorData.getLowerWarningSpec() != null) {
//                        pstmt.setFloat(8, sensorData.getLowerWarningSpec()); //lower warning spec
//                    } else {
//                        pstmt.setNull(8, Types.FLOAT);
//                    }

                    //status
                    pstmt.setString(6, sensorData.getStatusCode()); //status
                    pstmt.setTimestamp(7, new Timestamp(sensorData.getEventDtts()));

                    //reserved columns
                    pstmt.setString(8, sensorData.getReservedCol1());
                    pstmt.setString(9, sensorData.getReservedCol2());
                    pstmt.setString(10, sensorData.getReservedCol3());
                    pstmt.setString(11, sensorData.getReservedCol4());
                    pstmt.setString(12, sensorData.getReservedCol5());

                    pstmt.addBatch();

                    if (++batchCount == 100) {
                        totalCount += batchCount;
                        pstmt.executeBatch();
                        pstmt.clearBatch();
                        batchCount = 0;
                    }
                }

                if (batchCount > 0) {
                    totalCount += batchCount;
                    pstmt.executeBatch();
                    pstmt.clearBatch();
                }
                conn.commit();
                log.debug("{} records are inserted into TRACE_TRX_PDM from RAW.", totalCount);

            } catch (Exception e) {
                conn.rollback();
                log.error(e.getMessage(), e);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private Timestamp getTimeStampFromString(String timeFormatString) {
        Timestamp timestamp = null;

        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
            java.util.Date parsedDate = dateFormat.parse(timeFormatString);
            timestamp = new java.sql.Timestamp(parsedDate.getTime());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return timestamp;
    }
}
