package com.bistel.pdm.datastore.jdbc.dao.oracle;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.EventDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

/**
 *
 */
public class EventTrxDao implements EventDataDao {
    private static final Logger log = LoggerFactory.getLogger(EventTrxDao.class);

    private static final String INSERT_SQL =
            "insert into PROCESS_GROUP_TRX_PDM " +
                    "(RAWID, " +
                    "PROCESS_GROUP_MST_RAWID, " +
                    "PROCESS_CONTEXT, " +
                    "START_EVENT_NAME, " +
                    "END_EVENT_NAME, " +
                    "START_DTTS, " +
                    "END_DTTS) " +
                    "values " +
                    "(SEQ_PROCESS_GROUP_TRX_PDM.nextval,?,?,?,?,?,?) ";

    @Override
    public void storeRecords(List<ConsumerRecord<String, byte[]>> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    byte[] eventData = record.value();
                    String valueString = new String(eventData);

                    //in : process_group_rawid, event_id, start_event_name, end_event_name, start epoch, end epoch
                    String[] values = valueString.split(",");

                    Timestamp start_ts = new Timestamp(Long.parseLong(values[4]));
                    Timestamp end_ts = new Timestamp(Long.parseLong(values[5]));

                    pstmt.setLong(1, Long.parseLong(values[0])); //process_group_mst_rawid
                    pstmt.setString(2, values[4]); //process context
                    pstmt.setString(3, values[2]);
                    pstmt.setString(4, values[3]);
                    pstmt.setTimestamp(5, start_ts);
                    pstmt.setTimestamp(6, end_ts);

                    pstmt.addBatch();
                    ++totalCount;
                }

                pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into PROCESS_GROUP_TRX_PDM.", totalCount);

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
