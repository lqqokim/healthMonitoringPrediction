package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.common.json.FeatureDataSet;
import com.bistel.pdm.serving.jdbc.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ParamFeatureDataDao {
    private static final Logger log = LoggerFactory.getLogger(ParamFeatureDataDao.class);

    private final static String FEATURE_DS_SQL =
            "select " +
                    "p.rawid as param_rawid, " +
                    "f.rawid as feature_rawid, " +
                    "p.name as param_name, " +
                    "f.feature_name, " +
                    "f.main_yn " +
                    "from param_mst_pdm p, param_feature_mst_pdm f " +
                    "where p.rawid=f.param_mst_rawid ";

    public List<FeatureDataSet> getAllFeatures() throws SQLException {
        List<FeatureDataSet> resultRows = new ArrayList<>();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(FEATURE_DS_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", FEATURE_DS_SQL);

            while (rs.next()) {
                FeatureDataSet ds = new FeatureDataSet();
                ds.setParamRawId(rs.getLong(1));
                ds.setFeatureRawId(rs.getLong(2));
                ds.setParamName(rs.getString(3));
                ds.setFeatureName(rs.getString(4));
                ds.setMainYN(rs.getString(5));

                resultRows.add(ds);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return resultRows;
    }
}
