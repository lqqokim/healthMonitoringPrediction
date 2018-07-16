package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.serving.jdbc.DataSource;
import org.apache.commons.math3.util.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.concurrent.ConcurrentHashMap;

public class FeatureSummaryDataDao {
    private static final Logger log = LoggerFactory.getLogger(FeatureSummaryDataDao.class);

    private final static String FEATURE_DS_SQL =
            "select " +
                    "p.rawid as param_rawid, " +
                    "p.name as param_name, " +
                    "avg(f.avg) mean, stddev(f.avg) sigma " +
                    "from param_mst_pdm p, param_feature_trx_pdm f " +
                    "where p.rawid=f.param_mst_rawid " +
                    "and f.end_dtts between to_timestamp(?, 'YYYY-MM-DD HH24:MI:SS.FF') " +
                    "                   and to_timestamp(?, 'YYYY-MM-DD HH24:MI:SS.FF') " +
                    "group by p.rawid, p.name ";

    public ConcurrentHashMap<String, Pair<Double, Double>> getParamFeatureAvg(String from, String to) throws SQLException {
        ConcurrentHashMap<String, Pair<Double, Double>> paramFeatureValueList = new ConcurrentHashMap<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(FEATURE_DS_SQL)) {
                pst.setString(1, from);
                pst.setString(2, to);

                ResultSet rs = pst.executeQuery();

                log.debug("sql:{}, from:{}, to:{}", FEATURE_DS_SQL, from, to);

                while (rs.next()) {
                    // param_rawid, average, sigma
                    Pair<Double, Double> value = Pair.create(rs.getDouble(3), rs.getDouble(4));
                    paramFeatureValueList.put(rs.getString(1), value);
                }

            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return paramFeatureValueList;
    }
}
