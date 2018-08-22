package com.bistel.pdm.serving.jdbc.dao;

import com.bistel.pdm.data.stream.MailConfigMaster;
import com.bistel.pdm.serving.jdbc.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AlarmMailConfigDataDao {
    private static final Logger log = LoggerFactory.getLogger(AlarmMailConfigDataDao.class);

    private final static String SMTP_CFG_SQL =
            "select host, port, user_id, password, ssl, from_addr, to_addr from alarm_smtp_cfg_pdm ";

    public MailConfigMaster getMailConfigDataSet() throws SQLException {
        MailConfigMaster ds = new MailConfigMaster();

        try (Connection conn = DataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(SMTP_CFG_SQL);
             ResultSet rs = pst.executeQuery()) {

            log.debug("sql:{}", SMTP_CFG_SQL);

            if (rs.next()) {
                ds.setHost(rs.getString(1));
                ds.setPort(rs.getInt(2));
                ds.setUserId(rs.getString(3));
                ds.setPassword(rs.getString(4));
                ds.setSsl(rs.getString(5));
                ds.setFromAddr(rs.getString(6));
                ds.setToAddr(rs.getString(7));
            }

        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw e;
        }

        return ds;
    }
}
