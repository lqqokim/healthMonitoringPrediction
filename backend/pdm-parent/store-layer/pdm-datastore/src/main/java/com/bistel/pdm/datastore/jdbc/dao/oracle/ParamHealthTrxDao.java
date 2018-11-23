package com.bistel.pdm.datastore.jdbc.dao.oracle;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.HealthDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.List;

/**
 *
 */
public class ParamHealthTrxDao implements HealthDataDao {
    private static final Logger log = LoggerFactory.getLogger(ParamHealthTrxDao.class);

    private static final String INSERT_SQL =
            "insert into PARAM_HEALTH_TRX_PDM " +
                    "(" +
                    "RAWID, " +
                    "PARAM_MST_RAWID, " +
                    "PARAM_HEALTH_MST_RAWID, " +
                    "STATUS_CD, " +
                    "DATA_COUNT, " +
                    "SCORE, " +
                    "UPPER_ALARM_SPEC, " +
                    "UPPER_WARNING_SPEC, " +
                    "TARGET, " +
                    "LOWER_ALARM_SPEC, " +
                    "LOWER_WARNING_SPEC, " +
                    "PROCESS_CONTEXT, " +
                    "CREATE_DTTS) " +
                    "values " +
                    "(seq_param_health_trx_pdm.nextval,?,?,?,?,?,?,?,?,?,?) ";

    @Override
    public void storeRecords(List<ConsumerRecord<String, byte[]>> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] features = record.value();
                    String valueString = new String(features);

                    // in : time, param_rawid, param_health_rawid, status_cd,
                    //      data_count, index, specs, process context
                    String[] values = valueString.split(",", -1);

                    Timestamp timestamp = new Timestamp(Long.parseLong(values[0]));

                    pstmt.setLong(1, Long.parseLong(values[1])); //param mst rawid
                    pstmt.setLong(2, Long.parseLong(values[2]));
                    pstmt.setString(3, values[3]); //status_cd
                    pstmt.setInt(4, Integer.parseInt(values[4])); //data count
                    pstmt.setFloat(5, Float.parseFloat(values[5])); //score

                    pstmt.setFloat(6, Float.parseFloat(values[6])); //usl
                    pstmt.setFloat(7, Float.parseFloat(values[7])); //ucl

                    if (values[8].length() > 0) {
                        pstmt.setFloat(8, Float.parseFloat(values[8])); //target
                    } else {
                        pstmt.setNull(8, Types.FLOAT);
                    }

                    if (values[9].length() > 0) {
                        pstmt.setFloat(9, Float.parseFloat(values[9])); //lsl
                    } else {
                        pstmt.setNull(9, Types.FLOAT);
                    }

                    if (values[10].length() > 0) {
                        pstmt.setFloat(10, Float.parseFloat(values[10])); //lcl
                    } else {
                        pstmt.setNull(10, Types.FLOAT);
                    }

                    pstmt.setString(11, values[11]); //process context
                    pstmt.setTimestamp(12, timestamp);

                    pstmt.addBatch();
                    ++totalCount;
                }

                pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into PARAM_HEALTH_TRX_PDM.", totalCount);

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

//        private static final String TRX_SEQ_SQL = "select seq_param_health_trx_pdm.nextval from DUAL";
//    @Override
//    public Long getTraceRawId() {
//        Long trxRawId = Long.MIN_VALUE;
//        try (Connection conn = DataSource.getConnection()) {
//            try (PreparedStatement psrawid = conn.prepareStatement(TRX_SEQ_SQL)) {
//                ResultSet rs = psrawid.executeQuery();
//                if (rs.next()) {
//                    trxRawId = rs.getLong(1);
//                }
//            } catch (SQLException e) {
//                log.error(e.getMessage(), e);
//            }
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
//
//        return trxRawId;
//    }
}
