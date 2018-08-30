package com.bistel.pdm.datastore.jdbc.dao.oracle;

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
public class FeatureTrxDao implements FeatureDataDao {
    private static final Logger log = LoggerFactory.getLogger(FeatureTrxDao.class);

    private static final String INSERT_SQL =
            "insert into param_feature_trx_pdm " +
                    "(RAWID, PARAM_MST_RAWID, BEGIN_DTTS, END_DTTS, " +
                    "COUNT, MIN, MAX, MEDIAN, MEAN, STDDEV, Q1, Q3, " +
                    "MESSAGE_GROUP, " +
                    "UPPER_ALARM_SPEC, UPPER_WARNING_SPEC, TARGET, " +
                    "LOWER_ALARM_SPEC, LOWER_WARNING_SPEC) " +
                    //"RESERVED_COL1, RESERVED_COL2, RESERVED_COL3, RESERVED_COL4, RESERVED_COL5) " +
                    "values (seq_param_feature_trx_pdm.nextval,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

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

                    // startDtts, endDtts, param rawid, count, max, min, median, avg, stddev, q1, q3, group, specs, refresh cmd
                    // 1535527633937,1535527633937,1111,1,2822.0,2822.0,2822.0,2822.0,0.0,2822.0,2822.0,1535527633937,5003.0,4776.0,,,,,null
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

                    pstmt.setString(12, values[11]);

                    // SPEC
                    if (values[12].length() > 0) {
                        pstmt.setFloat(13, Float.parseFloat(values[12])); //upper alarm spec
                    } else {
                        pstmt.setNull(13, Types.FLOAT);
                    }

                    if (values[13].length() > 0) {
                        pstmt.setFloat(14, Float.parseFloat(values[13])); //upper warning spec
                    } else {
                        pstmt.setNull(14, Types.FLOAT);
                    }

                    if (values[14].length() > 0) {
                        pstmt.setFloat(15, Float.parseFloat(values[14])); //target
                    } else {
                        pstmt.setNull(15, Types.FLOAT);
                    }

                    if (values[15].length() > 0) {
                        pstmt.setFloat(16, Float.parseFloat(values[15])); //lower alarm spec
                    } else {
                        pstmt.setNull(16, Types.FLOAT);
                    }

                    if (values[16].length() > 0) {
                        pstmt.setFloat(17, Float.parseFloat(values[16])); //lower warning spec
                    } else {
                        pstmt.setNull(17, Types.FLOAT);
                    }

//                    if (values[18].length() > 0) {
//                        pstmt.setString(18, values[18]); //dimensional column
//                    } else {
//                        pstmt.setNull(18, Types.VARCHAR);
//                    }
//
//                    pstmt.setNull(19, Types.VARCHAR);
//                    pstmt.setNull(20, Types.VARCHAR);
//                    pstmt.setNull(21, Types.VARCHAR);
//                    pstmt.setNull(22, Types.VARCHAR);

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
