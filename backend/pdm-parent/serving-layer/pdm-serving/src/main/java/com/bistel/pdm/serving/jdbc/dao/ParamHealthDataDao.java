package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.common.json.ParameterHealthDataSet;
import com.bistel.pdm.serving.jdbc.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ParamHealthDataDao {
    private static final Logger log = LoggerFactory.getLogger(ParamHealthDataDao.class);

    private final static String HEALTH_DS_SQL =
            "select p.rawid param_rawid, " +
                    " h.rawid health_rawid, " +
                    " p.name param_name, " +
                    " l.code, " +
                    " l.rawid as health_logic_rawid , " +
                    " l.alarm_condition, " +
                    " l.warning_condition, " +
                    " o.option_name, " +
                    " o.option_value, " +
                    " h.apply_logic_yn " +
                    "from param_mst_pdm p, health_logic_mst_pdm l, " +
                    "     param_health_mst_pdm h, param_health_option_mst_pdm o " +
                    "where p.rawid=h.param_mst_rawid " +
                    "and l.rawid=h.health_logic_mst_rawid " +
                    "and h.rawid=o.param_health_mst_rawid(+) ";

    public List<ParameterHealthDataSet> getParamHealthDataSet() throws SQLException {
        List<ParameterHealthDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(HEALTH_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", HEALTH_DS_SQL);

            while (rs.next()) {
                ParameterHealthDataSet ds = new ParameterHealthDataSet();
                ds.setParamRawId(rs.getLong(1));
                ds.setParamHealthRawId(rs.getLong(2));
                ds.setParameterName(rs.getString(3));
                ds.setHealthCode(rs.getString(4));
                ds.setHealthLogicRawId(rs.getLong(5));

                ds.setAlarmCondition(rs.getString(6));
                ds.setWarningCondition(rs.getString(7));
                ds.setOptionName(rs.getString(8));
                ds.setOptionValue(rs.getInt(9));
                ds.setApplyLogicYN(rs.getString(10));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }

    private final static String HEALTH_DS_1_SQL =
            "select p.rawid param_rawid, " +
                    " h.rawid health_rawid, " +
                    " p.name param_name, " +
                    " l.code, " +
                    " l.rawid as health_logic_rawid , " +
                    " l.alarm_condition, " +
                    " l.warning_condition, " +
                    " o.option_name, " +
                    " o.option_value, " +
                    " h.apply_logic_yn," +
                    " e.name as eqp_name " +
                    "from eqp_mst_pdm e, param_mst_pdm p, health_logic_mst_pdm l, " +
                    "     param_health_mst_pdm h, param_health_option_mst_pdm o " +
                    "where p.rawid=h.param_mst_rawid " +
                    "and l.rawid=h.health_logic_mst_rawid " +
                    "and h.rawid=o.param_health_mst_rawid(+) " +
                    "and e.rawid=p.eqp_mst_rawid " +
                    "and e.name=? ";

    public List<ParameterHealthDataSet> getParamHealthDataSet(String eqpId) throws SQLException {
        List<ParameterHealthDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(HEALTH_DS_1_SQL)) {
                pst.setString(1, eqpId);

                try (ResultSet rs = pst.executeQuery()) {
                    log.debug("sql:{}", HEALTH_DS_1_SQL);

                    while (rs.next()) {
                        ParameterHealthDataSet ds = new ParameterHealthDataSet();
                        ds.setParamRawId(rs.getLong(1));
                        ds.setParamHealthRawId(rs.getLong(2));
                        ds.setParameterName(rs.getString(3));
                        ds.setHealthCode(rs.getString(4));
                        ds.setHealthLogicRawId(rs.getLong(5));

                        ds.setAlarmCondition(rs.getString(6));
                        ds.setWarningCondition(rs.getString(7));
                        ds.setOptionName(rs.getString(8));
                        ds.setOptionValue(rs.getInt(9));
                        ds.setApplyLogicYN(rs.getString(10));
                        ds.setEquipmentName(rs.getString(11));

                        resultRows.add(ds);
                    }
                }
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }
}
