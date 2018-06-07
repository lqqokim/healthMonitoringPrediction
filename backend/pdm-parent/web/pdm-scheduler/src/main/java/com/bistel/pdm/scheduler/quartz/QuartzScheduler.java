package com.bistel.pdm.scheduler.quartz;

import com.bistel.pdm.common.io.PropertyLoader;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;

/**
 *
 *
 */
public class QuartzScheduler {

    private static final Logger log = LoggerFactory.getLogger(QuartzScheduler.class);

    private Scheduler scheduler;
    private String propertyPath = "quartz.properties";
    private String startDelay = "30";

    public QuartzScheduler(String propertyPath){
        try {
            if(propertyPath.length() > 0){
                this.propertyPath = propertyPath;
            }

            StdSchedulerFactory stdScheduler = new StdSchedulerFactory();
            stdScheduler.initialize(quartzProperties());

            scheduler = stdScheduler.getScheduler();

//            if(!scheduler.isStarted()){
//                scheduler.startDelayed(Integer.parseInt(startDelay));
//            }

            log.info("{} was initialized.", scheduler.getSchedulerName());

        } catch (SchedulerException e) {
            log.error("Cannot create scheduler.");
        }
    }

    private Properties quartzProperties() {
        return PropertyLoader.load(propertyPath);
    }

    public void start() throws SchedulerException {
        this.scheduler.start();
    }

    public synchronized void shutdown() {
        try {
            this.scheduler.shutdown();
            log.info("scheduler shutdown complete.");
        } catch (SchedulerException e) {
            log.error(e.getMessage(), e);
        }
    }
}
