package com.bistel.pdm.scheduler.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.quartz.SchedulerFactoryBeanCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class SchedulerConfig {

    private DataSource dataSource;

    private PlatformTransactionManager transactionManager;

    @Autowired
    public SchedulerConfig(@Qualifier("quartzDataSource") DataSource dataSource,
                           @Qualifier("schedulerTransactionManager") PlatformTransactionManager transactionManager) {
        this.dataSource = dataSource;
        this.transactionManager = transactionManager;
    }

    @Bean
    @Primary
    public SchedulerFactoryBeanCustomizer schedulerFactoryBeanCustomizer() {
        return bean ->
        {
            bean.setDataSource(dataSource);
            bean.setTransactionManager(transactionManager);
        };
    }
}
