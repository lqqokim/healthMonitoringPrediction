package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.common.json.MasterDataSet;
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
public class MasterDataSetDao {
    private static final Logger log = LoggerFactory.getLogger(MasterDataSetDao.class);

    private final static String MASTER_DS_SQL =
            "select " +
                    "area.name area_name, eqp.name as eqp_name, " +
                    "param.name as param_name, param.rawid param_id " +
                    "from area_mst_pdm area, eqp_mst_pdm eqp, param_mst_pdm param " +
                    "where area.rawid=eqp.area_mst_rawid " +
                    "  and eqp.rawid=param.eqp_mst_rawid " +
                    "";

    public List<MasterDataSet> getMasterDataSet() throws SQLException {
        List<MasterDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(MASTER_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", MASTER_DS_SQL);

            while (rs.next()) {
                MasterDataSet ds = new MasterDataSet();
                ds.setAreaName(rs.getString(1));
                ds.setEquipmentName(rs.getString(2));
                ds.setParameterName(rs.getString(3));
                ds.setParameterRawId(rs.getLong(4));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }
}
