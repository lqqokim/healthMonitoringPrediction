package com.bistel.pdm.datastore.jdbc.dao.ora;

import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.EventDataDao;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

/**
 *
 */
public class EventTrxDao implements EventDataDao {
    private static final Logger log = LoggerFactory.getLogger(EventTrxDao.class);

    private static final String INSERT_SQL =
            "insert into eqp_event_trx_pdm (RAWID, EQP_EVENT_MST_RAWID, EVENT_TYPE_CD, EVENT_DTTS) " +
                    "values (SEQ_EQP_EVENT_TRX_PDM.nextval,?,?,?) ";

    @Override
    public void storeRecord(ConsumerRecords<String, byte[]> records) {
        try (Connection conn = DataSource.getConnection()) {

            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

                int batchCount = 0;
                for (ConsumerRecord<String, byte[]> record : records) {
                    //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                    byte[] eventData = record.value();
                    String valueString = new String(eventData);
                    String[] values = valueString.split(",");
                    // time, event mst rawid, event type cd

                    pstmt.setLong(1, Long.parseLong(values[1])); //eqp_event_mst_rawid
                    pstmt.setFloat(2, Float.parseFloat(values[2])); //event type cd (S,E)
                    pstmt.setTimestamp(3, new Timestamp(Long.parseLong(values[0])));

                    pstmt.addBatch();
                    //log.debug("offset = " + record.offset() + " value = " + valueString);

                    if (++batchCount == 100) {
                        pstmt.executeBatch();
                        pstmt.clearBatch();
                        batchCount = 0;
                        log.debug("{} records are inserted into EQP_EVENT_TRX_PDM.", batchCount);
                    }
                }

                if (batchCount > 0) {
                    pstmt.executeBatch();
                    pstmt.clearBatch();
                    log.debug("{} records are inserted into EQP_EVENT_TRX_PDM.", batchCount);
                }
                conn.commit();

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
