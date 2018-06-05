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

public class ParameterSpecDataSetDao {
    private static final Logger log = LoggerFactory.getLogger(MasterDataSetDao.class);

    private final static String SPEC_DS_SQL =
            "select " +
                    " area.name area_name, eqp.name as eqp_name, param.name as param_name, " +
                    " spec.alarm_spec, spec.warning_spec " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp, param_mst_pdm param, trace_spec_mst_pdm spec " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "and eqp.rawid=param.eqp_mst_rawid " +
                    "and param.rawid=spec.param_mst_rawid ";

    public List<ParameterSpecDataSet> getParamSpecDataSet() throws SQLException {
        List<ParameterSpecDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(SPEC_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", SPEC_DS_SQL);

            while (rs.next()) {
                ParameterSpecDataSet ds = new ParameterSpecDataSet();
                ds.setAreaName(rs.getString(1));
                ds.setEquipmentName(rs.getString(2));
                ds.setParameterName(rs.getString(3));
                ds.setAlarmSpec(rs.getFloat(4));
                ds.setWarningSpec(rs.getFloat(5));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }
}
