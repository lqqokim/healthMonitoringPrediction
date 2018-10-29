package com.bistel.pdm.scheduler.datasource;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class ApplicationDatasource {

    @Bean
    @Primary
    @ConfigurationProperties("mybatis.datasource")
    public DataSourceProperties mybatisDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    @ConfigurationProperties("quartz.datasource")
    public DataSourceProperties quartzDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @ConfigurationProperties("mybatis.datasource")
    public HikariDataSource mybatisDataSource() {
        return mybatisDataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class)
                .build();
    }

    @Bean
    @ConfigurationProperties("quartz.datasource")
    public HikariDataSource quartzDataSource() {
        return quartzDataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class)
                .build();
    }

    @Bean
    public PlatformTransactionManager schedulerTransactionManager() {
        final DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource(quartzDataSource());

        return transactionManager;
    }
}
