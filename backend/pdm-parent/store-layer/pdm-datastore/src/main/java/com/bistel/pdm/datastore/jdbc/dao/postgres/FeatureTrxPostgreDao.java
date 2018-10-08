package com.bistel.pdm.datastore.jdbc.dao.postgres;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.FeatureDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 *
 */
public class FeatureTrxPostgreDao implements FeatureDataDao {
    private static final Logger log = LoggerFactory.getLogger(FeatureTrxPostgreDao.class);

    private static final String INSERT_SQL =
            "insert into param_feature_trx_pdm " +
                    "(PARAM_MST_RAWID, BEGIN_DTTS, END_DTTS, " +
                    "COUNT, MIN, MAX, MEDIAN, MEAN, STDDEV, Q1, Q3, " +
                    "MESSAGE_GROUP) " +
                    "values (?,?,?,?,?,?,?,?,?,?,?,?)";

    @Override
    public void storeRecords(List<ConsumerRecord<String, byte[]>> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                Timestamp ts = null;

                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] features = record.value();
                    String valueString = new String(features);

                    String[] values = valueString.split(",", -1);

                    // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, group, specs
                    Long param_rawid = Long.parseLong(values[2]);
                    Timestamp beginDtts = new Timestamp(Long.parseLong(values[0]));
                    Timestamp endDtts = new Timestamp(Long.parseLong(values[1]));

                    pstmt.setLong(1, param_rawid);
                    pstmt.setTimestamp(2, beginDtts);
                    pstmt.setTimestamp(3, endDtts);

                    pstmt.setInt(4, Integer.parseInt(values[3]));   // count
                    pstmt.setFloat(5, Float.parseFloat(values[4])); // min
                    pstmt.setFloat(6, Float.parseFloat(values[5])); // max
                    pstmt.setFloat(7, Float.parseFloat(values[6])); // median
                    pstmt.setFloat(8, Float.parseFloat(values[7])); // mean
                    pstmt.setFloat(9, Float.parseFloat(values[8])); // stddev
                    pstmt.setFloat(10, Float.parseFloat(values[9])); // q1
                    pstmt.setFloat(11, Float.parseFloat(values[10])); // q3
                    pstmt.setString(12, values[11]); // message group

                    ts = endDtts;

                    pstmt.addBatch();
                    ++totalCount;
                }

                pstmt.executeBatch();
                conn.commit();
                String timeStamp = new SimpleDateFormat("MMdd HH:mm:ss.SSS").format(ts);
                log.debug("[{}] - {} records are inserted into PARAM_FEATURE_TRX_PDM.", timeStamp, totalCount);

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
