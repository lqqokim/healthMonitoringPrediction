package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.common.json.SummarizedFeature;
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
 *
 */
public class FeatureSummaryDataDao {
    private static final Logger log = LoggerFactory.getLogger(FeatureSummaryDataDao.class);

//    private final static String FEATURE_DS_SQL =
//            "select " +
//                    "p.rawid as param_rawid, " +
//                    "p.name as param_name, " +
//                    "avg(f.mean) mean, stddev(f.mean) sigma " +
//                    "from param_mst_pdm p, param_feature_trx_pdm f " +
//                    "where p.rawid=f.param_mst_rawid " +
//                    "and f.end_dtts between to_timestamp(?, 'YYYY-MM-DD HH24:MI:SS.FF') " +
//                    "                   and to_timestamp(?, 'YYYY-MM-DD HH24:MI:SS.FF') " +
//                    "group by p.rawid, p.name ";

    private final static String FEATURE_DS_SQL =
            "select " +
                    "p.rawid as param_rawid, " +
                    "p.name as param_name, " +
                    "avg(f.value) mean, stddev(f.value) sigma " +
                    "from param_mst_pdm p, trace_trx_pdm f " +
                    "where p.rawid=f.param_mst_rawid " +
                    "and f.status_cd='R' " +
                    "and f.event_dtts between to_timestamp(?, 'YYYY-MM-DD HH24:MI:SS.FF') " +
                    "                     and to_timestamp(?, 'YYYY-MM-DD HH24:MI:SS.FF') " +
                    "group by p.rawid, p.name ";

    public List<SummarizedFeature> getParamAverage(String from, String to) throws SQLException {
        List<SummarizedFeature> paramFeatureValueList = new ArrayList<>();

        try (Connection conn = DataSource.getConnection()) {
            try (PreparedStatement pst = conn.prepareStatement(FEATURE_DS_SQL)) {
                pst.setString(1, from);
                pst.setString(2, to);

                ResultSet rs = pst.executeQuery();

                log.debug("sql:{}, from:{}, to:{}", FEATURE_DS_SQL, from, to);

                while (rs.next()) {
                    // param_rawid, average, sigma
                    SummarizedFeature sf = new SummarizedFeature();
                    sf.setParamRawId(rs.getLong(1));
                    sf.setMean(rs.getDouble(3));
                    sf.setSigma(rs.getDouble(4));

                    paramFeatureValueList.add(sf);
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
