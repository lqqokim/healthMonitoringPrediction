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
                    "p.rawid param_rawid, p.name param_name, p.param_type_cd, p.svid, p.data_type_cd, p.timewave_type_cd, " +
                    "p.collect_yn, p.summary_yn " +
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
                        ds.setEqpRawId(rs.getLong(1));
                        ds.setEquipmentName(rs.getString(2));
                        ds.setModelName(rs.getString(3));
                        ds.setId(rs.getLong(4));
                        ds.setParameterName(rs.getString(5));
                        ds.setParamTypeCode(rs.getString(6));
                        ds.setSvid(rs.getString(7));
                        ds.setDataTypeCode(rs.getString(8));
                        ds.setTimewaveTypeCode(rs.getString(9));
                        ds.setCollectYN(rs.getString(10));
                        ds.setSummaryYN(rs.getString(11));

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
            "select " +
                    "    b.area_name, b.eqp_name, b.eqp_rawid, " +
                    "    b.param_name, b.svid, b.param_id, b.param_type_cd, " +
                    "    a.rule_name, a.expression, a.expression_value, " +
                    "    a.alarm_spec, a.warning_spec, a.condition, b.data_type " +
                    "from " +
                    "( " +
                    "    select " +
                    "        e.name eqp_name, e.rawid eqp_rawid, m.param_name, " +
                    "        c.rule_name, c.expression, c.expression_value, " +
                    "        COALESCE(s.upper_alarm_spec, m.upper_alarm_spec) as alarm_spec, " +
                    "        COALESCE(s.upper_warning_spec, m.upper_warning_spec) as warning_spec, " +
                    "        c.condition " +
                    "    from eqp_mst_pdm e inner join eqp_spec_link_mst_pdm l " +
                    "    on e.rawid=l.eqp_mst_rawid and e.name=? " +
                    "    inner join conditional_spec_mst_pdm c " +
                    "    on c.rawid=l.conditional_spec_mst_rawid " +
                    "    inner join model_param_spec_mst_pdm m " +
                    "    on c.rawid=m.conditional_spec_mst_rawid " +
                    "    left outer join param_spec_mst_pdm s " +
                    "    on l.rawid=s.eqp_spec_link_mst_rawid " +
                    ") a " +
                    "right outer join " +
                    "( " +
                    "    select a.name area_name, e.name eqp_name, e.rawid eqp_rawid, " +
                    "        p.name param_name, p.svid, p.rawid param_id, p.param_type_cd, p.data_type " +
                    "    from area_mst_pdm a inner join eqp_mst_pdm e " +
                    "    on a.rawid=e.area_mst_rawid and e.name=? " +
                    "    inner join param_mst_pdm p " +
                    "    on e.rawid=p.eqp_mst_rawid " +
                    ") b " +
                    "on a.eqp_rawid=b.eqp_rawid and a.param_name=b.param_name ";

    public List<ParameterWithSpecMaster> getParamWithSpecMasterDataSet(String eqpId) throws SQLException {
        List<ParameterWithSpecMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(PARAM_MASTER_DS_1_SQL)) {
                pst.setString(1, eqpId);
                pst.setString(2, eqpId);

                log.debug("sql:{}", PARAM_MASTER_DS_1_SQL);

                try (ResultSet rs = pst.executeQuery()) {
                    while (rs.next()) {
                        ParameterWithSpecMaster ds = new ParameterWithSpecMaster();
                        ds.setAreaName(rs.getString(1));
                        ds.setEquipmentName(rs.getString(2));
                        ds.setEquipmentRawId(rs.getLong(3));
                        ds.setParameterName(rs.getString(4));
                        ds.setSvid(rs.getString(5));
                        ds.setParameterRawId(rs.getLong(6));
                        ds.setParameterType(rs.getString(7));
                        ds.setRuleName(rs.getString(8));
                        ds.setExpression(rs.getString(9));
                        ds.setExpressionValue(rs.getString(10));

                        Float uas = rs.getFloat(11);
                        if (rs.wasNull()) {
                            uas = null;
                        }
                        ds.setUpperAlarmSpec(uas);

                        Float uws = rs.getFloat(12);
                        if (rs.wasNull()) {
                            uws = null;
                        }
                        ds.setUpperWarningSpec(uws);

                        ds.setCondition(rs.getString(13));
                        ds.setDataType(rs.getString(14));

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
                ds.setId(rs.getLong(3));

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
                        eqpMaster.setId(rs.getLong(3));
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

//    private final static String EQP_EVENT_MASTER_DS_SQL =
//            "select " +
//                    "area.name area_name, " +
//                    "eqp.name as eqp_name, " +
//                    "eqp.rawid, " +
//                    "event.rawid as event_rawid, " +
//                    "event.event_name, " +
//                    "event.event_type_cd, " +
//                    "param.name as param_name, " +
//                    "event.condition, " +
//                    "event.process_yn, " +
//                    "param.parse_index, " +
//                    "event.time_interval_yn, " +
//                    "event.interval_time_ms, " +
//                    "event.timeout," +
//                    "param.rawid " +
//                    "from area_mst_pdm area, eqp_mst_pdm eqp, param_mst_pdm param, eqp_event_mst_pdm event " +
//                    "where area.rawid=eqp.area_mst_rawid " +
//                    "and eqp.rawid=param.eqp_mst_rawid " +
//                    "and param.rawid=event.param_mst_rawid " +
//                    "and eqp.rawid=event.eqp_mst_rawid " +
//                    " ";
//
//    public List<EventMaster> getEventMasterDataSet() throws SQLException {
//        List<EventMaster> resultRows = new ArrayList<>();
//
//        try (Connection conn = DataSource.getConnection();
//             PreparedStatement pst = conn.prepareStatement(EQP_EVENT_MASTER_DS_SQL);
//             ResultSet rs = pst.executeQuery()) {
//
//            log.debug("sql:{}", EQP_EVENT_MASTER_DS_SQL);
//
//            while (rs.next()) {
//                EventMaster ds = new EventMaster();
//                ds.setAreaName(rs.getString(1));
//                ds.setEquipmentName(rs.getString(2));
//                ds.setEqpRawId(rs.getLong(3));
//                ds.setEventRawId(rs.getLong(4));
//                ds.setEventName(rs.getString(5));
//                ds.setEventTypeCD(rs.getString(6));
//                ds.setParameterName(rs.getString(7));
//                ds.setCondition(rs.getString(8));
//                ds.setProcessYN(rs.getString(9));
//                ds.setParamParseIndex(rs.getInt(10));
//                ds.setTimeIntervalYn(rs.getString(11));
//                ds.setIntervalTimeMs(rs.getLong(12));
//                ds.setTimeoutMs(rs.getLong(13));
//                ds.setParamRawId(rs.getLong(14));
//
//                resultRows.add(ds);
//            }
//        } catch (SQLException e) {
//            log.error(e.getMessage(), e);
//            throw e;
//        }
//
//        return resultRows;
//    }
//
//    private final static String EQP_EVENT_MASTER_DS_1_SQL =
//            "select " +
//                    "area.name area_name, " +
//                    "eqp.name as eqp_name, " +
//                    "eqp.rawid, " +
//                    "event.rawid as event_rawid, " +
//                    "event.event_name, " +
//                    "event.event_type_cd, " +
//                    "param.name as param_name, " +
//                    "event.condition, " +
//                    "event.process_yn, " +
//                    "param.parse_index, " +
//                    "event.time_interval_yn," +
//                    "event.interval_time_ms," +
//                    "event.timeout, " +
//                    "param.rawid " +
//                    "from area_mst_pdm area, eqp_mst_pdm eqp, param_mst_pdm param, eqp_event_mst_pdm event " +
//                    "where area.rawid=eqp.area_mst_rawid " +
//                    "and eqp.rawid=param.eqp_mst_rawid " +
//                    "and param.rawid=event.param_mst_rawid " +
//                    "and eqp.rawid=event.eqp_mst_rawid " +
//                    "and eqp.name=? ";
//
//    public List<EventMaster> getEventMasterDataSet(String eqpId) throws SQLException {
//        List<EventMaster> resultRows = new ArrayList<>();
//
//        try (Connection conn = DataSource.getConnection()) {
//            try (PreparedStatement pst = conn.prepareStatement(EQP_EVENT_MASTER_DS_1_SQL)) {
//                pst.setString(1, eqpId);
//
//                try (ResultSet rs = pst.executeQuery()) {
//                    log.debug("sql:{}", EQP_EVENT_MASTER_DS_1_SQL);
//
//                    while (rs.next()) {
//                        EventMaster ds = new EventMaster();
//                        ds.setAreaName(rs.getString(1));
//                        ds.setEquipmentName(rs.getString(2));
//                        ds.setEqpRawId(rs.getLong(3));
//                        ds.setEventRawId(rs.getLong(4));
//                        ds.setEventName(rs.getString(5));
//                        ds.setEventTypeCD(rs.getString(6));
//                        ds.setParameterName(rs.getString(7));
//                        ds.setCondition(rs.getString(8));
//                        ds.setProcessYN(rs.getString(9));
//                        ds.setParamParseIndex(rs.getInt(10));
//                        ds.setTimeIntervalYn(rs.getString(11));
//                        ds.setIntervalTimeMs(rs.getLong(12));
//                        ds.setTimeoutMs(rs.getLong(13));
//                        ds.setParamRawId(rs.getLong(14));
//
//                        resultRows.add(ds);
//                    }
//                }
//            }
//        } catch (SQLException e) {
//            log.error(e.getMessage(), e);
//        }
//
//        return resultRows;
//    }

    private final static String EQP_EXPR_PARAM_MASTER_DS_SQL =
            "select distinct e.rawid eqp_rawid, e.name eqp_name, cs.rule_name, p.name param_name, p.svid " +
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

    public List<SpecRuleExpressionMaster> getExprParamMasterDataSet(String eqpId) throws SQLException {
        List<SpecRuleExpressionMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_EXPR_PARAM_MASTER_DS_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_EXPR_PARAM_MASTER_DS_SQL);

                    while (rs.next()) {
                        SpecRuleExpressionMaster ds = new SpecRuleExpressionMaster();
                        ds.setEquipmentRawId(rs.getLong(1));
                        ds.setEquipmentName(rs.getString(2));
                        ds.setRuleName(rs.getString(3));
                        ds.setParameterName(rs.getString(4));
                        ds.setSvid(rs.getString(5));

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

    public List<ConditionalSpecRuleMaster> getConditionalSpecMasterDataSet(String eqpId) throws SQLException {
        List<ConditionalSpecRuleMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_CONDITIONAL_SPEC_MASTER_DS_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_CONDITIONAL_SPEC_MASTER_DS_SQL);

                    while (rs.next()) {
                        ConditionalSpecRuleMaster ds = new ConditionalSpecRuleMaster();
                        ds.setEqpRawId(rs.getLong(1));
                        ds.setEquipmentName(rs.getString(2));
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

    private final static String EQP_PROCESS_GROUP_DS_SQL =
            "select " +
                    "pg.rawid, pg.process_group_id, pg.group_type_cd, pg.use_yn " +
                    "from process_group_mst_pdm pg, eqp_mst_pdm eqp " +
                    "where pg.eqp_mst_rawid=eqp.rawid " +
                    "and eqp.name=? ";

    public ProcessGroupMaster getEqpProcessGroup(String eqpId) throws SQLException {
        ProcessGroupMaster processGroup = new ProcessGroupMaster();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_PROCESS_GROUP_DS_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_PROCESS_GROUP_DS_SQL);

                    while (rs.next()) {
                        processGroup.setId(rs.getLong(1));
                        processGroup.setGroupId(rs.getString(2));
                        processGroup.setGroupType(rs.getString(3));
                        processGroup.setUseYN(rs.getString(4));
                    }
                }
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return processGroup;
    }


    private final static String EQP_STATUS_PROCESS_GROUP_SQL =
            "select " +
                    "sg.rawid, sg.param_mst_rawid, pm.svid, sg.use_timeout_yn, sg.timeout_ms, sg.use_yn " +
                    "from process_group_mst_pdm pg, eqp_mst_pdm eqp, status_group_mst_pdm sg, param_mst_pdm pm " +
                    "where pg.eqp_mst_rawid=eqp.rawid " +
                    "and pg.rawid=sg.process_group_mst_rawid " +
                    "and sg.param_mst_rawid=pm.rawid" +
                    "and eqp.name=? ";

    public List<StatusGroupMaster> getEqpStatusProcessGroup(String eqpId) throws SQLException {
        List<StatusGroupMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_STATUS_PROCESS_GROUP_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_STATUS_PROCESS_GROUP_SQL);

                    while (rs.next()) {
                        StatusGroupMaster pg = new StatusGroupMaster();
                        pg.setId(rs.getLong(1));
                        pg.setParamRawId(rs.getLong(2));
                        pg.setSvid(rs.getString(3));
                        pg.setUseTimeoutYN(rs.getString(4));
                        pg.setTimeoutMS(rs.getLong(5));
                        pg.setUseYN(rs.getString(6));

                        resultRows.add(pg);
                    }
                }
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return resultRows;
    }

    private final static String EQP_PARAM_PROCESS_GROUP_SQL =
            "select " +
                    "pg.rawid, pg.param_mst_rawid, pm.svid, pg.condition, pg.use_timeout_yn, pg.timeout_ms, pg.use_yn " +
                    "from process_group_mst_pdm pcg, eqp_mst_pdm eqp, param_group_mst_pdm pg, param_mst_pdm pm " +
                    "where pcg.eqp_mst_rawid=eqp.rawid " +
                    "and pcg.rawid=pg.process_group_mst_rawid " +
                    "and pg.param_mst_rawid=pm.rawid  " +
                    "and eqp.name=? ";

    public ParamConditionGroupMaster getEqpParamProcessGroup(String eqpId) throws SQLException {
        ParamConditionGroupMaster pg = new ParamConditionGroupMaster();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_PARAM_PROCESS_GROUP_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_PARAM_PROCESS_GROUP_SQL);

                    while (rs.next()) {
                        pg.setId(rs.getLong(1));
                        pg.setParamRawId(rs.getLong(2));
                        pg.setSvid(rs.getString(3));
                        pg.setCondition(rs.getString(4));
                        pg.setUseTimeoutYN(rs.getString(5));
                        pg.setTimeoutMS(rs.getLong(6));
                        pg.setUseYN(rs.getString(7));
                    }
                }
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return pg;
    }

    private final static String EQP_EVENT_PROCESS_GROUP_SQL =
            "select " +
                    "e.rawid, e.start_event_id, e.end_event_id, e.use_timeout_yn, e.timeout_ms, e.use_yn " +
                    "from process_group_mst_pdm pg, eqp_mst_pdm eqp, event_group_mst_pdm e " +
                    "where pg.eqp_mst_rawid=eqp.rawid " +
                    "and pg.rawid=e.process_group_mst_rawid " +
                    "and eqp.name=? ";

    public EventGroupMaster getEqpEventProcessGroup(String eqpId) throws SQLException {
        EventGroupMaster pg = new EventGroupMaster();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(EQP_EVENT_PROCESS_GROUP_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", EQP_EVENT_PROCESS_GROUP_SQL);

                    while (rs.next()) {
                        pg.setId(rs.getLong(1));
                        pg.setStartEventId(rs.getString(2));
                        pg.setEndEventId(rs.getString(3));
                        pg.setUseTimeoutYN(rs.getString(4));
                        pg.setTimeoutMS(rs.getLong(5));
                        pg.setUseYN(rs.getString(6));
                    }
                }
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return pg;
    }

    private final static String PARAM_STATUS_MST_SQL =
            "select " +
                    "s.rawid, s.param_mst_rawid, s.value, s.status " +
                    "from status_param_mst_pdm s, param_mst_pdm p, eqp_mst_pdm e " +
                    "where s.param_mst_rawid=p.rawid " +
                    "and p.eqp_mst_rawid=e.rawid " +
                    "and eqp.name=? ";

    public List<StatusParamMaster> getParamStatusInfo(String eqpId) throws SQLException {
        List<StatusParamMaster> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(PARAM_STATUS_MST_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", PARAM_STATUS_MST_SQL);

                    while (rs.next()) {
                        StatusParamMaster pg = new StatusParamMaster();
                        pg.setId(rs.getLong(1));
                        pg.setParamRawId(rs.getLong(2));
                        pg.setValue(rs.getString(3));
                        pg.setStatus(rs.getString(4));

                        resultRows.add(pg);
                    }
                }
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return resultRows;
    }
}
