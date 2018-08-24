package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.pdm.ManualClassification;
import com.bistel.a3.portal.enums.JOB_TYPE;
import com.bistel.a3.portal.service.pdm.IBatchTaskService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("pdm/manual")
public class ManualTaskController {
    private static Logger logger = LoggerFactory.getLogger(ManualTaskController.class);
    private static FastDateFormat ff = FastDateFormat.getDateInstance(DateFormat.DEFAULT);

    @Autowired
    private IBatchTaskService batchService;

    @Autowired
    private ITraceDataService traceDataService;

    @RequestMapping("datapumpbase")
    public void datapumpbase(@RequestParam("fabs") Set<String> fabs, Principal user) throws NoSuchMethodException {
        long start = System.currentTimeMillis();
        logger.info("MANUAL dataPumpBase .. ");
        batchService.dataPumpBase(fabs, DateUtils.truncate(new Date(), Calendar.DATE), JOB_TYPE.MANUAL, user.getName());
        logger.info("MANUAL dataPumpBase runtime .. {} ms", System.currentTimeMillis() - start);
    }

    @RequestMapping("datapump")
    public void datapump(@RequestParam("date") String dateStr, @RequestParam("day") Integer day, @RequestParam("fabs") Set<String> fabs, Principal user) throws ParseException, NoSuchMethodException {
        long start = System.currentTimeMillis();
        Date date = DateUtils.parseDate(dateStr, "yyyy-MM-dd");
        logger.info("MANUAL datapump .. [{} ~ {})", ff.format(date), ff.format(DateUtils.addDays(date, day)));
        for(int i=0; i<day; i++ ) {
            batchService.dataPump(date, DateUtils.ceiling(date, Calendar.DATE), fabs, JOB_TYPE.MANUAL, user.getName());
            logger.info("MANUAL datapump .. {} done.", ff.format(date));
            date = DateUtils.addDays(date, 1);
        }
        logger.info("MANUAL datapump runtime .. {} ms", System.currentTimeMillis() - start);
    }
    @RequestMapping("alarmupdate")
    public void alarmUpdate(@RequestParam("date") String dateStr, @RequestParam("day") Integer day, @RequestParam("fabs") Set<String> fabs, Principal user) throws ParseException, NoSuchMethodException {
        long start = System.currentTimeMillis();
        Date date = DateUtils.parseDate(dateStr, "yyyy-MM-dd");
        logger.info("MANUAL alarmUpdate .. [{} ~ {})", ff.format(date), ff.format(DateUtils.addDays(date, day)));
        for(int i=0; i<day; i++ ) {
            batchService.alarmUpdate(date, DateUtils.ceiling(date, Calendar.DATE), fabs, JOB_TYPE.MANUAL, user.getName());
            logger.info("MANUAL alarmUpdate .. {} done.", ff.format(date));
            date = DateUtils.addDays(date, 1);
        }
        logger.info("MANUAL datapump runtime .. {} ms", System.currentTimeMillis() - start);
    }

    @RequestMapping("summarydata")
    public void summaryData(@RequestParam("date") String dateString,
                           @RequestParam("day") Integer day,
                           @RequestParam("fabs") Set<String> fabs,
                           @RequestParam(value = "eqpIds", required = false) Set<Long> eqpIds,
                           Principal user) throws InterruptedException, ExecutionException, ParseException, IOException {
        long start = System.currentTimeMillis();
        Date date = DateUtils.parseDate(dateString, "yyyy-MM-dd");
        logger.info("MANUAL summarydata .. [{} ~ {})", ff.format(date), ff.format(DateUtils.addDays(date, day)));
        if(eqpIds == null) eqpIds = Collections.EMPTY_SET;
        for(int i=0; i<day; i++ ) {
            batchService.summaryData(user.getName(), date, DateUtils.ceiling(date, Calendar.DATE), fabs, eqpIds, JOB_TYPE.MANUAL, user.getName());
            logger.info("MANUAL summarydata .. {} done.", ff.format(date));
            date = DateUtils.addDays(date, 1);
        }
        logger.info("MANUAL summarydata runtime .. {} ms", System.currentTimeMillis() - start);
    }

    @RequestMapping("createfeature")
    public void createfeature(@RequestParam("date") String dateString, @RequestParam("day") Integer day, @RequestParam("fabs") Set<String> fabs) throws ParseException {
        long start = System.currentTimeMillis();
        Date date = DateUtils.parseDate(dateString, "yyyy-MM-dd");
        logger.info("MANUAL createfeature .. [{} ~ {})", ff.format(date), ff.format(DateUtils.addDays(date, day)));
        for(int i=0; i<day; i++ ) {
            batchService.createFeature(date, DateUtils.ceiling(date, Calendar.DATE), fabs);
            logger.info("MANUAL createfeature .. {} done.", ff.format(date));
            date = DateUtils.addDays(date, 1);
        }
        logger.info("MANUAL createfeature runtime .. {} ms", System.currentTimeMillis() - start);
    }

    @RequestMapping(value = "classification", method = RequestMethod.POST)
    public Object classification(@RequestBody ManualClassification request) {
        return traceDataService.manualClassification(request);
    }

    @RequestMapping(value = "jobhst", method = RequestMethod.GET)
    public Object jobhst(@RequestParam("fab") String fab, @RequestParam("start") Long start, @RequestParam("end") Long end, @RequestParam(value = "type", defaultValue = "NONE") JOB_TYPE type) {
        return batchService.getJobHst(fab, new Date(start), new Date(end), type);
    }
}
