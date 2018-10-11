package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.common.util.DateUtil;
import com.bistel.a3.portal.dao.pdm.std.summary.STDSummaryMapper;
import com.bistel.a3.portal.enums.JOB_TYPE;
import com.bistel.a3.portal.module.pdm.FabsComponent;
import com.bistel.a3.portal.util.ApacheHttpClientGet;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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

    @Autowired
    private ApacheHttpClientGet apacheHttpClientGet;

    @Value("${GlobalRulPrevious}")
    private int globalRulPrevious;

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


    @Value("${schedule.summaryHealth.enable}")
    private boolean schedulerEnableSummaryHealth;
    @Scheduled(cron="${schedule.summaryHealth}")
    public void summaryHealth() throws InterruptedException, ExecutionException, ParseException, IOException {
        if(!schedulerEnableSummaryHealth) return;




        Date startDate = new Date();

        Date start = DateUtils.truncate(new Date(), Calendar.DATE);                               //
        Date start_dtts=DateUtils.addDays(start, -1);                                             //
        Date end = DateUtils.truncate(new Date(), Calendar.DATE);                                 //

//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String day="2018-09-03 17:00:00";
//        Date start_dtts=sdf.parse(day);
//        Date end=DateUtils.truncate(new Date(), Calendar.DATE);
//        end=DateUtils.addDays(end,1);

            Date rulStart_dtts = DateUtils.addDays(end, -globalRulPrevious);
            logger.info("START scheduled summaryHealth [{} ~ {}]", ff.format(start_dtts), ff.format(end));

            batchTaskService.deleteHealthDailySum(fabsComponent.scheduleFabs(), start_dtts, end);
            batchTaskService.summaryHealthSTDSPC(fabsComponent.scheduleFabs(), start_dtts, end); //STD (Logic1, Logic2) Insert eqp_health_daily_sum_pdm
            batchTaskService.summaryHealthDiff(fabsComponent.scheduleFabs(), start_dtts, end); //Diff (Logic3) Insert eqp_health_daily_sum_pdm

            batchTaskService.deleteEqpAlarmDailySum(fabsComponent.scheduleFabs(), start_dtts, end); //delete EQP_ALARM_DAILY_SUM_PDM
            batchTaskService.summaryEqpAlarmDaily(fabsComponent.scheduleFabs(), start_dtts, end); // insert EQP_ALARM_DAILY_SUM_PDM

            batchTaskService.deleteParamHealthRUL(fabsComponent.scheduleFabs(), start_dtts, end); //delete param_health_rul_trx_pdm
            batchTaskService.summaryParamHealthRUL(fabsComponent.scheduleFabs(), rulStart_dtts, start_dtts, end); // insert param_health_rul_trx_pdm, insert eqp_health_daily_sum_pdm

            logger.info("END   scheduled summaryHealth [{} ~ {}] time spend:{}", ff.format(start_dtts), ff.format(end), com.bistel.a3.portal.util.date.DateUtil.getProgressStatusString("End", 100, 100, startDate, "summaryHealth"));

    }






    @Value("${schedule.summaryHealthPeriod.enable}")
    private boolean schedulerEnableSummaryHealthPeriod;
    @Scheduled(cron="${schedule.summaryHealthPeriod}")
    public void summaryHealthPeriod() throws InterruptedException, ExecutionException, ParseException, IOException {
        if(!schedulerEnableSummaryHealthPeriod) return;




        Date startDate = new Date();

//        Date start = DateUtils.truncate(new Date(), Calendar.DATE);                               //
//        Date start_dtts=DateUtils.addDays(start, -1);                                             //
//        Date end = DateUtils.truncate(new Date(), Calendar.DATE);                                 //


        SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd");                            //*******************************************************
        String sSchedulerStart="2018-09-02";                                                        //*******************************************************
        Date schedulerEndDate=DateUtils.truncate(new Date(), Calendar.DATE);                        //***
        Date schedulerStartDate=dt.parse(sSchedulerStart);                                          //***              <Long Term Scheduler>
        long diff = schedulerEndDate.getTime() - schedulerStartDate.getTime();                      //***      sSchedulerStart : 스케쥴러 시작할 날짜 설정
        int diffDays = (int)(diff / (24 * 60 * 60 * 1000));                                         //***
                                                                                                    //***
                                                                                                    //***
        for (int i = diffDays; i >= 0; i--) {                                                       //***
                                                                                                    //***
                                                                                                    //***
            Date start = DateUtils.truncate(new Date(), Calendar.DATE);                             //***
            Date start_dtts = DateUtils.addDays(start, -i);                   // 2018-08-27 28 29   //********************************************************
            Date end = DateUtils.addDays(start_dtts, 1);               // 2018-08-28 29 30   //********************************************************


        Date rulStart_dtts = DateUtils.addDays(end, -globalRulPrevious);
        logger.info("START scheduled summaryHealth [{} ~ {}]", ff.format(start_dtts), ff.format(end));

        batchTaskService.deleteHealthDailySum(fabsComponent.scheduleFabs(), start_dtts, end);
        batchTaskService.summaryHealthSTDSPC(fabsComponent.scheduleFabs(), start_dtts, end); //STD (Logic1, Logic2) Insert eqp_health_daily_sum_pdm
        batchTaskService.summaryHealthDiff(fabsComponent.scheduleFabs(), start_dtts, end); //Diff (Logic3) Insert eqp_health_daily_sum_pdm

        batchTaskService.deleteEqpAlarmDailySum(fabsComponent.scheduleFabs(), start_dtts, end); //delete EQP_ALARM_DAILY_SUM_PDM
        batchTaskService.summaryEqpAlarmDaily(fabsComponent.scheduleFabs(), start_dtts, end); // insert EQP_ALARM_DAILY_SUM_PDM

        batchTaskService.deleteParamHealthRUL(fabsComponent.scheduleFabs(), start_dtts, end); //delete param_health_rul_trx_pdm
        batchTaskService.summaryParamHealthRUL(fabsComponent.scheduleFabs(), rulStart_dtts, start_dtts, end); // insert param_health_rul_trx_pdm, insert eqp_health_daily_sum_pdm

        logger.info("END   scheduled summaryHealth [{} ~ {}] time spend:{}", ff.format(start_dtts), ff.format(end), com.bistel.a3.portal.util.date.DateUtil.getProgressStatusString("End", 100, 100, startDate, "summaryHealth"));
        }//
    }





}
