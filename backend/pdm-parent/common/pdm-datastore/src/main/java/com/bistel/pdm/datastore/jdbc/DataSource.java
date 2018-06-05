package com.bistel.pdm.datastore.jdbc;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

/**
 *
 *
 */
public class DataSource {
    private static final Logger log = LoggerFactory.getLogger(DataSource.class);

    private static final String hardCodeConfigPath = "./config/datastore.properties";
    //private static final String hardCodeConfigPath = "/Users/hansonjang/Documents/opensource/pdm-parent/common/pdm-datastore/target/classes/datastore.properties";

    private static HikariDataSource hikariDataSource;
    private static DBType dbType = DBType.oracle;

    private DataSource() {
    }

    static {
        Properties prop = new Properties();
        try (InputStream stream = new FileInputStream(hardCodeConfigPath)) {
            prop.load(stream);
            log.debug(" loaded property file  : {}", hardCodeConfigPath);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }

        String jdbcUrl = prop.getProperty("jdbcUrl");
        String userName = prop.getProperty("username");

        log.debug(" jdbcurl  : {}", jdbcUrl);
        log.debug(" username : {}", userName);

        if (jdbcUrl.indexOf("oracle") > 0) {
            dbType = DBType.oracle;
        } else if (jdbcUrl.indexOf("postgresql") > 0) {
            dbType = DBType.postgresql;
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(userName);
        config.setPassword(prop.getProperty("password"));

        config.setMaximumPoolSize(Integer.parseInt(prop.getProperty("maximumPoolSize")));
        config.setMinimumIdle(Integer.parseInt(prop.getProperty("minimumIdle")));

        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("useServerPrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

        hikariDataSource = new HikariDataSource(config);
    }

    public static Connection getConnection() throws SQLException {
        return hikariDataSource.getConnection();
    }

    public static DBType getDBType() {
        return dbType;
    }
}
