package com.bistel.pdm.datastore.jdbc.dao.ora;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorTraceDataDao;
import com.bistel.pdm.datastore.model.SensorTraceData;
import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
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
public class SensorTraceTrxDao implements SensorTraceDataDao {
    private static final Logger log = LoggerFactory.getLogger(SensorTraceTrxDao.class);

    private static final String TRX_SEQ_SQL = "select SEQ_TRACE_TRX_PDM.nextval from DUAL";

    private static final String INSERT_SQL =
            "insert into trace_trx_pdm (RAWID, PARAM_MST_RAWID, VALUE, " +
                    "UPPER_ALARM_SPEC, UPPER_WARNING_SPEC, TARGET, " +
                    "LOWER_ALARM_SPEC, LOWER_WARNING_SPEC, EVENT_DTTS, " +
                    "RESERVED_COL1, RESERVED_COL2, RESERVED_COL3, RESERVED_COL4, RESERVED_COL5) " +
                    "values (SEQ_TRACE_TRX_PDM.nextval,?,?,?,?,?,?,?,?,?,?,?,?,?)";

//    private static final String INSERT_SQL1 =
//            "insert into trace_trx_pdm (RAWID, PARAM_MST_RAWID, VALUE, RPM, " +
//                    "ALARM_SPEC, " +
//                    "WARNING_SPEC, EVENT_DTTS, " +
//                    "RESERVED_COL1, RESERVED_COL2, RESERVED_COL3, RESERVED_COL4, RESERVED_COL5) " +
//                    "values (?,?,?,?,?,?,?,?,?,?,?,?)";

    public SensorTraceTrxDao() {
    }

    @Override
    public Long getTraceRawId() throws SQLException {
        Long trxRawId = Long.MIN_VALUE;
        try (Connection conn = DataSource.getConnection();
             PreparedStatement psrawid = conn.prepareStatement(TRX_SEQ_SQL)) {

            ResultSet rs = psrawid.executeQuery();
            if (rs.next()) {
                trxRawId = rs.getLong(1);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
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
                for (ConsumerRecord<String, byte[]> record : records) {
                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                    byte[] sensorData = record.value();
                    String valueString = new String(sensorData);

                    // time, area, eqp, p1, p2, p3, p4, ... pn,
                    String[] values = valueString.split(",");

                    List<ParameterMasterDataSet> paramData =
                            MasterDataCache.getInstance().getParamMasterDataSet().get(record.key());
                    log.debug("{} - {} parameters", record.key(), paramData.size());

                    for (ParameterMasterDataSet param : paramData) {
                        pstmt.setLong(1, param.getParameterRawId()); //param rawid
                        pstmt.setFloat(2, Float.parseFloat(values[param.getParamParseIndex()])); //value

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

                        if (param.getTarget() != null) {
                            pstmt.setFloat(5, param.getTarget()); //target
                        } else {
                            pstmt.setNull(5, Types.FLOAT);
                        }

                        if (param.getLowerAlarmSpec() != null) {
                            pstmt.setFloat(6, param.getLowerAlarmSpec()); //lower alarm spec
                        } else {
                            pstmt.setNull(6, Types.FLOAT);
                        }

                        if (param.getLowerWarningSpec() != null) {
                            pstmt.setFloat(7, param.getLowerWarningSpec()); //lower warning spec
                        } else {
                            pstmt.setNull(7, Types.FLOAT);
                        }

                        pstmt.setTimestamp(8, getTimeStampFromString(values[0]));

                        pstmt.setNull(9, Types.VARCHAR);
                        pstmt.setNull(10, Types.VARCHAR);
                        pstmt.setNull(11, Types.VARCHAR);
                        pstmt.setNull(12, Types.VARCHAR);
                        pstmt.setNull(13, Types.VARCHAR);

                        pstmt.addBatch();

                        if (++batchCount == 100) {
                            totalCount += batchCount;
                            pstmt.executeBatch();
                            pstmt.clearBatch();
                            batchCount = 0;
                        }
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

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public void storeRecord(List<Pair<Long, SensorTraceData>> records) throws SQLException {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                int batchCount = 0;
                for (Pair<Long, SensorTraceData> record : records) {
                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                    SensorTraceData sensorData = record.getSecond();
                    pstmt.setLong(1, record.getFirst());
                    pstmt.setLong(2, sensorData.getParamMstRawid());
                    pstmt.setFloat(3, sensorData.getValue());

//                    if (sensorData.getRpm() != null) {
//                        pstmt.setFloat(4, sensorData.getRpm());
//                    } else {
//                        pstmt.setNull(4, Types.INTEGER);
//                    }
//
//                    if (sensorData.getAlarmSpec() != null) {
//                        pstmt.setFloat(5, sensorData.getAlarmSpec());
//                    } else {
//                        pstmt.setNull(5, Types.FLOAT);
//                    }
//
//                    if (sensorData.getWarningSpec() != null) {
//                        pstmt.setFloat(6, sensorData.getWarningSpec());
//                    } else {
//                        pstmt.setNull(6, Types.FLOAT);
//                    }

                    pstmt.setTimestamp(8, new Timestamp(sensorData.getEventDtts()));

                    //reserved columns
                    pstmt.setString(9, sensorData.getReservedCol1());
                    pstmt.setString(10, sensorData.getReservedCol2());
                    pstmt.setString(11, sensorData.getReservedCol3());
                    pstmt.setString(12, sensorData.getReservedCol4());
                    pstmt.setString(13, sensorData.getReservedCol5());

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
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private Timestamp getTimeStampFromString(String timeFormatString) {
        Timestamp timestamp = null;

        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.SSS");
            java.util.Date parsedDate = dateFormat.parse(timeFormatString);
            timestamp = new java.sql.Timestamp(parsedDate.getTime());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return timestamp;
    }
}
