package com.bistel.pdm.datastore.jdbc.dao.oracle;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.FeatureDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 *
 */
public class DimensionTrxDao implements FeatureDataDao {
    private static final Logger log = LoggerFactory.getLogger(DimensionTrxDao.class);

    private static final String INSERT_SQL =
            "insert into param_dimension_trx_pdm " +
                    "(RAWID, " +
                    "PARAM_MST_RAWID, " +
                    "BEGIN_DTTS, " +
                    "END_DTTS, " +
                    "VALUE, " +
                    "MESSAGE_GROUP) " +
                    "values (seq_param_dimension_trx_pdm.nextval,?,?,?,?,?)";

    @Override
    public void storeRecords(List<ConsumerRecord<String, byte[]>> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;

                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] features = record.value();
                    String valueString = new String(features);

                    String[] values = valueString.split(",", -1);

                    // startDtts, endDtts, param rawid, value, group
                    Long param_rawid = Long.parseLong(values[2]);
                    Timestamp beginDtts = new Timestamp(Long.parseLong(values[0]));
                    Timestamp endDtts = new Timestamp(Long.parseLong(values[1]));

                    pstmt.setLong(1, param_rawid);
                    pstmt.setTimestamp(2, beginDtts);
                    pstmt.setTimestamp(3, endDtts);

                    pstmt.setString(4, values[3]); // value
                    pstmt.setString(5, values[4]); // message group

                    pstmt.addBatch();
                    ++totalCount;
                }

                pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into PARAM_DIMENSION_TRX_PDM.", totalCount);

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
