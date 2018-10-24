package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.enums.JOB_TYPE;
import com.bistel.a3.portal.module.pdm.FabsComponent;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.util.Calendar;
import java.util.Date;

@Service
@Profile({"HMC"})
public class HMCSchedulerService {
    private static Logger logger = LoggerFactory.getLogger(HMCSchedulerService.class);

    @Autowired
    private IBatchTaskService batchTaskService;

    @Autowired
    private FabsComponent fabsComponent;

    private static FastDateFormat ff = FastDateFormat.getDateInstance(DateFormat.DEFAULT);

//    @Scheduled(cron="${schedule.datapumpbase}")
//    public void datepumpBase() throws NoSuchMethodException {
//        Date date = DateUtils.truncate(new Date(), Calendar.DATE);
//        logger.info("START scheduled datepump base {}", ff.format(date));
//        batchTaskService.dataPumpBase(fabsComponent.scheduleFabs(), date, JOB_TYPE.SCHEDULER, "SCHEDULER");
//        logger.info("END   scheduled datepump base {}", ff.format(date));
//    }




    }
