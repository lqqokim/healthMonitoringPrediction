package com.bistel.pdm.datastore.jdbc.dao.postgres;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.FaultDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.List;

/**
 *
 */
public class FaultTrxPostgreDao implements FaultDataDao {
    private static final Logger log = LoggerFactory.getLogger(FaultTrxPostgreDao.class);

    private static final String INSERT_SQL =
            "insert into PARAM_FAULT_TRX_PDM " +
                    "(" +
                    " PARAM_MST_RAWID, " +
                    " PARAM_HEALTH_MST_RAWID, " +
                    " FAULT_TYPE_CD, " +
                    " FAULT_CLASS, " +
                    " VALUE, " +
                    " RULE_NAME, " +
                    " CONDITION, " +
                    " ALARM_SPEC, " +
                    " WARNING_SPEC, " +
                    " ALARM_DTTS " +
                    ") " +
                    "values " +
                    "(?,?,?,?,?,?,?,?,?,?)";

    @Override
    public void storeRecords(List<ConsumerRecord<String, byte[]>> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] features = record.value();
                    String valueString = new String(features);

                    // in : time, param_rawid, health_rawid, value, alarm type,
                    //      alarm_spec, warning_spec, fault_class, rule, condition
                    String[] values = valueString.split(",", -1);

                    Timestamp timestamp = new Timestamp(Long.parseLong(values[0]));
                    Long param_rawid = Long.parseLong(values[1]);
                    Long param_health_rawid = Long.parseLong(values[2]);

                    pstmt.setLong(1, param_rawid); //param mst rawid
                    pstmt.setLong(2, param_health_rawid);
                    pstmt.setString(3, values[4]); //fault type code
                    pstmt.setString(4, values[7]); //fault classifications
                    pstmt.setFloat(5, Float.parseFloat(values[3])); //value
                    pstmt.setString(6, values[8]); //rulename
                    pstmt.setString(7, values[9]); //condition
                    pstmt.setFloat(8, Float.parseFloat(values[5])); // alarm spec
                    pstmt.setFloat(9, Float.parseFloat(values[6])); // warning spec
                    pstmt.setTimestamp(10, timestamp);

                    pstmt.addBatch();
                    ++totalCount;
                }

                pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into PARAM_FAULT_TRX_PDM.", totalCount);

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
