package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.common.util.JsonUtil;
import com.bistel.a3.portal.dao.pdm.std.report.STDReportMapper;
import com.bistel.a3.portal.dao.pdm.std.summary.STDSummaryMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDHealthMapper;
import com.bistel.a3.portal.dao.pdm.ulsan.FabMapper;
import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.pdm.BatchJobHst;
import com.bistel.a3.portal.domain.pdm.CauseAnalysisResult;
import com.bistel.a3.portal.domain.pdm.ParamRULSummary;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.domain.pdm.std.master.STDParamHealth;
import com.bistel.a3.portal.enums.JOB;
import com.bistel.a3.portal.enums.JOB_STATUS;
import com.bistel.a3.portal.enums.JOB_TYPE;
import com.bistel.a3.portal.module.pdm.FabsComponent;
import com.bistel.a3.portal.module.pdm.IDataPumperComponent;
import com.bistel.a3.portal.service.pdm.*;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.TransactionUtil;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.apache.commons.math3.stat.StatUtils;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.BeanFactoryAnnotationUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@ConditionalOnExpression("${run.standard}")
public class BatchTaskService implements IBatchTaskService {
    private static Logger logger = LoggerFactory.getLogger(BatchTaskService.class);

    @Autowired
    private IHealthService healthService;

    @Autowired
    private IReportService reportService;

    @Autowired
    private ITraceDataService traceDataService;

    @Autowired
    private ITraceRawDataService traceRawDataService;

    @Autowired
    private FabsComponent fabsComponent;

    @Autowired
    private IPDMCodeService codeService;

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    @Autowired
    private BeanFactory factory;

    @Value("${rms.summary.period}")
    private int rmsSummaryPeriod;

    private Map<String, IDataPumperComponent> pumperMap;

    private static FastDateFormat ffM = FastDateFormat.getDateInstance(DateFormat.DEFAULT);
    private static FastDateFormat ffL = FastDateFormat.getDateInstance(DateFormat.LONG);

    @PostConstruct
    public void init() {
        pumperMap = new HashMap<>();
        pumperMap.put("SKF", BeanFactoryAnnotationUtils.qualifiedBeanOfType(factory, IDataPumperComponent.class, "SKFDataPumperComponent"));
        pumperMap.put("STD", BeanFactoryAnnotationUtils.qualifiedBeanOfType(factory, IDataPumperComponent.class, "STDDataPumperComponent"));
    }

    @Override
    public void createPartition(Date from, int count, Set<String> fabs, JOB_TYPE jobStart) {
        for (String fab : fabs) {
            logger.info("START {} createPartition .. {}, {} ", fab, ffM.format(from), count);
            saveJobHst(fab, from, JOB.createpartition, null, JOB_STATUS.start, jobStart, fab);
            reportService.createPartiton(fab, from, count);
            logger.info("END   {} createPartition .. ", fab);
            saveJobHst(fab, from, JOB.createpartition, null, JOB_STATUS.done, jobStart, fab);
        }
    }

