package com.bistel.pdm.datastore.jdbc.dao.pg;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.HealthDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

/**
 *
 */
public class HealthTrxPostgreDao implements HealthDataDao {
    private static final Logger log = LoggerFactory.getLogger(HealthTrxPostgreDao.class);

    private static final String INSERT_SQL =
            "insert into param_health_trx_pdm (RAWID, PARAM_MST_RAWID, PARAM_HEALTH_MST_RAWID, STATUS_CD, SCORE, ALARM_DTTS) " +
                    "values (SEQ_PARAM_HEALTH_TRX_PDM.nextval,?,?,?,?,?) ";

    @Override
    public void storeRecord(ConsumerRecords<String, byte[]> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                int batchCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                    byte[] healthData = record.value();
                    String valueString = new String(healthData);
                    // time, param_rawid, param_health_rawid, status_cd, index
                    String[] values = valueString.split(",");

                    pstmt.setLong(1, Long.parseLong(values[1])); //param_mst_rawid
                    pstmt.setLong(2, Long.parseLong(values[2])); //param_health_rawid
                    pstmt.setString(3, values[3]);
                    pstmt.setDouble(4, Double.parseDouble(values[4])); //index value
                    pstmt.setTimestamp(5, new Timestamp(Long.parseLong(values[0])));

                    pstmt.addBatch();
                    //log.debug("offset = " + record.offset() + " value = " + valueString);

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
                conn.rollback();
                log.error(e.getMessage(), e);

            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }
    }
}
