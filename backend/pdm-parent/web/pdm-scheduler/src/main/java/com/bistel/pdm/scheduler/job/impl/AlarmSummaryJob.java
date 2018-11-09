package com.bistel.pdm.scheduler.job.impl;

import com.bistel.pdm.scheduler.job.mapper.AlarmSummaryMapper;
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
public class AlarmSummaryJob extends QuartzJobBean implements InterruptableJob {
    private static final Logger log = LoggerFactory.getLogger(AlarmSummaryJob.class);

    private volatile boolean toStopFlag = true;

//    @Autowired
//    private SqlSessionTemplate sqlSession;

    @Autowired
    private AlarmSummaryMapper alarmSummaryMapper;

//    @Qualifier("myBatisTransactionManager")
//    @Autowired
//    private PlatformTransactionManager transactionManager;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobKey key = jobExecutionContext.getJobDetail().getKey();
        log.debug("Cron Job started with key :" + key.getName() +
                ", Group :" + key.getGroup() +
                ", Thread Name :" + Thread.currentThread().getName() +
                ", Time now :" + new Date());

        try {
            //*********** For retrieving stored key-value pairs ***********/
            JobDataMap dataMap = jobExecutionContext.getMergedJobDataMap();
            String from = dataMap.getString("from");
            String to = dataMap.getString("to");

            SimpleDateFormat dateformat = new SimpleDateFormat("yyyyy-mm-dd hh:mm:ss.fff");
            Date fromDate = dateformat.parse(from);
            Date toDate = dateformat.parse(to);

            alarmSummaryMapper.deleteSummarizedAlarm(fromDate, toDate);
            alarmSummaryMapper.insertSummarizedAlarm(fromDate, toDate);

//            AlarmSummaryMapper alarmSummaryMapper = sqlSession.getMapper(AlarmSummaryMapper.class);
//            alarmSummaryMapper.deleteSummarizedAlarm(fromDate, toDate);
//            alarmSummaryMapper.insertSummarizedAlarm(fromDate, toDate);

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
