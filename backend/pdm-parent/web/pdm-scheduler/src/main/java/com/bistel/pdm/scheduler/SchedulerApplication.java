package com.bistel.pdm.scheduler;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The HMP Scheduler with spring boot 2.
 */
@SpringBootApplication
@MapperScan("com.bistel.pdm.scheduler.job.mapper")
public class SchedulerApplication {
    private static final Logger log = LoggerFactory.getLogger(SchedulerApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SchedulerApplication.class, args);
    }

}
