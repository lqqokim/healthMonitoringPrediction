package com.bistel.pdm.datastore.jdbc.dao.oracle;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.data.stream.ParameterMaster;
import com.bistel.pdm.data.stream.ParameterWithSpecMaster;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorTraceDataDao;
import com.bistel.pdm.datastore.model.SensorTraceData;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 *
 */
public class TraceTrxDao implements SensorTraceDataDao {
    private static final Logger log = LoggerFactory.getLogger(TraceTrxDao.class);

    private static final String TRX_SEQ_SQL = "select SEQ_TRACE_TRX_PDM.nextval from DUAL";

    private static final String INSERT_SQL =
            "insert into TRACE_TRX_PDM " +
                    "(RAWID, " +
                    "PARAM_MST_RAWID, " +
                    "VALUE, " +
                    "ALARM_SPEC, " +
                    "WARNING_SPEC, " +
                    //"UPPER_ALARM_SPEC, UPPER_WARNING_SPEC, " +
                    //"TARGET, " +
                    //"LOWER_ALARM_SPEC, LOWER_WARNING_SPEC, " +
                    "STATUS_CD, " +
                    "EVENT_DTTS, " +
                    "MESSAGE_GROUP, " +
                    "RULE_NAME, " +
                    "CONDITION, " +
                    "RESERVED_COL1, RESERVED_COL2, RESERVED_COL3, RESERVED_COL4, RESERVED_COL5) " +
                    "values " +
                    "(SEQ_TRACE_TRX_PDM.nextval,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    @Override
    public Long getTraceRawId() throws SQLException {
        Long trxRawId = Long.MIN_VALUE;

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement psrawid = conn.prepareStatement(TRX_SEQ_SQL)) {

                ResultSet rs = psrawid.executeQuery();
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

    private ParameterWithSpecMaster getParamSpec(String key, String paramName, String ruleName) throws ExecutionException {
        List<ParameterWithSpecMaster> paramWithSpec = MasterCache.ParameterWithSpec.get(key);

        ParameterWithSpecMaster paramInfo = null;
        for (ParameterWithSpecMaster pws : paramWithSpec) {
            if(ruleName.equalsIgnoreCase(pws.getRuleName())){
                if (paramName.equalsIgnoreCase(pws.getParameterName())){
                    paramInfo = pws;
                    break;
                }
            }
        }

        return paramInfo;
    }

    @Override
    public void storeRecords(List<ConsumerRecord<String, byte[]>> records) {
        try (Connection conn = DataSource.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                Timestamp ts = null;

                for (ConsumerRecord<String, byte[]> record : records) {
                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                    byte[] sensorData = record.value();
                    String valueString = new String(sensorData);

                    // time, P1, P2, P3, P4, ... Pn, {status, groupid, rulename}
                    String[] values = valueString.split(",", -1);

                    String ruleName = values[values.length - 1];

                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                    Date parsedDate = dateFormat.parse(values[values.length - 2]);
                    Timestamp timestamp = new Timestamp(parsedDate.getTime());
                    String msgGroup = Long.toString(timestamp.getTime());

                    String status = values[values.length - 3];

                    List<ParameterMaster> paramData = MasterCache.Parameter.get(record.key());

//                    for (ParameterMaster paramInfo : paramData) {
//
//                        pstmt.setLong(1, paramInfo.getId()); //param rawid
//
//                        String strValue = values[paramInfo.getParamParseIndex()];
//                        if (strValue.length() <= 0) {
//                            log.trace("key:{}, param:{}, index:{} - value is empty.",
//                                    record.key(), paramInfo.getParameterName(), paramInfo.getParamParseIndex());
//                            pstmt.setFloat(2, Types.FLOAT); //value
//                        } else {
//                            pstmt.setFloat(2, Float.parseFloat(strValue)); //value
//                        }
//
//                        ParameterWithSpecMaster paramSpec = getParamSpec(record.key(), paramInfo.getParameterName(), ruleName);
//
//                        if(paramSpec != null) {
//                            if (paramSpec.getUpperAlarmSpec() != null) {
//                                pstmt.setFloat(3, paramSpec.getUpperAlarmSpec()); //upper alarm spec
//                            } else {
//                                pstmt.setNull(3, Types.FLOAT);
//                            }
//
//                            if (paramSpec.getUpperWarningSpec() != null) {
//                                pstmt.setFloat(4, paramSpec.getUpperWarningSpec()); //upper warning spec
//                            } else {
//                                pstmt.setNull(4, Types.FLOAT);
//                            }
//
//                            pstmt.setString(8, paramSpec.getRuleName());
//                            pstmt.setString(9, paramSpec.getCondition().replaceAll(",", ";"));
//
//                        } else {
//                            pstmt.setNull(3, Types.FLOAT);
//                            pstmt.setNull(4, Types.FLOAT);
//
//                            pstmt.setNull(8, Types.VARCHAR);
//                            pstmt.setNull(9, Types.VARCHAR);
//                        }
//
//                        pstmt.setString(5, status); // status code : R / I
//                        ts = getTimeStampFromString(values[0]);
//                        pstmt.setTimestamp(6, ts); // event_dtts
//
//                        pstmt.setString(7, msgGroup);
//
//                        pstmt.setNull(10, Types.VARCHAR);
//                        pstmt.setNull(11, Types.VARCHAR);
//                        pstmt.setNull(12, Types.VARCHAR);
//                        pstmt.setNull(13, Types.VARCHAR);
//                        pstmt.setNull(14, Types.VARCHAR);
//
//                        pstmt.addBatch();
//                        ++totalCount;
//                    }
                }

                pstmt.executeBatch();
                conn.commit();

                String timeStamp = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(ts);
                log.debug("[{}] - {} records are inserted into TRACE_TRX_PDM.", timeStamp, totalCount);

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

    private static final String INSERT_SQL_WITH_RAW =
            "insert into trace_trx_pdm " +
                    "(RAWID, PARAM_MST_RAWID, VALUE, " +
                    "ALARM_SPEC, WARNING_SPEC, " +
                    //"UPPER_ALARM_SPEC, UPPER_WARNING_SPEC, " +
                    //"TARGET, " +
                    //"LOWER_ALARM_SPEC, LOWER_WARNING_SPEC, " +
                    "STATUS_CD, " +
                    "EVENT_DTTS, " +
                    "MESSAGE_GROUP, " +
                    //"RULE_NAME, " +
                    //"CONDITION, " +
                    "RPM, " +
                    "RESERVED_COL1, RESERVED_COL2, RESERVED_COL3, RESERVED_COL4, RESERVED_COL5) " +
                    "values (?,?,?,?,?,?,?,?,?,?,?,?,?)";

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

                    pstmt.setString(8, "TIMEWAVE"); //message group
                    pstmt.setFloat(9, sensorData.getRpm()); //rpm

                    //reserved columns
                    pstmt.setString(10, sensorData.getReservedCol1());
                    pstmt.setString(11, sensorData.getReservedCol2());
                    pstmt.setString(12, sensorData.getReservedCol3());
                    pstmt.setString(13, sensorData.getReservedCol4());
                    pstmt.setString(14, sensorData.getReservedCol5());

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
            timestamp = new Timestamp(parsedDate.getTime());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return timestamp;
    }
}
