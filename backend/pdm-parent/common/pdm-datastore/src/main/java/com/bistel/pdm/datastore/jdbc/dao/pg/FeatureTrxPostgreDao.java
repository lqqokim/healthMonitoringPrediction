package com.bistel.pdm.datastore.jdbc.dao.pg;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.FeatureDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

/**
 *
 */
public class FeatureTrxPostgreDao implements FeatureDataDao {
    private static final Logger log = LoggerFactory.getLogger(FeatureTrxPostgreDao.class);

    private static final String INSERT_SQL =
            "insert into param_feature_trx_pdm " +
                    "(RAWID, PARAM_MST_RAWID, BEGIN_DTTS, END_DTTS, COUNT, MIN, MAX, MEDIAN, MEAN, STDDEV, Q1, Q3) " +
                    "values (seq_param_feature_trx_pdm.nextval, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    @Override
    public void storeRecord(ConsumerRecords<String, byte[]> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                int batchCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] features = record.value();
                    String valueString = new String(features);
                    String[] values = valueString.split(",");

                    // startDtts, endDtts, param rawid, count, min, max, median, avg, stddev, q1, q3
                    Long param_rawid = Long.parseLong(values[2]);
                    Timestamp beginDtts = new Timestamp(Long.parseLong(values[0]));
                    Timestamp endDtts = new Timestamp(Long.parseLong(values[1]));

                    pstmt.setLong(1, param_rawid);
                    pstmt.setTimestamp(2, beginDtts);
                    pstmt.setTimestamp(3, endDtts);

                    pstmt.setInt(4, Integer.parseInt(values[3]));
                    pstmt.setFloat(5, Float.parseFloat(values[4]));
                    pstmt.setFloat(6, Float.parseFloat(values[5]));
                    pstmt.setFloat(7, Float.parseFloat(values[6]));
                    pstmt.setFloat(8, Float.parseFloat(values[7]));
                    pstmt.setFloat(9, Float.parseFloat(values[8]));
                    pstmt.setFloat(10, Float.parseFloat(values[9]));
                    pstmt.setFloat(11, Float.parseFloat(values[10]));

                    pstmt.addBatch();

                    if (++batchCount == 100) {
                        totalCount += batchCount;
                        pstmt.executeBatch();
                        pstmt.clearBatch();
                        batchCount = 0;
                    }
//                }
                }

                if (batchCount > 0) {
                    totalCount += batchCount;
                    pstmt.executeBatch();
                    pstmt.clearBatch();
                }
                conn.commit();
                log.debug("{} records are inserted into PARAM_FEATURE_TRX_PDM.", totalCount);

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
}
