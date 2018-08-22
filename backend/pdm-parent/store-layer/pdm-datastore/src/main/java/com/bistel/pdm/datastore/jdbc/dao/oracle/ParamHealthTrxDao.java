package com.bistel.pdm.datastore.jdbc.dao.oracle;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.HealthDataDao;
import com.bistel.pdm.datastore.model.ParamHealthData;
import com.bistel.pdm.datastore.model.ParamHealthRULData;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.List;

/**
 *
 */
public class ParamHealthTrxDao implements HealthDataDao {
    private static final Logger log = LoggerFactory.getLogger(ParamHealthTrxDao.class);

    private static final String TRX_SEQ_SQL = "select seq_param_health_trx_pdm.nextval from DUAL";

    private static final String INSERT_SQL =
            "insert into param_health_trx_pdm " +
                    "(RAWID, PARAM_MST_RAWID, PARAM_HEALTH_MST_RAWID, STATUS_CD, DATA_COUNT, SCORE, " +
                    " UPPER_ALARM_SPEC, UPPER_WARNING_SPEC, CREATE_DTTS) " +
                    "values (?,?,?,?,?,?,?,?,?) ";

    private static final String INSERT_RUL_SQL =
            "insert into param_health_rul_trx_pdm " +
                    "(RAWID, PARAM_HEALTH_TRX_RAWID, INTERCEPT, SLOPE, XVALUE, CREATE_DTTS) " +
                    "values (seq_param_health_rul_trx_pdm.nextval,?,?,?,?,?) ";

    @Override
    public Long getTraceRawId() {
        Long trxRawId = Long.MIN_VALUE;
        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement psrawid = conn.prepareStatement(TRX_SEQ_SQL)) {
                ResultSet rs = psrawid.executeQuery();
                if (rs.next()) {
                    trxRawId = rs.getLong(1);
                }
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return trxRawId;
    }

    @Override
    public void storeHealth(List<ParamHealthData> records) {
        try (Connection conn = DataSource.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                int batchCount = 0;

                for(ParamHealthData health : records){
                    pstmt.setLong(1, health.getRawId());
                    pstmt.setLong(2, health.getParamRawId()); //param_mst_rawid
                    pstmt.setLong(3, health.getParamHealthRawId()); //param_health_rawid
                    pstmt.setString(4, health.getStatus());
                    pstmt.setDouble(5, health.getDataCount()); //data count
                    pstmt.setDouble(6, health.getIndex()); //index score

                    if (health.getUpperAlarmSpec() != null) {
                        pstmt.setFloat(7, health.getUpperAlarmSpec()); //upper alarm spec
                    } else {
                        pstmt.setNull(7, Types.FLOAT);
                    }

                    if (health.getUpperWarningSpec() != null) {
                        pstmt.setFloat(8, health.getUpperWarningSpec()); //upper warning spec
                    } else {
                        pstmt.setNull(8, Types.FLOAT);
                    }

//                    if (health.getTarget() != null) {
//                        pstmt.setFloat(10, health.getTarget()); // target spec
//                    } else {
//                        pstmt.setNull(10, Types.FLOAT);
//                    }
//
//                    if (health.getLowerAlarmSpec() != null) {
//                        pstmt.setFloat(11, health.getLowerAlarmSpec()); //lower alarm spec
//                    } else {
//                        pstmt.setNull(11, Types.FLOAT);
//                    }
//
//                    if (health.getLowerWarningSpec() != null) {
//                        pstmt.setFloat(12, health.getLowerWarningSpec()); //lower warning spec
//                    } else {
//                        pstmt.setNull(12, Types.FLOAT);
//                    }

                    pstmt.setTimestamp(9, new Timestamp(health.getTime()));

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
                log.debug("{} records are inserted into PARAM_HEALTH_TRX_PDM.", totalCount);

            } catch (Exception e) {
                log.error(e.getMessage(), e);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public void storeHealthRUL(List<ParamHealthRULData> records) {
        try (Connection conn = DataSource.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_RUL_SQL)) {
                int totalCount = 0;
                int batchCount = 0;

                for(ParamHealthRULData rul : records){
                    pstmt.setLong(1, rul.getParamHealthTrxRawId());
                    pstmt.setDouble(2, rul.getIntercept());
                    pstmt.setDouble(3, rul.getSlope());
                    pstmt.setDouble(4, rul.getX());
                    pstmt.setTimestamp(5, new Timestamp(rul.getTime()));

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
                log.debug("{} records are inserted into PARAM_HEALTH_RUL_TRX_PDM.", totalCount);

            } catch (Exception e) {
                log.error(e.getMessage(), e);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public void storeRecord(ConsumerRecords<String, byte[]> records) {

    }
}
