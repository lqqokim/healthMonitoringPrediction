package com.bistel.pdm.datastore.jdbc.dao.ora;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorTraceDataDao;
import com.bistel.pdm.datastore.model.SensorTraceData;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.List;

/**
 *
 */
public class SensorTraceTrxDao implements SensorTraceDataDao {
    private static final Logger log = LoggerFactory.getLogger(SensorTraceTrxDao.class);

    private static final String TRX_SEQ_SQL = "select SEQ_TRACE_TRX_PDM.nextval from DUAL";

    private static final String INSERT_SQL =
            "insert into trace_trx_pdm (RAWID, PARAM_MST_RAWID, VALUE, ALARM_SPEC, " +
                    "WARNING_SPEC, EVENT_DTTS, RESERVED_COL1, RESERVED_COL2, RESERVED_COL3, " +
                    "RESERVED_COL4, RESERVED_COL5) " +
                    "values (SEQ_TRACE_TRX_PDM.nextval,?,?,?,?,?,?,?,?,?,?,?)";

    private static final String INSERT_SQL1 =
            "insert into trace_trx_pdm (RAWID, PARAM_MST_RAWID, VALUE, RPM, ALARM_SPEC, " +
                    "WARNING_SPEC, EVENT_DTTS, RESERVED_COL1, RESERVED_COL2, RESERVED_COL3, " +
                    "RESERVED_COL4, RESERVED_COL5) " +
                    "values (?,?,?,?,?,?,?,?,?,?,?,?)";

    public SensorTraceTrxDao() {

    }

    @Override
    public Long getTraceRawId() throws SQLException {
        Long trxRawId = Long.MIN_VALUE;
        try (Connection conn = DataSource.getConnection();
             PreparedStatement psrawid = conn.prepareStatement(TRX_SEQ_SQL)) {

            ResultSet rs = psrawid.executeQuery();
            if (rs.next()) {
                trxRawId = rs.getLong(1);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return trxRawId;
    }

    @Override
    public void storeRecord(ConsumerRecords<String, byte[]> records) {
        try (Connection conn = DataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

            conn.setAutoCommit(false);

            for (ConsumerRecord<String, byte[]> record : records) {
                //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                byte[] sensorData = record.value();
                String valueString = new String(sensorData);
                String[] values = valueString.split(",");
                // paramRawid
                // value
                // alarm spec
                // warning spec
                // time
                // rsd01~05

                pstmt.setLong(1, Long.parseLong(values[0])); //param rawid
                pstmt.setFloat(2, Float.parseFloat(values[1])); //value

                //pstmt.setNull(3, Types.INTEGER); //rpm

                if (values[2] != null && values[2].length() > 0) {
                    pstmt.setFloat(3, Float.parseFloat(values[2])); //alarm spec
                } else {
                    pstmt.setNull(3, Types.FLOAT);
                }

                if (values[3] != null && values[3].length() > 0) {
                    pstmt.setFloat(4, Float.parseFloat(values[3])); //warning spec
                } else {
                    pstmt.setNull(4, Types.FLOAT);
                }
                pstmt.setTimestamp(5, new Timestamp(Long.parseLong(values[4])));

                //reserved columns
                if (values.length > 5) {
                    pstmt.setString(6, values[5]); //location
                }

                if (values.length > 6) {
                    pstmt.setString(7, values[6]);
                }

                if (values.length > 7) {
                    pstmt.setString(8, values[7]);
                }

                if (values.length > 8) {
                    pstmt.setString(9, values[8]);
                }

                if (values.length > 9) {
                    pstmt.setString(10, values[9]);
                }

                pstmt.addBatch();
                //log.debug("offset = " + record.offset() + " value = " + valueString);
            }

            try {
                int[] ret = pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted into TRACE_TRX_PDM.", ret.length);
            } catch (Exception e) {
                conn.rollback();
                log.error(e.getMessage(), e);
            }

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public void storeRecord(List<Pair<Long, SensorTraceData>> records) throws SQLException {
        try (Connection conn = DataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL1)) {

            conn.setAutoCommit(false);

            for (Pair<Long, SensorTraceData> record : records) {
                //log.debug("offset={}, key={}, value={}", record.offset(), record.key(), record.value());

                SensorTraceData sensorData = record.getSecond();
                pstmt.setLong(1, record.getFirst());
                pstmt.setLong(2, sensorData.getParamMstRawid());
                pstmt.setFloat(3, sensorData.getValue());

                if (sensorData.getRpm() != null) {
                    pstmt.setFloat(4, sensorData.getRpm());
                } else {
                    pstmt.setNull(4, Types.INTEGER);
                }

                if (sensorData.getAlarmSpec() != null) {
                    pstmt.setFloat(5, sensorData.getAlarmSpec());
                } else {
                    pstmt.setNull(5, Types.FLOAT);
                }

                if (sensorData.getWarningSpec() != null) {
                    pstmt.setFloat(6, sensorData.getWarningSpec());
                } else {
                    pstmt.setNull(6, Types.FLOAT);
                }
                pstmt.setTimestamp(7, new Timestamp(sensorData.getEventDtts()));

                //reserved columns
                pstmt.setString(8, sensorData.getReservedCol1());
                pstmt.setString(9, sensorData.getReservedCol2());
                pstmt.setString(10, sensorData.getReservedCol3());
                pstmt.setString(11, sensorData.getReservedCol4());
                pstmt.setString(12, sensorData.getReservedCol5());

                pstmt.addBatch();
            }

            int[] ret = pstmt.executeBatch();
            conn.commit();
            log.debug("{} records are inserted into TRACE_TRX_PDM.", ret.length);

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }
    }

}
