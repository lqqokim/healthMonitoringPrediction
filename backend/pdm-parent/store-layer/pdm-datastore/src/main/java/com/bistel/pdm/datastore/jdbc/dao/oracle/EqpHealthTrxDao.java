package com.bistel.pdm.datastore.jdbc.dao.oracle;//package com.bistel.pdm.datastore.jdbc.dao.ora;
//
//import com.bistel.pdm.datastore.jdbc.DataSource;
//import com.bistel.pdm.datastore.jdbc.dao.HealthDataDao;
//import com.bistel.pdm.datastore.model.ParamHealthData;
//import com.bistel.pdm.datastore.model.ParamHealthRULData;
//import org.apache.kafka.clients.consumer.ConsumerRecord;
//import org.apache.kafka.clients.consumer.ConsumerRecords;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.sql.*;
//import java.text.SimpleDateFormat;
//import java.util.List;
//
///**
// *
// */
//public class EqpHealthTrxDao implements HealthDataDao {
//    private static final Logger log = LoggerFactory.getLogger(EqpHealthTrxDao.class);
//
//    private static final String INSERT_SQL =
//            "insert into eqp_health_trx_pdm " +
//                    "(RAWID, EQP_MST_RAWID, PARAM_HEALTH_MST_RAWID, STATUS_CD, DATA_COUNT, SCORE, ALARM_DTTS) " +
//                    "values (SEQ_EQP_HEALTH_TRX_PDM.nextval,?,?,?,?,?,?) ";
//
//
//    @Override
//    public void storeRecord(ConsumerRecords<String, byte[]> records) {
//        try (Connection conn = DataSource.getConnection()) {
//
//            conn.setAutoCommit(false);
//            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {
//
//                int totalCount = 0;
//                int batchCount = 0;
//                Timestamp ts = null;
//
//                for (ConsumerRecord<String, byte[]> record : records) {
//                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());
//
//                    byte[] healthData = record.value();
//                    String valueString = new String(healthData);
//                    // time, eqpRawid, param_rawid, param_health_rawid, status_cd, count, index,
//                    String[] values = valueString.split(",");
//
//                    log.trace("[{}] - time : {}, eqp : {}, param : {}", record.key(),
//                            values[0], values[1], values[2]);
//
//                    ts = new Timestamp(Long.parseLong(values[0]));
//                    pstmt.setLong(1, Long.parseLong(values[1])); //eqp_mst_rawid
//                    pstmt.setLong(2, Long.parseLong(values[3])); //param_health_mst_rawid
//                    pstmt.setString(3, values[4]);
//                    pstmt.setDouble(4, Double.parseDouble(values[5])); //data count
//                    //pstmt.setDouble(5, Double.parseDouble(values[6])); //index value
//
//                    if (values[6] != null && values[6].length() > 0) {
//                        pstmt.setDouble(10, Double.parseDouble(values[6])); // score
//                    } else {
//                        pstmt.setDouble(10, 0D);
////                        pstmt.setNull(10, Types.DOUBLE);
//                    }
//
//                    pstmt.setTimestamp(6, ts);
//
//                    pstmt.addBatch();
//                    //log.debug("offset = " + record.offset() + " value = " + valueString);
//
//                    if (++batchCount == 100) {
//                        totalCount += batchCount;
//                        pstmt.executeBatch();
//                        pstmt.clearBatch();
//                        batchCount = 0;
//                    }
//                }
//
//                if (batchCount > 0) {
//                    totalCount += batchCount;
//                    pstmt.executeBatch();
//                    pstmt.clearBatch();
//                }
//                conn.commit();
//                String timeStamp = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(ts);
//                log.debug("[{}] - {} records are inserted into EQP_HEALTH_TRX_PDM.", timeStamp, totalCount);
//
//            } catch (Exception e) {
//                conn.rollback();
//                log.error(e.getMessage(), e);
//
//            } finally {
//                conn.setAutoCommit(true);
//            }
//        } catch (SQLException e) {
//            log.error(e.getMessage(), e);
//        }
//    }
//
//    @Override
//    public Long getTraceRawId() {
//        return null;
//    }
//
//    @Override
//    public void storeHealth(List<ParamHealthData> records) {
//        // x
//    }
//
//    @Override
//    public void storeHealthRUL(List<ParamHealthRULData> records) {
//        // x
//    }
//}
