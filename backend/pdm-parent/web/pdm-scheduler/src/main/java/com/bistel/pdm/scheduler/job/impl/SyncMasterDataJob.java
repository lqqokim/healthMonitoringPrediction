package com.bistel.pdm.scheduler.job.impl;

import com.bistel.pdm.scheduler.service.SyncMasterDataService;
import com.bistel.pdm.scheduler.service.WebSocketService;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
public class SyncMasterDataJob extends QuartzJobBean implements InterruptableJob {
    private static final Logger log = LoggerFactory.getLogger(SyncMasterDataJob.class);

    private volatile boolean toStopFlag = true;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private SyncMasterDataService syncMasterDataService;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobKey key = jobExecutionContext.getJobDetail().getKey();
        log.debug("Cron Job started with key :" + key.getName() +
                ", Group :" + key.getGroup() +
                ", Thread Name :" + Thread.currentThread().getName() +
                ", Time now :" + new Date());

        try {
            // auto sync
            syncMasterDataService.syncAutoMasterData();

            // send message to connector to refresh.
            webSocketService.broadcast("EQP_NAME", "");

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
