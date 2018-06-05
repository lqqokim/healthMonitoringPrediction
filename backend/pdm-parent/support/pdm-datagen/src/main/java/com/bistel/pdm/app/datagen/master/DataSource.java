package com.bistel.pdm.app.datagen.master;

import com.bistel.pdm.common.io.PropertyLoader;
import com.bistel.pdm.common.settings.ConfigUtils;
import com.typesafe.config.Config;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

/**
 *
 *
 */
public class DataSource {

    private static HikariConfig config = new HikariConfig();
    private static HikariDataSource ds;

    static {
        Properties prop = new Properties();
        config.setJdbcUrl("jdbc:oracle:thin:@//192.168.8.36:1521/pdm");
        config.setUsername("tpdm");
        config.setPassword("bistel01");
        config.setMaximumPoolSize(10);
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

        ds = new HikariDataSource(config);
    }

    private DataSource() {
    }

    public static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }
}
