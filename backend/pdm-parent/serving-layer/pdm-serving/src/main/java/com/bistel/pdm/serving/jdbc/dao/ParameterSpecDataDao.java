package com.bistel.pdm.serving.jdbc.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ParameterSpecDataDao {
    private static final Logger log = LoggerFactory.getLogger(ParameterSpecDataDao.class);

////    private final static String SPEC_DS_SQL =
////            "select " +
////                    "p.rawid, " +
////                    "t.upper_alarm_spec, " +
////                    "t.upper_warning_spec, " +
////                    "t.target, " +
////                    "t.lower_alarm_spec, " +
////                    "t.lower_warning_spec " +
////                    "from param_mst_pdm p, trace_spec_mst_pdm t " +
////                    "where p.rawid=t.param_mst_rawid " +
////                    " ";
//
//        private final static String SPEC_DS_SQL =
//                "select " +
//                        "p.rawid, " +
//                        "t.alarm_spec, " +
//                        "t.warning_spec " +
//                        "from param_mst_pdm p, trace_spec_mst_pdm t " +
//                        "where p.rawid=t.param_mst_rawid " +
//                        " ";
//
//        public List<ParameterWithSpecMaster> getParamSpecDataSet() throws SQLException {
//            List<ParameterWithSpecMaster> resultRows = new ArrayList<>();
//
//            try (Connection conn = DataSource.getConnection();
//                 PreparedStatement pst = conn.prepareStatement(SPEC_DS_SQL);
//                 ResultSet rs = pst.executeQuery()) {
//
//                log.debug("sql:{}", SPEC_DS_SQL);
//
//                while (rs.next()) {
//                    ParameterWithSpecMaster ds = new ParameterWithSpecMaster();
//                    ds.setParamRawId(rs.getLong(1));
//                    ds.setUpperAlarmSpec(rs.getFloat(2));
//                    ds.setUpperWarningSpec(rs.getFloat(3));
//                    ds.setTarget(null);
//                    ds.setLowerAlarmSpec(null);
//                    ds.setLowerWarningSpec(null);
//
//                    resultRows.add(ds);
//                }
//            } catch (SQLException e) {
//                log.error(e.getMessage(), e);
//                throw e;
//            }
//
//            return resultRows;
//        }
//
//        private final static String SPEC_DS_1_SQL =
//                "select " +
//                        "p.rawid, " +
//                        "t.alarm_spec, " +
//                        "t.warning_spec " +
//                        "from eqp_mst_pdm e, param_mst_pdm p, trace_spec_mst_pdm t " +
//                        "where p.rawid=t.param_mst_rawid " +
//                        "and e.rawid=p.eqp_mst_rawid" +
//                        "and e.name=? ";
//
//        public List<ParameterWithSpecMaster> getParamSpecDataSet(String eqpId) throws SQLException {
//            List<ParameterWithSpecMaster> resultRows = new ArrayList<>();
//
//            try (Connection conn = DataSource.getConnection()) {
//                try (PreparedStatement pst = conn.prepareStatement(SPEC_DS_1_SQL)) {
//                    pst.setString(1, eqpId);
//
//                    try (ResultSet rs = pst.executeQuery()) {
//                        log.debug("sql:{}", SPEC_DS_1_SQL);
//
//                        while (rs.next()) {
//                            ParameterWithSpecMaster ds = new ParameterWithSpecMaster();
//                            ds.setParamRawId(rs.getLong(1));
//                            ds.setUpperAlarmSpec(rs.getFloat(2));
//                            ds.setUpperWarningSpec(rs.getFloat(3));
//                            ds.setTarget(null);
//                            ds.setLowerAlarmSpec(null);
//                            ds.setLowerWarningSpec(null);
//
//                            resultRows.add(ds);
//                        }
//                    }
//                }
//            } catch (SQLException e) {
//                log.error(e.getMessage(), e);
//            }
//
//            return resultRows;
//    }
}
