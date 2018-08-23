package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.data.stream.*;
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
            "select e.rawid eqp_rawid, e.name eqp_name, e.model_name, " +
                    "p.rawid param_rawid, p.name param_name, p.param_type_cd, p.parse_index " +
                    "from eqp_mst_pdm e " +
                    "inner join param_mst_pdm p " +
                    "on e.rawid=p.eqp_mst_rawid " +
                    "where e.name=? ";

    public List<ParameterMaster> getParamMasterDataSet(String eqpId) throws SQLException {
        List<ParameterMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(PARAM_MASTER_DS_SQL)) {
                pst.setString(1, eqpId);

                log.debug("sql:{}", PARAM_MASTER_DS_SQL);

                try (ResultSet rs = pst.executeQuery();) {
                    while (rs.next()) {
                        ParameterMaster ds = new ParameterMaster();
                        ds.setEquipmentRawId(rs.getLong(1));
                        ds.setEquipmentName(rs.getString(2));
                        ds.setModelName(rs.getString(3));
                        ds.setParameterRawId(rs.getLong(4));
                        ds.setParameterName(rs.getString(5));
                        ds.setParameterType(rs.getString(6));
                        ds.setParamParseIndex(rs.getInt(7));

                        resultRows.add(ds);
                    }
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return resultRows;
    }


    private final static String PARAM_MASTER_DS_1_SQL =
            "select a.name area_name, e.name eqp_name, e.rawid eqp_rawid, " +
                    "    p.name param_name, p.parse_index, p.rawid param_id, p.param_type_cd, " +
                    "    c.rule_name, c.expression, c.expression_value, " +
                    "    s.spec_type, s.upper_alarm_spec, s.upper_warning_spec " +
                    "from area_mst_pdm a inner join eqp_mst_pdm e " +
                    "on a.rawid=e.area_mst_rawid " +
                    "and e.name=? " +
                    "inner join param_mst_pdm p " +
                    "on e.rawid=p.eqp_mst_rawid " +
                    "inner join eqp_spec_link_mst_pdm l " +
                    "on e.rawid=l.eqp_mst_rawid " +
                    "inner join conditional_spec_mst_pdm c " +
                    "on c.rawid=l.conditional_spec_mst_rawid " +
                    "left outer join param_spec_mst_pdm s " +
                    "on l.rawid=s.eqp_spec_link_mst_rawid " +
                    "and p.rawid=s.param_mst_rawid ";

//            "select " +
//                    "a.name area_name, e.name as eqp_name, e.rawid as eqp_rawid, " +
//                    "p.name as param_name, p.parse_index, p.rawid param_id, " +
//                    "s.alarm_spec, s.warning_spec, p.param_type_cd " +
//                    "from area_mst_pdm a inner join eqp_mst_pdm e " +
//                    "on a.rawid=e.area_mst_rawid " +
//                    "and e.name=? " +
//                    "inner join param_mst_pdm p " +
//                    "on e.rawid=p.eqp_mst_rawid " +
//                    "left outer join trace_spec_mst_pdm s " +
//                    "on p.rawid=s.param_mst_rawid ";

    public List<ParameterWithSpecMaster> getParamWithSpecMasterDataSet(String eqpId) throws SQLException {
        List<ParameterWithSpecMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(PARAM_MASTER_DS_1_SQL)) {
                pst.setString(1, eqpId);

                log.debug("sql:{}", PARAM_MASTER_DS_1_SQL);

                try (ResultSet rs = pst.executeQuery()) {
                    while (rs.next()) {
                        ParameterWithSpecMaster ds = new ParameterWithSpecMaster();
                        ds.setAreaName(rs.getString(1));
                        ds.setEquipmentName(rs.getString(2));
                        ds.setEquipmentRawId(rs.getLong(3));
                        ds.setParameterName(rs.getString(4));
                        ds.setParamParseIndex(rs.getInt(5));
                        ds.setParameterRawId(rs.getLong(6));
                        ds.setParameterType(rs.getString(7));
                        ds.setRuleName(rs.getString(8));
                        ds.setExpression(rs.getString(9));
                        ds.setExpressionValue(rs.getString(10));
                        ds.setSpecType(rs.getString(11));

                        Float uas = rs.getFloat(12);
                        if (rs.wasNull()) {
                            uas = null;
                        }
                        ds.setUpperAlarmSpec(uas);

                        Float uws = rs.getFloat(13);
                        if (rs.wasNull()) {
                            uws = null;
                        }
                        ds.setUpperWarningSpec(uws);

//                    Float t = rs.getFloat(14);
//                    if(rs.wasNull()){
//                        t = null;
//                    }
//                    ds.setTarget(t);
//
//                    Float las = rs.getFloat(15);
//                    if(rs.wasNull()){
//                        las = null;
//                    }
//                    ds.setLowerAlarmSpec(las);
//
//                    Float lws = rs.getFloat(16);
//                    if(rs.wasNull()){
//                        lws = null;
//                    }
//                    ds.setLowerWarningSpec(lws);

                        resultRows.add(ds);
                    }
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return resultRows;
    }

    private final static String EQP_MASTER_DS_SQL =
            "select " +
                    "area.name area_name, eqp.name as eqp_name, eqp.rawid " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "";

    public List<EquipmentMaster> getEqpMasterDataSet() throws SQLException {
        List<EquipmentMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(EQP_MASTER_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", EQP_MASTER_DS_SQL);

            while (rs.next()) {
                EquipmentMaster ds = new EquipmentMaster();
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

    private final static String EQP_MASTER_DS_1_SQL =
            "select " +
                    "area.name area_name, eqp.name as eqp_name, eqp.rawid " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "and eqp.name=? ";

    public EquipmentMaster getEqpMasterDataSet(String eqpId) throws SQLException {
        EquipmentMaster eqpMaster = new EquipmentMaster();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_MASTER_DS_1_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_MASTER_DS_1_SQL);

                    while (rs.next()) {
                        eqpMaster.setAreaName(rs.getString(1));
                        eqpMaster.setEquipmentName(rs.getString(2));
                        eqpMaster.setEqpRawId(rs.getLong(3));
                    }
                }
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return eqpMaster;
    }

    private final static String EQP_EVENT_MASTER_DS_SQL =
            "select " +
                    "area.name area_name, " +
                    "eqp.name as eqp_name, " +
                    "eqp.rawid, " +
                    "event.rawid as event_rawid, " +
                    "event.event_name, " +
                    "event.event_type_cd, " +
                    "param.name as param_name, " +
                    "event.condition, " +
                    "event.process_yn, " +
                    "param.parse_index," +
                    "event.time_interval_yn," +
                    "event.interval_time_ms " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp, param_mst_pdm param, eqp_event_mst_pdm event " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "and eqp.rawid=param.eqp_mst_rawid " +
                    "and param.rawid=event.param_mst_rawid " +
                    "and eqp.rawid=event.eqp_mst_rawid " +
                    " ";

    public List<EventMaster> getEventMasterDataSet() throws SQLException {
        List<EventMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(EQP_EVENT_MASTER_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", EQP_EVENT_MASTER_DS_SQL);

            while (rs.next()) {
                EventMaster ds = new EventMaster();
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
                ds.setTimeIntervalYn(rs.getString(11));
                ds.setIntervalTimeMs(rs.getLong(12));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }

    private final static String EQP_EVENT_MASTER_DS_1_SQL =
            "select " +
                    "area.name area_name, " +
                    "eqp.name as eqp_name, " +
                    "eqp.rawid, " +
                    "event.rawid as event_rawid, " +
                    "event.event_name, " +
                    "event.event_type_cd, " +
                    "param.name as param_name, " +
                    "event.condition, " +
                    "event.process_yn, " +
                    "param.parse_index, " +
                    "event.time_interval_yn," +
                    "event.interval_time_ms " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp, param_mst_pdm param, eqp_event_mst_pdm event " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "and eqp.rawid=param.eqp_mst_rawid " +
                    "and param.rawid=event.param_mst_rawid " +
                    "and eqp.rawid=event.eqp_mst_rawid " +
                    "and eqp.name=? ";

    public List<EventMaster> getEventMasterDataSet(String eqpId) throws SQLException {
        List<EventMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_EVENT_MASTER_DS_1_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_EVENT_MASTER_DS_1_SQL);

                    while (rs.next()) {
                        EventMaster ds = new EventMaster();
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
                        ds.setTimeIntervalYn(rs.getString(11));
                        ds.setIntervalTimeMs(rs.getLong(12));

                        resultRows.add(ds);
                    }
                }
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }

        return resultRows;
    }

    private final static String EQP_EXPR_PARAM_MASTER_DS_SQL =
            "select distinct e.rawid eqp_rawid, e.name eqp_name, cs.rule_name, p.name param_name, p.parse_index " +
                    "from eqp_mst_pdm e " +
                    "inner join param_mst_pdm p " +
                    "on e.rawid=p.eqp_mst_rawid " +
                    "inner join ( " +
                    "select s.rule_name, regexp_substr(expression_value,'[^,]+', 1, level) param_name " +
                    "from conditional_spec_mst_pdm s " +
                    "inner join eqp_spec_link_mst_pdm l " +
                    "on s.rawid=l.conditional_spec_mst_rawid " +
                    "inner join eqp_mst_pdm e " +
                    "on e.rawid=l.eqp_mst_rawid " +
                    "connect by regexp_substr(expression_value, '[^,]+', 1, level) is not null " +
                    ") cs " +
                    "on cs.param_name=p.name " +
                    "where e.name=? ";

    public List<ExpressionParamMaster> getExprParamMasterDataSet(String eqpId) throws SQLException {
        List<ExpressionParamMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_EXPR_PARAM_MASTER_DS_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_EXPR_PARAM_MASTER_DS_SQL);

                    while (rs.next()) {
                        ExpressionParamMaster ds = new ExpressionParamMaster();
                        ds.setEquipmentRawId(rs.getLong(1));
                        ds.setEqpName(rs.getString(2));
                        ds.setRuleName(rs.getString(3));
                        ds.setParameterName(rs.getString(4));
                        ds.setParamParseIndex(rs.getInt(5));

                        resultRows.add(ds);
                    }
                }
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }

        return resultRows;
    }

    private final static String EQP_CONDITIONAL_SPEC_MASTER_DS_SQL =
            "select e.rawid eqp_mst_rawid, e.name as eqp_name, s.rule_name, " +
                    "    s.expression, s.expression_value, l.ordering " +
                    "from eqp_mst_pdm e " +
                    "inner join eqp_spec_link_mst_pdm l " +
                    "on e.rawid=l.eqp_mst_rawid " +
                    "inner join conditional_spec_mst_pdm s " +
                    "on s.rawid=l.conditional_spec_mst_rawid " +
                    "where e.name=? " +
                    "order by l.ordering ";

    public List<ConditionalSpecMaster> getConditionalSpecMasterDataSet(String eqpId) throws SQLException {
        List<ConditionalSpecMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_CONDITIONAL_SPEC_MASTER_DS_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_CONDITIONAL_SPEC_MASTER_DS_SQL);

                    while (rs.next()) {
                        ConditionalSpecMaster ds = new ConditionalSpecMaster();
                        ds.setEqpRawId(rs.getLong(1));
                        ds.setEqpName(rs.getString(2));
                        ds.setRuleName(rs.getString(3));
                        ds.setExpression(rs.getString(4));
                        ds.setExpressionValue(rs.getString(5));
                        ds.setOrdering(rs.getInt(6));

                        resultRows.add(ds);
                    }
                }
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
        }

        return resultRows;
    }
}
