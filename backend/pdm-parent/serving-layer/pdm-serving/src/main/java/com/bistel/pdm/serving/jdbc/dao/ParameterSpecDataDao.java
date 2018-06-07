package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.common.json.ParameterSpecDataSet;
import com.bistel.pdm.serving.jdbc.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ParameterSpecDataDao {
    private static final Logger log = LoggerFactory.getLogger(ParameterSpecDataDao.class);

    private final static String SPEC_DS_SQL =
            "select " +
                    "p.rawid, f.feature_name, t.warning_spec, t.alarm_spec " +
                    "from param_mst_pdm p, param_feature_mst_pdm f, trace_spec_mst_pdm t " +
                    "where p.rawid=t.param_mst_rawid " +
                    "and p.rawid=f.param_mst_rawid " +
                    "and f.main_yn = 'Y' ";

    public List<ParameterSpecDataSet> getParamSpecDataSet() throws SQLException {
        List<ParameterSpecDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(SPEC_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", SPEC_DS_SQL);

            while (rs.next()) {
                ParameterSpecDataSet ds = new ParameterSpecDataSet();
                ds.setParamRawId(rs.getLong(1));
                ds.setFeatureName(rs.getString(2));
                ds.setAlarmSpec(rs.getFloat(3));
                ds.setWarningSpec(rs.getFloat(4));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }
}
