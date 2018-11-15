package com.bistel.pdm.scheduler.job.impl;

import com.bistel.pdm.scheduler.job.mapper.AlarmSummaryMapper;
import com.bistel.pdm.scheduler.job.mapper.MasterInfoMapper;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
public class MasterSinkJob extends QuartzJobBean implements InterruptableJob {
    private static final Logger log = LoggerFactory.getLogger(MasterSinkJob.class);

    private volatile boolean toStopFlag = true;

    @Autowired
    private MasterInfoMapper masterInfoMapper;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobKey key = jobExecutionContext.getJobDetail().getKey();
        log.debug("Cron Job started with key :" + key.getName() +
                ", Group :" + key.getGroup() +
                ", Thread Name :" + Thread.currentThread().getName() +
                ", Time now :" + new Date());

        try {


        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public void interrupt() throws UnableToInterruptJobException {
        log.debug("Stopping thread... ");
        toStopFlag = false;
    }
}