    private void saveJobHst(String fabId, Date date, JOB job, Set<Long> eqpIds, JOB_STATUS jobStatus, JOB_TYPE jobType, String userId) {
        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

        try {
            if (eqpIds == null) {
                BatchJobHst batchJobHst = new BatchJobHst(date, job.name(), null, jobStatus.name(), jobType.name(), userId);
                mapper.deleteBatchJobHst(batchJobHst);
                mapper.insertBatchJobHst(batchJobHst);
            } else {
                for (Long eqpId : eqpIds) {
                    BatchJobHst batchJobHst = new BatchJobHst(date, job.name(), eqpId, jobStatus.name(), jobType.name(), userId);
                    mapper.deleteBatchJobHst(batchJobHst);
                    mapper.insertBatchJobHst(batchJobHst);
                }
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            Throwable ee = e.getCause();
            logger.error("{}, {}", e, ee == null ? e.getMessage() : ee.getMessage());
        }
    }

    private void createStatByFab(Date from, Date to, String fabId, Set<Long> eqpIds) {
        List<HealthModel> models = healthService.getModels(fabId);
        Date from90 = DateUtils.addDays(from, -90);

        List<HealthStat> records = new ArrayList<>();
        int size = models.size();
        int index = 0;
        for (HealthModel model : models) {
            if (!eqpIds.isEmpty() && !eqpIds.contains(model.getEqp_id())) continue;

            HealthStat healthStat = healthService.getDailyScore(fabId, model.getEqp_id(), from, to, from90);
            healthStat.setMeasure_dtts(DateUtils.truncate(from, Calendar.DATE));
            setExpectedAlarm(fabId, healthStat, from, to, 7);

            List<ParamWithCommon> params = reportService.getParamWtihTypeByEqp(fabId, model.getEqp_id());
            if (params.isEmpty()) continue;

            List<CauseAnalysisResult> causes = getCauseAnalysisResults(from, to, fabId, params);
            if (causes.size() > 0) {
                setCauseData(model, healthStat, causes);
            }

            reportService.checkOverSpec(fabId, from, to, healthStat);

            index++;
            logger.info("model: {}, {}/{}", model.getEqp_id(), index, size);
            records.add(healthStat);
        }
        healthService.saveHealthStatWithReport(fabId, records);
    }

    private void setExpectedAlarm(String fabId, HealthStat healthStat, Date pFrom, Date pTo, Integer regressionDays) {
        if (healthStat.getScore() < 0.8 || healthStat.getScore() >= 0.9) return;

        HealthModel model = healthService.getModelByEqpId(fabId, healthStat.getEqp_id());
        if (model.getAlarm_spec() == null) return;

        Date to = pTo;
        Date from = DateUtils.addDays(to, regressionDays * -1);

        List<HealthDaily> health = healthService.getHealth(fabId, healthStat.getEqp_id(), from, to);
        SimpleRegression regression = new SimpleRegression();
        for (HealthDaily indexPDM : health) {
            regression.addData(indexPDM.getMeasure_dtts().getTime(), indexPDM.getValue());
            logger.debug("{ {}, {} },", indexPDM.getMeasure_dtts().getTime(), indexPDM.getValue());
        }
        double intercept = regression.getIntercept();
        double slope = regression.getSlope();
        if (Double.isNaN(intercept) || Double.isNaN(slope) || slope <= 0) return;

        double x = (model.getAlarm_spec() - intercept) / slope;
        logger.debug("spec: {}, slope: {}, intercept: {}", model.getAlarm_spec(), slope, intercept);
        logger.debug("x: {}, pFrom: {}, pTo: {}", x, pFrom.getTime(), pTo.getTime());
        logger.debug("{}", (long) x - pTo.getTime());

        Long days = TimeUnit.DAYS.convert((long) x - pTo.getTime(), TimeUnit.MILLISECONDS);
        healthStat.setExpected_alarm(days);
    }

    private void setCauseData(HealthModel model, HealthStat h, List<CauseAnalysisResult> causes) {
        if (h.getScore() < 0.9) return;

        h.setEqp_id(model.getEqp_id());
        int size = causes.size();

        int index = 0;
        if (size > index) {
            CauseAnalysisResult cause = causes.get(index);
            h.setCause1(cause.toString());
            h.setParamId(cause.getParamId());
            h.setMeasureTrxId(cause.getMeasureTrxId());

            index++;
        }
        if (size > index) {
            h.setCause2(causes.get(index).toString());
            index++;
        }

        StringBuilder sb = new StringBuilder();
        for (; index < size; index++) {
            sb.append(causes.get(index).toString()).append('\n');
        }
        h.setCause3(sb.toString());
    }

    private List<CauseAnalysisResult> getCauseAnalysisResults(Date from, Date to, String fabId, List<ParamWithCommon> paramWithComms) {
        List<CauseAnalysisResult> causes = new ArrayList<>();
        for (ParamWithCommon param : paramWithComms) {
            MeasureTrx measureTrx = traceDataService.getLastMeasureTrx(fabId, param.getParam_id(), from.getTime(), to.getTime());
            if (measureTrx == null) continue;

            CauseAnalysisResult causeAnalysis = traceDataService.getCauseAnalysis(fabId, param, measureTrx.getMeasure_trx_id());
            if (causeAnalysis == null || causeAnalysis.getCauses().isEmpty()) continue;
            causes.add(causeAnalysis);
        }
        return causes;
    }

    @Override
    public void dataPumpBase(Set<String> fabs, Date date, JOB_TYPE jobType, String userId) throws NoSuchMethodException {
        for (String fab : fabs) {
            long start = System.currentTimeMillis();
            logger.info("START {} dataPumpBase .. ", fab);
            saveJobHst(fab, date, JOB.datapumpbase, null, JOB_STATUS.start, jobType, userId);
            logger.info("END   {} dataPumpBase .. {}ms", fab, System.currentTimeMillis() - start);

            String url = "";
            if (fab.equals("fab1")) {
                url = "http://10.59.180.61:28000/pdm/api/master/latest/reload";
            } else if (fab.equals("fab2")) {
                url = "http://10.59.180.61:28001/pdm/api/master/latest/reload";
            } else if (fab.equals("fab3")) {
                url = "http://10.59.180.61:28002/pdm/api/master/latest/reload";
            } else if (fab.equals("fab4")) {
                url = "http://10.59.180.61:28003/pdm/api/master/latest/reload";
            } else if (fab.equals("fab5")) {
                url = "http://10.59.180.61:28004/pdm/api/master/latest/reload";
            }
            pumperMap.get("SKF").dataPumpBase(fab, fabsComponent.getLegacy(fab), url);
            saveJobHst(fab, date, JOB.datapumpbase, null, JOB_STATUS.done, jobType, userId);
        }
    }

    ExecutorService executorService = Executors.newFixedThreadPool(4);

    @Override
    public void dataPump(final Date from, final Date to, Set<String> fabs, JOB_TYPE jobType, String userId) throws NoSuchMethodException {

        //fab2
        String fab = "fab2";
        List<Eqp> eqps = reportService.getEqps(fab);
        logger.debug("fab:{}, eqp size:{}", fab, eqps.size());
        String propertyFileName = fab + "-producer.properties";
        String legacy = fabsComponent.getLegacy(fab);

        Properties prop = new Properties();
        ClassLoader classLoader = getClass().getClassLoader();
        File f1 = new File(classLoader.getResource(String.format("./config/%s", propertyFileName)).getFile());
        try (InputStream confStream = new FileInputStream(f1)) {
            prop.load(confStream);
            logger.debug("loaded config file : {}", ""); //"configPath"
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        int idx = 1;
        for (Eqp eqp : eqps) {
            try {
                long start = System.currentTimeMillis();
                logger.info("START {} dataPump .. [{} ~ {})", fab, ffL.format(from), ffL.format(to));
                //saveJobHst(fab, from, JOB.datapump, null, JOB_STATUS.start, jobType, userId);

                final Producer<String, byte[]> producer = new KafkaProducer<>(prop);
                pumperMap.get(eqp.getData_type_cd()).dataPump(fab, fabsComponent.getLegacy(fab), from, to, eqp.getEqp_id(), producer);

                logger.info("processing... {}/{}", idx++, eqps.size());
                producer.close();

                logger.info("END   {} dataPump .. [{} ~ {}), {}ms", fab, ffL.format(from), ffL.format(to), System.currentTimeMillis() - start);
                //saveJobHst(fab, from, JOB.datapump, null, JOB_STATUS.done, jobType, userId);

            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }




    }

    @Override
    public void alarmUpdate(Date from, Date to, Set<String> fabs, JOB_TYPE jobType, String userId) throws NoSuchMethodException {
//        for(String fab : fabs) {
//            long start = System.currentTimeMillis();
//            logger.info("START {} alarmUpdate .. [{} ~ {})", fab, ffL.format(from) , ffL.format(to));
//            saveJobHst(fab, from, JOB.datapump, null, JOB_STATUS.start, jobType, userId);
//
//            List<Eqp> eqps = reportService.getEqps(fab);
//            int iCount = 1;
//            Date startDate = new Date();
//            for(Eqp eqp: eqps) {
//                pumperMap.get(eqp.getData_type()).alarmUpdate(fab, fabsComponent.getLegacy(fab), from, to, eqp.getEqp_id());
//                iCount = printProgress(fab,eqps.size(),iCount,startDate,"alarmUpdate");
//            }
//            logger.info("END   {} alarmUpdate .. [{} ~ {}), {}ms", fab, ffL.format(from) , ffL.format(to), System.currentTimeMillis() - start);
//            saveJobHst(fab, from, JOB.datapump, null, JOB_STATUS.done, jobType, userId);
//        }
    }


    private int printProgress(String fab, int totalCount, int iCount, Date startDate, String jobName) {
        try {
            long diff = new Date().getTime() - startDate.getTime();

            long diffTotalSeconds = diff / 1000 % 60;
            long diffTotalMinutes = diff / (60 * 1000) % 60;
            long diffTotalHours = diff / (60 * 60 * 1000) % 24;
            long diffTotalDays = diff / (24 * 60 * 60 * 1000);

            diff = (long) ((totalCount - iCount) / (double) iCount * diff);
            long diffSeconds = diff / 1000 % 60;
            long diffMinutes = diff / (60 * 1000) % 60;
            long diffHours = diff / (60 * 60 * 1000) % 24;
            long diffDays = diff / (24 * 60 * 60 * 1000);
            int percentage = (int) ((double) iCount / totalCount * 100);
            logger.info("Processing {} ... Fab:{} {}/{} {}% Estimate=>{}:{}:{} Total=>{}:{}:{}", jobName, fab, iCount++, totalCount, percentage, diffHours, diffMinutes, diffSeconds, diffTotalHours, diffTotalMinutes, diffTotalSeconds);
        } catch (Exception err) {
            logger.error(err.getMessage(), err);
        }
        return iCount;
    }

    @Override
    public void summaryData(String userName, Date from, Date to, Set<String> fabs, Set<Long> passEqpIds, JOB_TYPE jobType, String userId) throws InterruptedException, ExecutionException, ParseException, IOException {
        for (String fab : fabs) {
            logger.info("START {} create health .. [{} ~ {}), eqpIds:{}", fab, ffM.format(from), ffM.format(to), passEqpIds);
            saveJobHst(fab, from, JOB.summarydata, passEqpIds.isEmpty() ? null : passEqpIds, JOB_STATUS.start, jobType, userId);
//            createHealthByFab(from, to, fab, eqpIds);
//            createStatByFab(from, to, fab, eqpIds);

            Date overallSummarySpecDate = DateUtils.addDays(from, -1 * rmsSummaryPeriod);
//            fabService.caculateAvg90(fab, overallSummarySpecDate, from, eqpIds);
            Set<Long> eqpIds = passEqpIds;
            if (passEqpIds.isEmpty()) {
                eqpIds = reportService.getEqps(fab).stream().mapToLong(x -> x.getEqp_id()).boxed().collect(Collectors.toSet());
            }

            int iCount = 1;
            Date startDate = new Date();
            for (Long eqp : eqpIds) {
                reportService.calculateSummary(userName, fab, overallSummarySpecDate, from, to, eqp);
                iCount = printProgress(fab, eqpIds.size(), iCount, startDate, "calculateSummary");
            }

            logger.info("END   {} create health .. [{} ~ {})", fab, ffM.format(from), ffM.format(to));
            saveJobHst(fab, from, JOB.summarydata, eqpIds.isEmpty() ? null : eqpIds, JOB_STATUS.done, jobType, userId);
        }
    }

    @Override
    public void summaryRealTimeData(String userName, Date from, Date to, Set<String> fabs, Set<Long> passEqpIds, JOB_TYPE jobType, String userId) throws InterruptedException, ExecutionException, ParseException, IOException {
        //Realtime은 alarm만 Summary 함.
        for (String fab : fabs) {
            logger.info("START {} create summaryRealTimeData.. [{} ~ {}), eqpIds:{}", fab, ffM.format(from), ffM.format(to), passEqpIds);
            saveJobHst(fab, from, JOB.summaryRealTimeData, passEqpIds.isEmpty() ? null : passEqpIds, JOB_STATUS.start, jobType, userId);

            Date rmsSummaryFromDate = DateUtils.addDays(from, -1 * rmsSummaryPeriod);

            Set<Long> eqpIds = passEqpIds;
            if (passEqpIds.isEmpty()) {
                //Alarm 장비만 가져와서 Summary 진행
//                eqpIds = reportService.getEqps(fab).stream().mapToLong(x -> x.getEqp_id()).boxed().collect(Collectors.toSet());
                eqpIds = reportService.selectExpectedAlarmWarningEqps(fab, from, to);
            }

            int iCount = 1;
            Date startDate = new Date();
            for (Long eqp : eqpIds) {
                reportService.calculateRealTimeSummary(userName, fab, from, to, eqp);
                iCount = printProgress(fab, eqpIds.size(), iCount, startDate, "calculateSummary");
            }

            logger.info("END   {} create summaryRealTimeData .. [{} ~ {})", fab, ffM.format(from), ffM.format(to));
            saveJobHst(fab, from, JOB.summaryRealTimeData, eqpIds.isEmpty() ? null : eqpIds, JOB_STATUS.done, jobType, userId);
        }
    }


    @Override
    public void summaryHealthSTDSPC(Set<String> fabs, Date from, Date to) {
        for (String fab : fabs) {

            PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fab);
            TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

            SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            String fromdate = dtDate.format(from);
            String todate = dtDate.format(to);

            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);

            try {
                stdSummaryMapper.insertSummaryHealthSTDSPC(from, to);
                manager.commit(status);
            } catch (Exception e) {
                manager.rollback(status);
                Throwable ee = e.getCause();
                logger.error("{}, {}", e, ee == null ? e.getMessage() : ee.getMessage());
            }
        }
    }

    @Override
    public void summaryHealthDiff(Set<String> fabs, Date from, Date to) {
        for (String fab : fabs) {

            PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fab);
            TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

            SimpleDateFormat dtDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            String fromdate = dtDate.format(from);
            String todate = dtDate.format(to);

            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);

            try {
                stdSummaryMapper.insertSummaryHealthDiff(fromdate, todate);
                manager.commit(status);
            } catch (Exception e) {
                manager.rollback(status);
                Throwable ee = e.getCause();
                logger.error("{}, {}", e, ee == null ? e.getMessage() : ee.getMessage());
            }
        }
    }

    @Override
    public void summaryHealthRUL(Set<String> fabs, Date from, Date to) {
//        SimpleRegression simpleRegression = new SimpleRegression();
//
//        for(String fab : fabs) {
//
//            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);
//            List<ParamRULSummary> paramRULSummaryList=stdSummaryMapper.selectRULSummary(from, to);
//
//            ArrayList<Long> paramRawIdList = new ArrayList<>();
//            HashMap<Long, Double> paramScore=new HashMap<>();
//
//            for (int i = 0; i < paramRULSummaryList.size(); i++) {
//                if(!paramRawIdList.contains(paramRULSummaryList.get(i).getParam_mst_rawid())){
//
//                    paramRawIdList.add(paramRULSummaryList.get(i).getParam_mst_rawid());
//
//                }
//            }
//
//            for(Long rawid : paramRawIdList){
//                for (int i = 0; i < paramRULSummaryList.size(); i++) {
//                    Long param_mst_rawid=paramRULSummaryList.get(i).getParam_mst_rawid();
//                    if(param_mst_rawid == rawid) {
//                        Long lend_dtts = paramRULSummaryList.get(i).getEnd_dtts().getTime();
//                        Double mean = paramRULSummaryList.get(i).getMean();
//                        simpleRegression.addData(lend_dtts, mean);
//                    }
//                }
//
//                Double alarm_spec=paramRULSummaryList.get(paramRULSummaryList.size()-1).getAlarm_spec();
//                Long lend_time=paramRULSummaryList.get(paramRULSummaryList.size()-1).getEnd_dtts().getTime();
//                Double intercept=simpleRegression.getIntercept();
//                Double slope=simpleRegression.getSlope();
//                Double xValue=(alarm_spec-intercept)/slope;
//
//                Long remain=xValue.longValue()-lend_time;
//                Long days=TimeUnit.DAYS.convert(remain,TimeUnit.MILLISECONDS);
//
//                Double score=0.0;
//
//                if (slope>=0.0){
//                    score=-0.0167*days+1.5;
//                }
//                else{
//                    score=0.0;
//                }
//
//                paramScore.put(rawid,score);
//            }
//
//            System.out.println("hi");
//        }
//
//
//        for(String fab : fabs) {
//
//            PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fab);
//            TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
//
//            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);
//
//            try{
//                stdSummaryMapper.insertSummaryHealthRUL(from,to);
//                manager.commit(status);
//            }
//            catch (Exception e){
//                manager.rollback(status);
//                Throwable ee = e.getCause();
//                logger.error("{}, {}", e, ee == null ? e.getMessage() : ee.getMessage());
//            }
//        }
    }

    @Override
    public void deleteHealthDailySum(Set<String> fabs, Date from, Date end) {
        for (String fab : fabs) {
            PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fab);
            TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);

            try {
                stdSummaryMapper.deleteSummaryHealth(from, end);
                manager.commit(status);
            } catch (Exception e) {
                manager.rollback(status);
                Throwable ee = e.getCause();
                logger.error("{}, {}", e, ee == null ? e.getMessage() : ee.getMessage());
            }
        }
    }

    @Override
    public void deleteEqpAlarmDailySum(Set<String> fabs, Date from, Date to) {
        for (String fab : fabs) {

            PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fab);
            TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);

            try {
                stdSummaryMapper.deleteEqpAlarmDailySum(from, to);
                manager.commit(status);
            } catch (Exception e) {
                manager.rollback(status);
                Throwable ee = e.getCause();
                logger.error("{}, {}", e, ee == null ? e.getMessage() : ee.getMessage());
            }
        }
    }

    @Override
    public void summaryEqpAlarmDaily(Set<String> fabs, Date from, Date to) {
        for (String fab : fabs) {
            PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fab);
            TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);

            try {
                stdSummaryMapper.insertEqpAlarmDailySum(from, to);
                manager.commit(status);
            } catch (Exception e) {
                manager.rollback(status);
                Throwable ee = e.getCause();
                logger.error("{}, {}", e, ee == null ? e.getMessage() : ee.getMessage());
            }
        }
    }

    @Override
    public void summaryParamHealthRUL(Set<String> fabs, Date rulFrom, Date from, Date to) {
        SimpleRegression simpleRegression = new SimpleRegression();

        for (String fab : fabs) {
            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);
            List<ParamRULSummary> paramRULSummaryList = stdSummaryMapper.selectRULSummary(rulFrom, to);

            ArrayList<Long> paramRawIdList = new ArrayList<>();
            HashMap<Long, List<ParamRULSummary>> paramRULSummaryHashMap = new HashMap<>();

            for (int i = 0; i < paramRULSummaryList.size(); i++) {
                if (!paramRawIdList.contains(paramRULSummaryList.get(i).getParam_mst_rawid())) {

                    paramRawIdList.add(paramRULSummaryList.get(i).getParam_mst_rawid());
                }
                if (paramRULSummaryHashMap.containsKey(paramRULSummaryList.get(i).getParam_mst_rawid())) {
                    List<ParamRULSummary> paramRULSummaries = paramRULSummaryHashMap.get(paramRULSummaryList.get(i).getParam_mst_rawid());
                    paramRULSummaries.add(paramRULSummaryList.get(i));
                } else {
                    List<ParamRULSummary> paramRULSummaries = new ArrayList<>();
                    paramRULSummaries.add(paramRULSummaryList.get(i));
                    paramRULSummaryHashMap.put(paramRULSummaryList.get(i).getParam_mst_rawid(), paramRULSummaries);
                }
            }

            for (Long rawid : paramRawIdList) {
                ParamRULSummary paramRULSummary = null;
//                for (int i = 0; i < paramRULSummaryList.size(); i++) {
//                    Long param_mst_rawid=paramRULSummaryList.get(i).getParam_mst_rawid();
//                    if(param_mst_rawid.equals(rawid) ) {
//                        paramRULSummary = paramRULSummaryList.get(i);
//                        Long lEnd_dtts = paramRULSummary.getEnd_dtts().getTime();
//                        Double mean = paramRULSummary.getMean();
//                        simpleRegression.addData(lEnd_dtts, mean);
//                    }
//                }
                simpleRegression = new SimpleRegression();
                List<ParamRULSummary> paramRULSummaries = paramRULSummaryHashMap.get(rawid);
                for (int i = 0; i < paramRULSummaries.size(); i++) {
                    paramRULSummary = paramRULSummaries.get(i);
                    Long lEnd_dtts = paramRULSummary.getEnd_dtts().getTime();
                    Double mean = paramRULSummary.getMean();
                    simpleRegression.addData(lEnd_dtts, mean);
                }

                Double alarm_spec = paramRULSummary.getAlarm_spec();
                Long lend_time = paramRULSummary.getEnd_dtts().getTime();
                Double intercept = simpleRegression.getIntercept();
                Double slope = simpleRegression.getSlope();
                Double xValue = null;
                Long remain = null;
                Long days = null;
                if (slope == 0) {
                    xValue = null;
                } else {
                    xValue = (alarm_spec - intercept) / slope;
                    remain = xValue.longValue() - lend_time;
                    days = TimeUnit.DAYS.convert(remain, TimeUnit.MILLISECONDS);
                }

                Double score = 0.0;

                if (slope > 0.0) {
                    score = -0.0167 * days + 1.5;
                } else {
                    score = 0.0;
                }

                STDParamHealth stdParamHealth = stdSummaryMapper.selectEqpIdandParamHealthMSTRawId(rawid);
                Long eqpId = stdParamHealth.getEqp_mst_rawid();
                Long paramHealthMstRawId = stdParamHealth.getParam_health_mst_rawid();

                if (!(intercept.isNaN() || slope.isNaN() )) {
                    stdSummaryMapper.insertParamHealthRULTRX(paramHealthMstRawId, intercept, slope, xValue, from);

                    stdSummaryMapper.insertSummaryHealthRUL(eqpId, paramHealthMstRawId, score, from);
                }
            }
        }
    }

    @Override
    public void deleteParamHealthRUL(Set<String> fabs, Date from, Date to) {
        for (String fab : fabs) {
            STDSummaryMapper stdSummaryMapper = SqlSessionUtil.getMapper(sessions, fab, STDSummaryMapper.class);

            PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fab);
            TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

            try {
                stdSummaryMapper.deleteParamHealthRUL(from, to);
                manager.commit(status);
            } catch (Exception e) {
                manager.rollback(status);
                Throwable ee = e.getCause();
                logger.error("{}, {}", e, ee == null ? e.getMessage() : ee.getMessage());
            }
        }
    }

    @Override
    public List<BatchJobHst> getJobHst(String fabId, Date start, Date end, JOB_TYPE jobType) {
//        STDReportMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDReportMapper.class);
        FabMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, FabMapper.class);

        List<Code> jobCodes = codeService.getCode("PDM", "JOB", true);
        List<Code> statusCodes = codeService.getCode("PDM", "JOB_STATUS", true);
        List<Code> typeCode = codeService.getCode("PDM", "JOB_TYPE", true);
        List<BatchJobHst> hsts = mapper.selectJobHst(start, end, jobType == JOB_TYPE.NONE ? null : jobType.name());

        for (BatchJobHst hst : hsts) {
            hst.setJob_name(codeService.getCode(jobCodes, hst.getJob_cd()));
            hst.setJob_status_name(codeService.getCode(statusCodes, hst.getJob_status_cd()));
            hst.setJob_type_name(codeService.getCode(typeCode, hst.getJob_type_cd()));
        }

        return hsts;
    }

    @Override
    public void createFeature(Date from, Date to, Set<String> fabs) {
        for (String fab : fabs) {
            logger.info("START {} calc feature .. [{} ~ {})", fab, ffM.format(from), ffM.format(to));
            createFeatureByFab(from, to, fab);
            logger.info("END   {} calc feature .. ");
        }
    }

    private void createFeatureByFab(Date from, Date to, String fabId) {
        List<MeasureTrx> measureTrx = traceDataService.getMeasureTrxData(fabId, from, to);

        int lastIndex = measureTrx.size() - 1;
        int startIndex = 0;
        int endIndex = startIndex + 9999;

//        IMeasureTrxBinService binaryService = BeanFactoryAnnotationUtils.qualifiedBeanOfType(factory, IMeasureTrxBinService.class, "STDMeasureTrxBinService");
        while (lastIndex > startIndex) {
            endIndex = endIndex > lastIndex ? lastIndex : endIndex;
            List<MeasureTrx> sub = measureTrx.subList(startIndex, endIndex);
            Map<Long, List<List<Object>>> timewaveMap = traceRawDataService.getTimewaveMap(fabId, sub);
            createFeature(fabId, timewaveMap, sub);
            logger.info("size: {}, start: {}, end: {}", lastIndex, startIndex, endIndex);

            startIndex = endIndex + 1;
        }
    }

    private void createFeature(String fabId, Map<Long, List<List<Object>>> timewaveMap, List<MeasureTrx> measureTrx) {
        STDHealthMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDHealthMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);

        Date now = new Date();
        Feature d = null;
        try {
            for (MeasureTrx m : measureTrx) {
                Long measureTrxId = m.getMeasure_trx_id();
                List<List<Object>> timewave = timewaveMap.get(measureTrxId);
                if (timewave.isEmpty()) continue;

                d = makeFeature(timewave, m.getValue(), measureTrxId, now);
                mapper.deleteFeature(d);
                mapper.insertFeature(d);

                d = null;
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            logger.error("{}", JsonUtil.toString(d));
            throw new RuntimeException(e.getMessage());
        }
    }

    private Feature makeFeature(List<List<Object>> timewave, Double overall, Long measureTrxId, Date now) {
        int length = timewave.size();
        double[] data = timewave.stream().mapToDouble(x -> (Double) x.get(1)).toArray();

        double min = StatUtils.min(data);
        double max = StatUtils.max(data);
        double mean = StatUtils.mean(data);
        double sumsq = StatUtils.sumSq(data);
        double sumOf4 = Arrays.stream(data).map(d -> Math.pow(d - mean, 4)).sum();
        double sumOf3 = Arrays.stream(data).map(d -> Math.pow(d - mean, 3)).sum();
        double sumOf2 = Arrays.stream(data).map(d -> Math.pow(d - mean, 2)).sum();
        double sumOfabsSqrt = Arrays.stream(data).map(d -> Math.sqrt(Math.abs(d))).sum();
        double sumOfabs = Arrays.stream(data).map(Math::abs).sum();

        double pv = (max - min) / 2;
        double rms = Math.sqrt(sumsq / length);
        double skewness = (sumOf3 / length) / Math.pow(sumOf2 / length, 1.5);
        double kutosis = length * sumOf4 / Math.pow(sumOf2, 2);
        double crest = pv / rms;
        double clearance = pv / Math.pow(sumOfabsSqrt / length, 2);
        double impulse = pv / (sumOfabs / length);
        double shape = rms / (sumOfabs / length);

        Feature d = new Feature();
        d.setMeasure_trx_id(measureTrxId);
        d.setPeak(pv);
        d.setRms(rms);
        d.setSkewness(Double.isNaN(skewness) ? null : skewness);
        d.setKurtosis(Double.isNaN(kutosis) ? null : kutosis);
        d.setCrest(Double.isNaN(crest) ? null : crest);
        d.setClearance(Double.isNaN(clearance) ? null : clearance);
        d.setImpulse(Double.isNaN(impulse) ? null : impulse);
        d.setShape(Double.isNaN(shape) ? null : shape);
        d.setOverall(overall);
        d.setCreate_dtts(now);
        return d;
    }

    private void createHealthByFab(Date from, Date to, String fabId, Set<Long> eqpIds) throws IOException, ParseException, ExecutionException, InterruptedException {
        List<HealthModel> models = healthService.getModels(fabId);
        for (HealthModel model : models) {
            if (!eqpIds.isEmpty() && !eqpIds.contains(model.getEqp_id())) continue;

            List<List<Object>> data = healthService.getHealthByAlgo(fabId, model.getEqp_id(), from.getTime(), to.getTime(), model);
            if (data == null) continue;

            healthService.saveHealth(fabId, model, data);
        }
    }
}
