package com.bistel.pdm.datastore.jdbc.dao.oracle;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.FaultDataDao;
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
public class FaultTrxDao implements FaultDataDao {
    private static final Logger log = LoggerFactory.getLogger(FaultTrxDao.class);

    private static final String INSERT_SQL =
            "insert into ALARM_TRX_PDM " +
                    "(RAWID, " +
                    " PARAM_MST_RAWID, " +
                    " PARAM_HEALTH_MST_RAWID, " +
                    " ALARM_TYPE_CD, " +
                    " VALUE, " +
                    " FAULT_CLASS, " +
                    " ALARM_SPEC, " +
                    " WARNING_SPEC, " +
                    " CONDITION, " +
                    " RULE_NAME, " +
                    " ALARM_DTTS) " +
                    "values (seq_alarm_trx_pdm.nextval, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    @Override
    public void storeRecords(List<ConsumerRecord<String, byte[]>> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] features = record.value();
                    String valueString = new String(features);

                    String[] values = valueString.split(",");
                    // time, param_rawid, health_rawid, value, alarm type, alarm_spec, warning_spec, fault_class, rulename, condition

                    Timestamp timestamp = new Timestamp(Long.parseLong(values[0]));
                    Long param_rawid = Long.parseLong(values[1]);
                    Long param_health_rawid = Long.parseLong(values[2]);

                    pstmt.setLong(1, param_rawid); //param mst rawid
                    pstmt.setLong(2, param_health_rawid);
                    pstmt.setString(3, values[4]); //alarm type code
                    pstmt.setFloat(4, Float.parseFloat(values[3])); //value
                    pstmt.setString(5, values[7]); //fault classifications
                    pstmt.setFloat(6, Float.parseFloat(values[5])); // alarm spec
                    pstmt.setFloat(7, Float.parseFloat(values[6])); // warning spec
                    pstmt.setString(8, values[9]); //condition
                    pstmt.setString(9, values[8]); //rulename
                    pstmt.setTimestamp(10, timestamp);

                    pstmt.addBatch();
                    ++totalCount;
                }

                pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into ALARM_TRX_PDM.", totalCount);

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
