package com.bistel.pdm.datastore.jdbc.dao.ora;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.FeatureDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.concurrent.TimeUnit;

/**
 *
 */
public class FeatureAggregationTrxDao implements FeatureDataDao {
    private static final Logger log = LoggerFactory.getLogger(FeatureAggregationTrxDao.class);

    private static final String INSERT_SQL =
            "insert into param_feature_agg_trx_pdm " +
                    "(RAWID, PARAM_FEATURE_MST_RAWID, WINDOW_SIZE_MS, WINDOW_ADVANCE_MS, DATA_POINT, VALUE, EVENT_DTTS) " +
                    "values (seq_param_feature_agg_trx_pdm.nextval, ?, ?, ?, ?, ?, ?)";

    @Override
    public void storeRecord(ConsumerRecords<String, byte[]> records) {
        try (Connection conn = DataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

            conn.setAutoCommit(false);

            for (ConsumerRecord<String, byte[]> record : records) {
                byte[] features = record.value();
                String valueString = new String(features);
                String[] values = valueString.split(",");
                log.debug("comming message : {}", valueString);

                Long param_feature_rawid = Long.parseLong(values[1]);
                int dataCounts = 0; //Integer.parseInt(values[1]);
                Timestamp timestamp = new Timestamp(Long.parseLong(values[0]));

                // time, param_feature_rawid, dataCount,
                // pointSum, pointMin, pointMax, pointMean, pointStdDev, pointMedian;
                for (int i = 2; i < values.length; i++) {
                    pstmt.setLong(1, param_feature_rawid); //param feature mst rawid
                    pstmt.setFloat(2, TimeUnit.MINUTES.toMillis(1));
                    pstmt.setNull(3, Types.FLOAT);
                    pstmt.setFloat(4, dataCounts);
                    pstmt.setFloat(5, Float.parseFloat(values[i]));
                    pstmt.setTimestamp(6, timestamp);

                    pstmt.addBatch();
                }
            }

            try {
                int[] ret = pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into PARAM_FEATURE_AGG_TRX_PDM.", ret.length);
            } catch (Exception e) {
                conn.rollback();
                log.error(e.getMessage(), e);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }
    }
}
