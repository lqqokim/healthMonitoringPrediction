package com.bistel.pdm.datastore.jdbc.dao.ora;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.FeatureDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 *
 */
public class FeatureTrxDao implements FeatureDataDao {
    private static final Logger log = LoggerFactory.getLogger(FeatureTrxDao.class);

    private static final String INSERT_SQL =
            "insert into param_feature_agg_trx_pdm " +
                    "(RAWID, PARAM_FEATURE_MST_RAWID, VALUE, SUM_BEGIN_DTTS, SUM_END_DTTS) " +
                    "values (seq_param_feature_agg_trx_pdm.nextval, ?, ?, ?, ?)";

    @Override
    public void storeRecord(ConsumerRecords<String, byte[]> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int batchCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] features = record.value();
                    String valueString = new String(features);
                    String[] values = valueString.split(",");
                    log.debug("comming message : {}", valueString);

//                Long param_feature_rawid = Long.parseLong(values[1]);
//                Timestamp timestamp = new Timestamp(Long.parseLong(values[0]));
//
//                // time, param_feature_rawid,
//                // pointSum, pointMin, pointMax, pointMean, pointStdDev, pointMedian;
//                for (int i = 2; i < values.length; i++) {
//                    pstmt.setLong(1, param_feature_rawid); //param feature mst rawid
//                    pstmt.setFloat(2, TimeUnit.MINUTES.toMillis(1));
//                    pstmt.setNull(3, Types.FLOAT);
//                    pstmt.setFloat(5, Float.parseFloat(values[i]));
//                    pstmt.setTimestamp(6, timestamp);
//
//                    pstmt.addBatch();

                    if (++batchCount == 100) {
                        pstmt.executeBatch();
                        pstmt.clearBatch();
                        batchCount = 0;
                        log.debug("{} records are inserted into PARAM_FEATURE_AGG_TRX_PDM.", batchCount);
                    }
//                }
                }

                if (batchCount > 0) {
                    pstmt.executeBatch();
                    pstmt.clearBatch();
                    log.debug("{} records are inserted into PARAM_FEATURE_AGG_TRX_PDM.", batchCount);
                }
                conn.commit();

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
