package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.enums.JOB_TYPE;
import com.bistel.a3.portal.module.pdm.FabsComponent;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.concurrent.ExecutionException;

@Service
public class SchedulerService {
    private static Logger logger = LoggerFactory.getLogger(SchedulerService.class);

    @Autowired
    private IBatchTaskService batchTaskService;

    @Autowired
    private FabsComponent fabsComponent;

    @Autowired
    private IDataCollectService dataCollectService;

    private static FastDateFormat ff = FastDateFormat.getDateInstance(DateFormat.LONG);

    @Scheduled(cron="${schedule.partition}")
    public void createpartition() {
        Date from = DateUtils.addMonths(DateUtils.truncate(new Date(), Calendar.DATE), -1);
        logger.info("START scheduled createPartition {}", ff.format(from));
        batchTaskService.createPartition(from, 5, fabsComponent.scheduleFabs(), JOB_TYPE.SCHEDULER);
        logger.info("END   scheduled createPartition {}", ff.format(from));
    }

    @Scheduled(cron="${schedule.datapump}")
    public void datapump() throws NoSuchMethodException {
        Date start = DateUtils.addDays(DateUtils.truncate(new Date(), Calendar.DATE), -1);
        Date end = DateUtils.ceiling(start, Calendar.DATE);
        logger.info("START scheduled datapump [{} ~ {})", ff.format(start), ff.format(end));
        batchTaskService.dataPump(start, end, fabsComponent.scheduleFabs(), JOB_TYPE.SCHEDULER, "SCHEDULER");
        logger.info("END   scheduled datapump [{} ~ {})", ff.format(start), ff.format(end));
    }

    @Scheduled(cron="${schedule.summarydata}")
    public void summaryData() throws InterruptedException, ExecutionException, ParseException, IOException {
        Date start = DateUtils.addDays(DateUtils.truncate(new Date(), Calendar.DATE), -1);
        Date end = DateUtils.ceiling(start, Calendar.DATE);
        logger.info("START scheduled summaryData [{} ~ {})", ff.format(start), ff.format(end));
        batchTaskService.summaryData("System",start, end, fabsComponent.scheduleFabs(), Collections.EMPTY_SET, JOB_TYPE.SCHEDULER, "SCHEDULER");
        logger.info("END   scheduled summaryData [{} ~ {})", ff.format(start), ff.format(end));
    }
    @Value("${schedule.summaryRealTimeData.enable}")
    private boolean schedulerEnableSummaryRealTimeData;
    @Scheduled(cron="${schedule.summaryRealTimeData}")
    public void summaryRealTimeData() throws InterruptedException, ExecutionException, ParseException, IOException {
        if(!schedulerEnableSummaryRealTimeData) return;

        Date startDate = new Date();
        Date start = DateUtils.truncate(new Date(), Calendar.DATE);
        Date end = new Date();

        logger.info("START scheduled summaryRealTimeData [{} ~ {}]", ff.format(start), ff.format(end));
        batchTaskService.summaryRealTimeData("System",start, end, fabsComponent.scheduleFabs(), Collections.EMPTY_SET, JOB_TYPE.SCHEDULER, "SCHEDULER");
        logger.info("END   scheduled summaryRealTimeData [{} ~ {}] time spend:{}", ff.format(start), ff.format(end), com.bistel.a3.portal.util.date.DateUtil.getProgressStatusString("End",100,100,startDate,"summaryRealTimeData"));
    }



}
