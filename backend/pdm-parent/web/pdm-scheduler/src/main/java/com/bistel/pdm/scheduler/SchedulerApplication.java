package com.bistel.pdm.scheduler;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration;
import org.springframework.context.annotation.Bean;

/**
 * The HMP Scheduler with spring boot 2.
 */
@SpringBootApplication(exclude = {
        DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class,
        JdbcTemplateAutoConfiguration.class
})
@MapperScan("com.bistel.pdm.scheduler.job.mapper")
public class SchedulerApplication {
    private static final Logger log = LoggerFactory.getLogger(SchedulerApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SchedulerApplication.class, args);
    }

}
