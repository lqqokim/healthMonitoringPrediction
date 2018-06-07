package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.common.json.ParameterSpecDataSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AreaDataDao {
    private static final Logger log = LoggerFactory.getLogger(AreaDataDao.class);

    private final static String ALL_AREA_SQL =
            "select " +
                    "rawid as area_id, name, description, parent_rawid as parent_id, " +
                    "create_by, create_dtts, update_by, update_dtts" +
                    "from area_mst_pdm " +
                    "where rawid = ?";

    public List<ParameterSpecDataSet> getArea(String areaId) throws SQLException {
        List<ParameterSpecDataSet> resultRows = new ArrayList<>();

//        /*try (Connection conn = DataSource.getConnection();
//             PreparedStatement pst = conn.prepareStatement(ALL_AREA_SQL);
//             ResultSet rs = pst.executeQuery()) {
//
//            log.debug("sql:{}", ALL_AREA_SQL);
//
//            while (rs.next()) {
//                ParameterSpecDataSet ds = new ParameterSpecDataSet();
//                ds.setAreaName(rs.getString(1));
//                ds.setEquipmentName(rs.getString(2));
//                ds.setParameterName(rs.getString(3));
//                ds.setAlarmSpec(rs.getFloat(4));
//                ds.setWarningSpec(rs.getFloat(5));
//
//                resultRows.add(ds);
//            }
//        } catch (SQLException e) {
//            log.error(e.getMessage(), e);
//            throw e;
//        }*/

        return resultRows;
    }
}
