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
                    " l.alarm_condition, " +
                    " l.warning_condition, " +
                    " o.option_name, " +
                    " o.option_value " +
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
                ds.setAlarmCondition(rs.getString(5));
                ds.setWarningCondition(rs.getString(6));
                ds.setOptionName(rs.getString(7));
                ds.setOptionValue(rs.getInt(8));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }
}