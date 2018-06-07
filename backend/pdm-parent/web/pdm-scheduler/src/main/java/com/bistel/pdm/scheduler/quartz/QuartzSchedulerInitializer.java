package com.bistel.pdm.scheduler.quartz;

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
public class QuartzSchedulerInitializer {

    private static final Logger logger = LoggerFactory.getLogger(QuartzSchedulerInitializer.class);

    private static final String DEFAULT_SCHEMA_LOCATION = "classpath:schema-@@platform@@.sql";
    private String startDelay = "30";

    public Scheduler init(){
        Scheduler scheduler = null;

        try {
            StdSchedulerFactory stdScheduler = new StdSchedulerFactory();
            stdScheduler.initialize(quartzProperties());

            scheduler = stdScheduler.getScheduler();

//            // custom job factory of spring with DI support for @Autowired!
//            AutowiringSpringBeanJobFactory jobFactory = new AutowiringSpringBeanJobFactory();
//            jobFactory.setApplicationContext(applicationContext);
//            scheduler.setJobFactory(jobFactory);
//            if(properties.isIgnoreMisfire()){
//
//                List<String> triggerGroupNames = scheduler.getTriggerGroupNames();
//                Date now = new Date();
//                for(int i = 0 ; i < triggerGroupNames.size(); i++)
//                {
//                    for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals(triggerGroupNames.get(i)))) {
//                        String jobName = jobKey.getName();
//                        String jobGroup = jobKey.getGroup();
//                        try{
//                            List<Trigger> triggers = (List<Trigger>) scheduler.getTriggersOfJob(jobKey);
//                            if(triggers.size()>0){
//                                CronTrigger trigger = (CronTrigger)triggers.get(0);
//                                Date nextFireTime = trigger.getNextFireTime();
//                                if (nextFireTime.before(now)){
//                                    Trigger newTrigger = newTrigger()
//                                            .withIdentity(trigger.getKey().getName(), jobGroup)
//                                            .startNow()
//                                            .withSchedule(cronSchedule(trigger.getCronExpression()).withMisfireHandlingInstructionDoNothing())
//                                            .forJob(jobKey(jobName, jobGroup))
//                                            .build();
//
//                                    scheduler.rescheduleJob(trigger.getKey(), newTrigger);
//                                    logger.info("{} was rescheduled.", "[jobName] : " + jobName + " [groupName] : "+ jobGroup + " - ");
//                                }
//
//                            }
//                        }catch(Exception ex){
//                            logger.error("Reschedule misfire schedule.[jobName] : " + jobName + " [groupName] : "+ jobGroup +";Error:" + ex.getMessage());
//                        }
//
//                    }
//                }
//            }

            if(!scheduler.isStarted()){
                scheduler.startDelayed(Integer.parseInt(startDelay));
            }

            logger.info("{} was initialized.", scheduler.getSchedulerName());
        } catch (SchedulerException e) {
            logger.error("Cannot create edm-Scheduler.");
        }
        return scheduler;
    }

    private Properties quartzProperties() {
        Properties properties = null;
        return properties;
    }
}
