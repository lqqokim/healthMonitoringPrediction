package com.bistel.pdm.datastore.jdbc.dao.pg;

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
public class EventTrxPostgreDao implements EventDataDao {
    private static final Logger log = LoggerFactory.getLogger(EventTrxPostgreDao.class);

    private static final String INSERT_SQL =
            "insert into eqp_event_trx_pdm (EQP_EVENT_MST_RAWID, EVENT_TYPE_CD, EVENT_DTTS) " +
                    "values (?,?,?) ";

    @Override
    public void storeRecords(List<ConsumerRecord<String, byte[]>> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int totalCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                    byte[] eventData = record.value();
                    String valueString = new String(eventData);
                    String[] values = valueString.split(",");
                    // time, event mst rawid, event type cd

                    pstmt.setLong(1, Long.parseLong(values[1])); //eqp_event_mst_rawid
                    pstmt.setString(2, values[2]); //event type cd (S,E)
                    pstmt.setTimestamp(3, new Timestamp(Long.parseLong(values[0])));

                    pstmt.addBatch();
                    ++totalCount;
                }

                pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into EQP_EVENT_TRX_PDM.", totalCount);

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
