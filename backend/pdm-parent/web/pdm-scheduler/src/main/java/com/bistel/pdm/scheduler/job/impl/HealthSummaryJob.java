package com.bistel.pdm.scheduler.job.impl;

import org.mybatis.spring.SqlSessionTemplate;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
public class HealthSummaryJob extends QuartzJobBean implements InterruptableJob {
    private static final Logger log = LoggerFactory.getLogger(HealthSummaryJob.class);

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {

    }

    @Override
    public void interrupt() throws UnableToInterruptJobException {

    }
}
