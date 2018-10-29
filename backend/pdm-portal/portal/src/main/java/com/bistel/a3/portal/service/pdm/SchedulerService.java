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
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
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

    @Scheduled(cron = "${schedule.datapump}")
    public void datapump() throws NoSuchMethodException {

        SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd");
        String sPumpFromdate = "2018-09-01";
        String sPumpTodate = "2018-10-17"; // < sPumpTodate
        Date end = DateUtils.truncate(new Date(), Calendar.DATE);
        Date fromstart = null;
        Date tostart = null;

        try {
            fromstart = dt.parse(sPumpFromdate);
            tostart = dt.parse(sPumpTodate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        logger.info("START scheduled datapump [{} ~ {})", ff.format(fromstart), ff.format(tostart));
        batchTaskService.dataPump(fromstart, tostart, fabsComponent.scheduleFabs(), JOB_TYPE.SCHEDULER, "SCHEDULER");
        logger.info("END   scheduled datapump [{} ~ {})", ff.format(fromstart), ff.format(tostart));

    }

    @Scheduled(cron = "${schedule.dailyDatapump}")
    public void dailyDatapump() throws NoSuchMethodException {


        Date fromstart = DateUtils.addDays(DateUtils.truncate(new Date(), Calendar.DATE), -1);
        Date tostart = DateUtils.ceiling(fromstart, Calendar.DATE);

        logger.info("START scheduled datapump [{} ~ {})", ff.format(fromstart), ff.format(tostart));
        batchTaskService.dataPump(fromstart, tostart, fabsComponent.scheduleFabs(), JOB_TYPE.SCHEDULER, "SCHEDULER");
        logger.info("END   scheduled datapump [{} ~ {})", ff.format(fromstart), ff.format(tostart));

    }

    @Scheduled(cron = "${schedule.summarydata}")
    public void summaryData() throws InterruptedException, ExecutionException, ParseException, IOException {
        Date start = DateUtils.addDays(DateUtils.truncate(new Date(), Calendar.DATE), -1);
        Date end = DateUtils.ceiling(start, Calendar.DATE);
        logger.info("START scheduled summaryData [{} ~ {})", ff.format(start), ff.format(end));
        batchTaskService.summaryData("System", start, end, fabsComponent.scheduleFabs(), Collections.EMPTY_SET, JOB_TYPE.SCHEDULER, "SCHEDULER");
        logger.info("END   scheduled summaryData [{} ~ {})", ff.format(start), ff.format(end));
    }

    @Value("${schedule.summaryRealTimeData.enable}")
    private boolean schedulerEnableSummaryRealTimeData;
    @Scheduled(cron = "${schedule.summaryRealTimeData}")
    public void summaryRealTimeData() throws InterruptedException, ExecutionException, ParseException, IOException {
        if (!schedulerEnableSummaryRealTimeData) return;

        Date startDate = new Date();
        Date start = DateUtils.truncate(new Date(), Calendar.DATE);
        Date end = new Date();

        logger.info("START scheduled summaryRealTimeData [{} ~ {}]", ff.format(start), ff.format(end));
        batchTaskService.summaryRealTimeData("System", start, end, fabsComponent.scheduleFabs(), Collections.EMPTY_SET, JOB_TYPE.SCHEDULER, "SCHEDULER");
        logger.info("END   scheduled summaryRealTimeData [{} ~ {}] time spend:{}", ff.format(start), ff.format(end), com.bistel.a3.portal.util.date.DateUtil.getProgressStatusString("End", 100, 100, startDate, "summaryRealTimeData"));
    }


    @Value("${schedule.summaryHealth.enable}")
    private boolean schedulerEnableSummaryHealth;
    @Scheduled(cron = "${schedule.summaryHealth}")
    public void summaryHealth() throws InterruptedException, ExecutionException, ParseException, IOException {
        if (!schedulerEnableSummaryHealth) return;

        Date startDate = new Date();

        Date start = DateUtils.truncate(new Date(), Calendar.DATE);                               //
        Date start_dtts = DateUtils.addDays(start, -1);                                             //
        Date end = DateUtils.truncate(new Date(), Calendar.DATE);                                 //

        Date rulStart_dtts = DateUtils.addDays(end, -7);
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
    @Scheduled(cron = "${schedule.summaryHealthPeriod}")
    public void summaryHealthPeriod() throws InterruptedException, ExecutionException, ParseException, IOException {
        if (!schedulerEnableSummaryHealthPeriod) return;



        SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd");
        String sSchedulerStart = "2018-09-01";
        String sSchedulerEnd = "2018-10-17";
        Date end = DateUtils.truncate(new Date(), Calendar.DATE);
        Date fromstart = null;
        Date tostart = null;

        try {
            fromstart = dt.parse(sSchedulerStart);
            tostart = dt.parse(sSchedulerEnd);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        long diff = tostart.getTime() - fromstart.getTime();
        int diffDays = (int) (diff / (24 * 60 * 60 * 1000));



//        //Scheduler Summary Fab2
        Date startDate = new Date();
//        for (int i = diffDays; i >= 0; i--) {
//            Date start_dtts = DateUtils.addDays(DateUtils.truncate(tostart, Calendar.DATE), -i);//0902-1=0901, 0902
//            Date end_dtts = DateUtils.addDays(start_dtts, 1);//0902, 0903
//
//            Date rulStart_dtts = DateUtils.addDays(end_dtts, -7);
//            logger.info("START scheduled summaryHealth [{} ~ {}]", ff.format(start_dtts), ff.format(end_dtts));
//
//            Set<String> fabs=fabsComponent.scheduleFabs();
//            Set<String> fab2=new HashSet<>();
//            fab2.add("fab2");
//            batchTaskService.deleteHealthDailySum(fab2, start_dtts, end_dtts);
//            batchTaskService.summaryHealthSTDSPC(fab2, start_dtts, end_dtts); //STD (Logic1, Logic2) Insert eqp_health_daily_sum_pdm
//            batchTaskService.summaryHealthDiff(fab2, start_dtts, end_dtts); //Diff (Logic3) Insert eqp_health_daily_sum_pdm
//
//            batchTaskService.deleteEqpAlarmDailySum(fab2, start_dtts, end_dtts); //delete EQP_ALARM_DAILY_SUM_PDM
//            batchTaskService.summaryEqpAlarmDaily(fab2, start_dtts, end_dtts); // insert EQP_ALARM_DAILY_SUM_PDM
//
//            batchTaskService.deleteParamHealthRUL(fab2, start_dtts, end_dtts); //delete param_health_rul_trx_pdm
//            batchTaskService.summaryParamHealthRUL(fab2, rulStart_dtts, start_dtts, end_dtts); // insert param_health_rul_trx_pdm, insert eqp_health_daily_sum_pdm
//
//            logger.info("END   scheduled summaryHealth [{} ~ {}] time spend:{}", ff.format(start_dtts), ff.format(end_dtts), com.bistel.a3.portal.util.date.DateUtil.getProgressStatusString("End", 100, 100, startDate, "summaryHealth"));
//
//        }


        //Scheduler Summary Fab3
        startDate = new Date();
        for (int i = diffDays; i >= 0; i--) {
            Date start_dtts = DateUtils.addDays(DateUtils.truncate(tostart, Calendar.DATE), -i);
            Date end_dtts = DateUtils.addDays(start_dtts, 1);

            Date rulStart_dtts = DateUtils.addDays(end_dtts, -7);
            logger.info("START scheduled summaryHealth [{} ~ {}]", ff.format(start_dtts), ff.format(end_dtts));

            Set<String> fabs=fabsComponent.scheduleFabs();
            Set<String> fab3=new HashSet<>();
            fab3.add("fab1");
            batchTaskService.deleteHealthDailySum(fab3, start_dtts, end_dtts);
            batchTaskService.summaryHealthSTDSPC(fab3, start_dtts, end_dtts); //STD (Logic1, Logic2) Insert eqp_health_daily_sum_pdm
            batchTaskService.summaryHealthDiff(fab3, start_dtts, end_dtts); //Diff (Logic3) Insert eqp_health_daily_sum_pdm

            batchTaskService.deleteEqpAlarmDailySum(fab3, start_dtts, end_dtts); //delete EQP_ALARM_DAILY_SUM_PDM
            batchTaskService.summaryEqpAlarmDaily(fab3, start_dtts, end_dtts); // insert EQP_ALARM_DAILY_SUM_PDM

            batchTaskService.deleteParamHealthRUL(fab3, start_dtts, end_dtts); //delete param_health_rul_trx_pdm
            batchTaskService.summaryParamHealthRUL(fab3, rulStart_dtts, start_dtts, end_dtts); // insert param_health_rul_trx_pdm, insert eqp_health_daily_sum_pdm

            logger.info("END   scheduled summaryHealth [{} ~ {}] time spend:{}", ff.format(start_dtts), ff.format(end_dtts), com.bistel.a3.portal.util.date.DateUtil.getProgressStatusString("End", 100, 100, startDate, "summaryHealth"));

        }


    }


	@Scheduled(cron = "${schedule.datapumpbase}")
    public void datepumpBase() throws NoSuchMethodException {

        System.out.println(URLEncoder.encode("%"));
        System.out.println(URLEncoder.encode("#"));
        System.out.println(URLEncoder.encode("/"));


        Date date = DateUtils.truncate(new Date(), Calendar.DATE);
        logger.info("START scheduled datepump base {}", ff.format(date));
        batchTaskService.dataPumpBase(fabsComponent.scheduleFabs(), date, JOB_TYPE.SCHEDULER, "SCHEDULER");
        logger.info("END   scheduled datepump base {}", ff.format(date));
    }



}
