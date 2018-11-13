package com.bistel.pdm.scheduler.datasource;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.autoconfigure.quartz.QuartzDataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.init.DatabasePopulatorUtils;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.transaction.PlatformTransactionManager;

import javax.annotation.PostConstruct;

@Configuration
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
public class ApplicationDatasource {

    @Autowired
    private ResourceLoader resourceLoader;

    @Bean(name = "quartzDataSourceProperties")
    @ConfigurationProperties("quartz.datasource")
    public DataSourceProperties quartzDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Primary
    @QuartzDataSource
    @Bean(name = "quartzDataSource")
    public HikariDataSource quartzDataSource() {
        return quartzDataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class)
                .build();
    }

    @PostConstruct
    private void initialize() {
        String platform = "oracle";
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        String schemaLocation = "classpath:org/quartz/impl/jdbcjobstore/tables_@@platform@@.sql";
        schemaLocation = schemaLocation.replace("@@platform@@", platform);
        populator.addScript(this.resourceLoader.getResource(schemaLocation));
        populator.setContinueOnError(true);
        DatabasePopulatorUtils.execute(populator, quartzDataSource());
    }

    @Bean(name = "quartzTransactionManager")
    public PlatformTransactionManager quartzTransactionManager() {
        final DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource(quartzDataSource());

        return transactionManager;
    }

    @Bean(name = "mybatisDataSourceProperties")
    @ConfigurationProperties("mybatis.datasource")
    public DataSourceProperties mybatisDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "mybatisDataSource")
    public HikariDataSource mybatisDataSource() {
        return mybatisDataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class)
                .build();
    }

    @Bean(name = "mybatisTransactionManager")
    public PlatformTransactionManager mybatisTransactionManager() {
        final DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource(mybatisDataSource());

        return transactionManager;
    }
}
