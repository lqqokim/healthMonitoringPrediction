package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.common.json.EquipmentMasterDataSet;
import com.bistel.pdm.common.json.EventMasterDataSet;
import com.bistel.pdm.common.json.ParameterMasterDataSet;
import com.bistel.pdm.serving.jdbc.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 */
public class StreamingMasterDataDao {
    private static final Logger log = LoggerFactory.getLogger(StreamingMasterDataDao.class);

    private final static String PARAM_MASTER_DS_SQL =
            "select " +
                    "area.name area_name, eqp.name as eqp_name, " +
                    "param.name as param_name, param.parse_index, param.rawid param_id, " +
                    "spec.upper_alarm_spec, spec.upper_warning_spec, spec.target, " +
                    "spec.lower_alarm_spec, spec.lower_warning_spec " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp, param_mst_pdm param, trace_spec_mst_pdm spec " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "and eqp.rawid=param.eqp_mst_rawid " +
                    "and param.rawid=spec.param_mst_rawid " +
                    "";

    public List<ParameterMasterDataSet> getParamMasterDataSet() throws SQLException {
        List<ParameterMasterDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(PARAM_MASTER_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", PARAM_MASTER_DS_SQL);

            while (rs.next()) {
                ParameterMasterDataSet ds = new ParameterMasterDataSet();
                ds.setAreaName(rs.getString(1));
                ds.setEquipmentName(rs.getString(2));
                ds.setParameterName(rs.getString(3));
                ds.setParamParseIndex(rs.getInt(4));
                ds.setParameterRawId(rs.getLong(5));

                ds.setUpperAlarmSpec(rs.getFloat(6));
                ds.setUpperWarningSpec(rs.getFloat(7));
                ds.setTarget(rs.getFloat(8));
                ds.setLowerAlarmSpec(rs.getFloat(9));
                ds.setLowerWarningSpec(rs.getFloat(10));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }

    private final static String EQP_MASTER_DS_SQL =
            "select " +
                    "area.name area_name, eqp.name as eqp_name, eqp.rawid " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "";

    public List<EquipmentMasterDataSet> getEqpMasterDataSet() throws SQLException {
        List<EquipmentMasterDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(EQP_MASTER_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", EQP_MASTER_DS_SQL);

            while (rs.next()) {
                EquipmentMasterDataSet ds = new EquipmentMasterDataSet();
                ds.setAreaName(rs.getString(1));
                ds.setEquipmentName(rs.getString(2));
                ds.setEqpRawId(rs.getLong(3));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }

    private final static String EQP_EVENT_MASTER_DS_SQL =
            "select " +
                    "area.name area_name, eqp.name as eqp_name, eqp.rawid, event.rawid as event_rawid, " +
                    "event.event_name, event.event_type_cd, param.name as param_name, " +
                    "event.condition, event.process_yn, param.parse_index " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp, param_mst_pdm param, eqp_event_mst_pdm event " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "and eqp.rawid=param.eqp_mst_rawid " +
                    "and param.rawid=event.param_mst_rawid " +
                    "and eqp.rawid=event.eqp_mst_rawid " +
                    " ";

    public List<EventMasterDataSet> getEventMasterDataSet() throws SQLException {
        List<EventMasterDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(EQP_EVENT_MASTER_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", EQP_EVENT_MASTER_DS_SQL);

            while (rs.next()) {
                EventMasterDataSet ds = new EventMasterDataSet();
                ds.setAreaName(rs.getString(1));
                ds.setEquipmentName(rs.getString(2));
                ds.setEqpRawId(rs.getLong(3));
                ds.setEventRawId(rs.getLong(4));
                ds.setEventName(rs.getString(5));
                ds.setEventTypeCD(rs.getString(6));
                ds.setParameterName(rs.getString(7));
                ds.setCondition(rs.getString(8));
                ds.setProcessYN(rs.getString(9));
                ds.setParamParseIndex(rs.getInt(10));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }
}
