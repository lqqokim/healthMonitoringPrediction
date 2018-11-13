package com.bistel.pdm.scheduler.config;

import com.bistel.pdm.scheduler.job.impl.AlarmSummaryJob;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.quartz.QuartzAutoConfiguration;
import org.springframework.boot.autoconfigure.quartz.SchedulerFactoryBeanCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
//@EnableAutoConfiguration(exclude = {QuartzAutoConfiguration.class})
public class SchedulerConfig {

//    @Autowired
//    private SchedulerFactoryBean schedulerFactoryBean;
//
//    private DataSource dataSource;
//
//    private PlatformTransactionManager transactionManager;
//
//    @Autowired
//    public SchedulerConfig(@Qualifier("quartzDataSource") DataSource dataSource,
//                           @Qualifier("quartzTransactionManager") PlatformTransactionManager transactionManager) {
//        this.dataSource = dataSource;
//        this.transactionManager = transactionManager;
//    }
//
//    @Bean
//    @Primary
//    public SchedulerFactoryBeanCustomizer schedulerFactoryBeanCustomizer() {
//        return bean ->
//        {
//            bean.setDataSource(dataSource);
//            bean.setTransactionManager(transactionManager);
//        };
//    }

//    @Bean
//    public SmartInitializingSingleton importProcessor() {
//        return () -> {
//            schedulerFactoryBean.setTriggers(alarmDailySummaryTrigger(), healthDailySummaryTrigger());
//            schedulerFactoryBean.setJobDetails(alarmDailySummaryDetail(), healthDailySummaryDetail());
//            schedulerFactoryBean.start();
//        };
//    }

    @Bean
    public JobDetail alarmDailySummaryDetail() {
        //Set Job data map
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("jobName", "AlarmDailySummary");

        return JobBuilder.newJob(AlarmSummaryJob.class)
                .withIdentity("AlarmDailySummary", null)
                .setJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger alarmDailySummaryTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder
                .simpleSchedule()
                .withIntervalInHours(24)
                .repeatForever();

        return TriggerBuilder
                .newTrigger()
                .forJob(alarmDailySummaryDetail())
                .withIdentity("alarmDailySummaryTrigger", null)
                .withSchedule(scheduleBuilder)
                .startAt(DateBuilder.todayAt(0, 0, 0))
                .build();
    }

    @Bean
    public JobDetail healthDailySummaryDetail() {
        //Set Job data map
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("jobName", "HealthDailySummary");

        return JobBuilder.newJob(AlarmSummaryJob.class)
                .withIdentity("HealthDailySummary", null)
                .setJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger healthDailySummaryTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder
                .simpleSchedule()
                .withIntervalInHours(24)
                .repeatForever();

        return TriggerBuilder
                .newTrigger()
                .forJob(alarmDailySummaryDetail())
                .withIdentity("healthDailySummaryTrigger", null)
                .withSchedule(scheduleBuilder)
                .startAt(DateBuilder.todayAt(0, 0, 0))
                .build();
    }

//    @Bean
//    public SchedulerFactoryBean schedulerFactoryBean() throws IOException, SchedulerException
//    {
//        SchedulerFactoryBean scheduler = new SchedulerFactoryBean();
//        scheduler.setTriggers(jobOneTrigger(), jobTwoTrigger());
//        scheduler.setQuartzProperties(quartzProperties());
//        scheduler.setJobDetails(jobOneDetail(), jobTwoDetail());
//        scheduler.setApplicationContextSchedulerContextKey("applicationContext");
//        return scheduler;
//    }
//
//    /**
//     * Configure quartz using properties file
//     */
//    @Bean
//    public Properties quartzProperties() throws IOException {
//        PropertiesFactoryBean propertiesFactoryBean = new PropertiesFactoryBean();
//        propertiesFactoryBean.setLocation(new ClassPathResource("/quartz.properties"));
//        propertiesFactoryBean.afterPropertiesSet();
//        return propertiesFactoryBean.getObject();
//    }
}
