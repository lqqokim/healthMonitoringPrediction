package com.bistel.pdm.datastore.jdbc.dao.pg;

import com.bistel.pdm.common.collection.Pair;
import com.bistel.pdm.datastore.jdbc.DataSource;
import com.bistel.pdm.datastore.jdbc.dao.SensorRawDataDao;
import com.bistel.pdm.datastore.model.SensorRawData;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.sql.*;
import java.util.Map;

/**
 *
 */
public class SensorTraceRawTrxPostgreDao implements SensorRawDataDao {
    private static final Logger log = LoggerFactory.getLogger(SensorTraceRawTrxPostgreDao.class);


    private static final String INSERT_SQL =
            "insert into trace_raw_trx_pdm (PARAM_MST_RAWID, TRACE_TRX_RAWID, DATA_TYPE_CD, MAX_FREQ, FREQ_COUNT, " +
                    "RPM, SAMPLING_TIME, BINARY_DATA, EVENT_DTTS, RESERVED_COL1, RESERVED_COL2, " +
                    "RESERVED_COL3, RESERVED_COL4, RESERVED_COL5) " +
                    "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    @Override
    public void storeRecord(Map<String, Pair<Long, SensorRawData>> records) {
        try (Connection conn = DataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

            conn.setAutoCommit(false);

            for (String key : records.keySet()) {
                Pair<Long, SensorRawData> row = records.get(key);
                Long RawId = row.getFirst();
                SensorRawData sensorData = row.getSecond();

                String dataTypeCode = key.split(",")[0];

                pstmt.setLong(1, sensorData.getParamMstRawid());
                pstmt.setLong(2, RawId);
                pstmt.setString(3, dataTypeCode);

                if (sensorData.getMaxFreq() != null) {
                    pstmt.setInt(4, sensorData.getMaxFreq());
                } else {
                    pstmt.setNull(4, Types.INTEGER);
                }

                if (sensorData.getFreqCount() != null) {
                    pstmt.setInt(5, sensorData.getFreqCount());
                } else {
                    pstmt.setNull(5, Types.INTEGER);
                }

                if (sensorData.getRpm() != null) {
                    pstmt.setFloat(6, sensorData.getRpm());
                } else {
                    pstmt.setNull(6, Types.INTEGER);
                }

                if (sensorData.getSamplingTime() != null) {
                    pstmt.setFloat(7, sensorData.getSamplingTime());
                } else {
                    pstmt.setNull(7, Types.FLOAT);
                }

                if (dataTypeCode.equalsIgnoreCase("T")) {
                    InputStream byteStream = new ByteArrayInputStream(convertDoubleArrayToByteArray(sensorData.getTimewaveData()));
                    pstmt.setBinaryStream(8, byteStream);
                } else {
                    InputStream byteStream = new ByteArrayInputStream(convertDoubleArrayToByteArray(sensorData.getFrequencyData()));
                    pstmt.setBinaryStream(8, byteStream);
                }

                pstmt.setTimestamp(9, new Timestamp(sensorData.getEventDtts()));

                //reserved columns
                pstmt.setString(10, sensorData.getReservedCol1());
                pstmt.setString(11, sensorData.getReservedCol2());
                pstmt.setString(12, sensorData.getReservedCol3());
                pstmt.setString(13, sensorData.getReservedCol4());
                pstmt.setString(14, sensorData.getReservedCol5());

                pstmt.addBatch();
            }

            try {
                int[] ret = pstmt.executeBatch();
                conn.commit();
                log.debug("{} records are inserted.", ret.length);
            } catch (Exception e) {
                conn.rollback();
                log.error(e.getMessage(), e);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }
    }

    private byte[] convertDoubleArrayToByteArray(double[] data) {
        if (data == null) return null;
        // ----------
        byte[] byts = new byte[data.length * Double.BYTES];
        for (int i = 0; i < data.length; i++)
            System.arraycopy(convertDoubleToByteArray(data[i]), 0, byts, i * Double.BYTES, Double.BYTES);
        return byts;
    }

    private byte[] convertDoubleToByteArray(double number) {
        ByteBuffer byteBuffer = ByteBuffer.allocate(Double.BYTES);
        byteBuffer.putDouble(number);
        return byteBuffer.array();
    }
}
