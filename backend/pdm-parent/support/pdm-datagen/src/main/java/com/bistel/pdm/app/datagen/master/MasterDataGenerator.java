package com.bistel.pdm.app.datagen.master;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MasterDataGenerator {

    public static void createArea() throws SQLException {

        final String INSERT_SQL =
                "insert into area_mst_pdm values(SEQ_AREA_MST_PDM.NEXTVAL, ?, ?, null, 'sa', CURRENT_TIMESTAMP, 'sa', CURRENT_TIMESTAMP)";

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

            conn.setAutoCommit(false);

            for (int i = 0; i < 8; i++) {
                String area = "area" + i;

                pstmt.setString(1, area);
                pstmt.setString(2, "");
                pstmt.addBatch();

            }

            pstmt.executeBatch();
            conn.commit();
        } catch (SQLException e) {
            throw e;
        }
    }


    private static List<Long> getAreaRawId() throws SQLException {
        List<Long> rawidList = new ArrayList<>();

        Connection conn = null;
        Statement stmt = null;
        try {
            conn = DataSource.getConnection();
            stmt = conn.createStatement();

            ResultSet rs = stmt.executeQuery(" select distinct rawid from area_mst_pdm ");

            // Getting the result rows
            while (rs.next()) {
                rawidList.add(rs.getLong(1));
            }
            rs.close();
        } catch (Exception e) {

        } finally {
            stmt.close();
            conn.close();
        }
        return rawidList;
    }

    private static List<Long> getEqpRawId() throws SQLException {
        List<Long> rawidList = new ArrayList<>();

        Connection conn = null;
        Statement stmt = null;
        try {
            conn = DataSource.getConnection();
            stmt = conn.createStatement();

            ResultSet rs = stmt.executeQuery(" select distinct rawid from eqp_mst_pdm ");

            // Getting the result rows
            while (rs.next()) {
                rawidList.add(rs.getLong(1));
            }
            rs.close();
        } catch (Exception e) {

        } finally {
            stmt.close();
            conn.close();
        }
        return rawidList;
    }

    public static void createEquipment() throws SQLException {

        List<Long> rawIdList = getAreaRawId();

        final String INSERT_SQL =
                "insert into eqp_mst_pdm (rawid, area_mst_rawid, name, data_type_cd, create_by) "
                        + "values(SEQ_EQP_MST_PDM.NEXTVAL, ?, ?, 'std', 'sa') ";

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

            conn.setAutoCommit(false);

            for (Long rawid : rawIdList) {
                for (int j = 0; j < 62; j++) {
                    String eqpName = "eqp" + j;

                    pstmt.setLong(1, rawid);
                    pstmt.setString(2, eqpName);
                    pstmt.addBatch();
                }

                pstmt.executeBatch();
            }

            conn.commit();
        } catch (SQLException e) {
            throw e;
        }
    }

    public static void createParameter() throws SQLException {

        List<Long> eqpRawIdList = getEqpRawId();

        String[] paramList = new String[] {"velocity", "acceleration", "enveloping"};

        final String INSERT_SQL =
                "insert into param_mst_pdm (rawid, eqp_mst_rawid, name, param_type_cd, unit_cd, create_by)"
                        + "values(SEQ_PARAM_MST_PDM.NEXTVAL, ?, ?, ?, ?, 'sa') ";

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)) {

            conn.setAutoCommit(false);

            for (Long eqpRawid : eqpRawIdList) {
                for(String param : paramList){
                    pstmt.setLong(1, eqpRawid);
                    pstmt.setString(2, param);
                    pstmt.setString(3, param);
                    pstmt.setString(4, "unit");
                    pstmt.addBatch();
                }
                pstmt.executeBatch();
            }

            conn.commit();
        } catch (SQLException e) {
            throw e;
        }
    }
}
