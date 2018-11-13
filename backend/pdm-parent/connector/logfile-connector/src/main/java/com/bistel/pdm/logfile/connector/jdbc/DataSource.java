package com.bistel.pdm.logfile.connector.jdbc;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

/**
 *
 *
 */
public class DataSource {
    private static final Logger log = LoggerFactory.getLogger(DataSource.class);

    private static HikariConfig config = new HikariConfig();
    private static HikariDataSource ds;

    static {
        Properties prop = new Properties();
        try {
            prop.load(new FileInputStream("./config/repository.properties"));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
        log.debug("username : {}, jdbcurl  : {}", prop.getProperty("jdbcUrl"), prop.getProperty("username"));
        log.debug("loaded datasource from property file.");

        config.setJdbcUrl(prop.getProperty("jdbcUrl"));
        config.setUsername(prop.getProperty("username"));
        config.setPassword(prop.getProperty("password"));

        config.setMaximumPoolSize(Integer.parseInt(prop.getProperty("maximumPoolSize")));
        config.setMinimumIdle(Integer.parseInt(prop.getProperty("minimumIdle")));

        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("useServerPrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

        ds = new HikariDataSource(config);

//        if(System.getProperty("jdbcUrl").length() <= 0){
//
//            Properties prop = new Properties();
//            try {
//                prop.load(new FileInputStream("./config/repository.properties"));
//            } catch (IOException e) {
//                log.error(e.getMessage(), e);
//            }
//            log.debug("username : {}, jdbcurl  : {}",
//                    prop.getProperty("jdbcUrl"), prop.getProperty("username"));
//            log.debug("loaded datasource from property file.");
//
//            config.setJdbcUrl(prop.getProperty("jdbcUrl"));
//            config.setUsername(prop.getProperty("username"));
//            config.setPassword(prop.getProperty("password"));
//
//            config.setMaximumPoolSize(Integer.parseInt(prop.getProperty("maximumPoolSize")));
//            config.setMinimumIdle(Integer.parseInt(prop.getProperty("minimumIdle")));
//
//            config.addDataSourceProperty("cachePrepStmts", "true");
//            config.addDataSourceProperty("useServerPrepStmts", "true");
//            config.addDataSourceProperty("prepStmtCacheSize", "250");
//            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
//
//            ds = new HikariDataSource(config);
//
//        } else {
//            log.debug("username : {}, jdbcurl  : {}",
//                    System.getProperty("SERVING_REPOSITORY_USER"), System.getProperty("SERVING_REPOSITORY_URL"));
//            log.debug("loaded datasource from system.");
//
//            config.setJdbcUrl(System.getProperty("SERVING_REPOSITORY_URL"));
//            config.setUsername(System.getProperty("SERVING_REPOSITORY_USER"));
//            config.setPassword(System.getProperty("SERVING_REPOSITORY_PASS"));
//
//            config.setMaximumPoolSize(Integer.parseInt(System.getProperty("SERVING_REPOSITORY_MAX_POOLSIZE")));
//            config.setMinimumIdle(Integer.parseInt(System.getProperty("SERVING_REPOSITORY_MIN_IDLE")));
//
//            config.addDataSourceProperty("cachePrepStmts", "true");
//            config.addDataSourceProperty("useServerPrepStmts", "true");
//            config.addDataSourceProperty("prepStmtCacheSize", "250");
//            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
//
//            ds = new HikariDataSource(config);
//        }
    }

    private DataSource() {
    }

    public static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }
}
