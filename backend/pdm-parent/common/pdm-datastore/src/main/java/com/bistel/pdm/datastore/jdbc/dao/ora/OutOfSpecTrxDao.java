package com.bistel.pdm.datastore.jdbc.dao.ora;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.OutOfSpecDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

public class OutOfSpecTrxDao implements OutOfSpecDataDao {
    private static final Logger log = LoggerFactory.getLogger(OutOfSpecTrxDao.class);

    private static final String INSERT_SQL =
            "insert into ALARM_TRX_PDM " +
                    "(RAWID, PARAM_MST_RAWID, ALARM_TYPE_CD, VALUE, ALARM_SPEC, WARNING_SPEC, ALARM_DTTS) " +
                    "values (seq_alarm_trx_pdm.nextval, ?, ?, ?, ?, ?, ?)";


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

                Long param_rawid = Long.parseLong(values[1]);
                Timestamp timestamp = new Timestamp(Long.parseLong(values[0]));

                //time, paramRawId, feature, value, alarm type, warning spec, alarm spec
                pstmt.setLong(1, param_rawid); //param mst rawid
                pstmt.setString(2, values[4]); //alarm type
                pstmt.setFloat(3, Float.parseFloat(values[3]));
                pstmt.setFloat(4, Float.parseFloat(values[5]));
                pstmt.setFloat(5, Float.parseFloat(values[6]));
                pstmt.setTimestamp(6, timestamp);

                pstmt.addBatch();
            }

            try {
                int[] ret = pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into ALARM_TRX_PDM.", ret.length);
            } catch (Exception e) {
                conn.rollback();
                log.error(e.getMessage(), e);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }
    }
}
