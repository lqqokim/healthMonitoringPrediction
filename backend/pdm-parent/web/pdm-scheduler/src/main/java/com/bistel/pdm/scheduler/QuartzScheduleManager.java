package com.bistel.pdm.scheduler;

//import static org.quartz.SimpleScheduleBuilder.simpleSchedule;

import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.CronScheduleBuilder.dailyAtHourAndMinute;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.JobKey.jobKey;
import static org.quartz.TriggerBuilder.newTrigger;
import static org.quartz.TriggerKey.triggerKey;

@Component
public class QuartzScheduleManager implements IScheduleManager {
    private static final Logger logger = LoggerFactory.getLogger(QuartzScheduleManager.class);

    private final Scheduler scheduler;

    @Autowired
    public QuartzScheduleManager(Scheduler scheduler) {
        this.scheduler = scheduler;
    }

    /**
     * start the scheduler.
     */
    @Override
    public boolean execute() {
        boolean isOk = true;
        try {
            if (!scheduler.isStarted()) {
                scheduler.start();
            }
        } catch (Exception e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    /**
     * shutdown the scheduler
     */
    @Override
    public boolean shutdown(boolean waitForJobsToComplete) {
        boolean isOk = true;
        try {
            scheduler.shutdown(waitForJobsToComplete);
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    /**
     * Deleting a Job and Unscheduling all of its Triggers
     */
    @Override
    public boolean deleteJob(String jobName, String jobGroup) {
        boolean isOk = true;
        try {
            isOk = scheduler.deleteJob(jobKey(jobName, jobGroup));
            logger.info(jobName + " job deleted and unscheduled all of its triggers.");
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    /**
     * Define a durable job instance (durable jobs can exist without triggers)
     */
    @Override
    public boolean registerJob(String jobName, String jobGroup, JobDataMap jobDataMap, Class<? extends QuartzJobBean> jobClass) {
        boolean isOk = true;
        try {
            JobDetail job = newJob(jobClass)
                    .withIdentity(jobName, jobGroup)
                    .usingJobData(jobDataMap)
                    .storeDurably()
                    .build();

            if (!scheduler.checkExists(job.getKey())) {
                // Add the the job to the scheduler's store
                scheduler.addJob(job, false);
                logger.info(jobName + " job stored.");
            } else {
                logger.info(jobName + " job already existed.");
            }
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    @Override
    public boolean updateJob(String jobName, String jobGroup, JobDataMap jobDataMap, Class<? extends QuartzJobBean> jobClass) {
        boolean isOk = true;
        try {
            JobDetail job = newJob(jobClass)
                    .withIdentity(jobName, jobGroup)
                    .usingJobData(jobDataMap)
                    .storeDurably()
                    .build();

            scheduler.addJob(job, true);
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    /**
     * Scheduling an Already Stored Job -
     * If you want a trigger that always fires at a certain time of day, use CronTrigger or
     * CalendarIntervalTrigger, because these triggers will preserve the firing time across
     * daylight savings time changes.
     */
    @Override
    public boolean triggeringJobDailyHourAndMin(String jobName, String jobGroup, String triggerName, String hour, String minute) {
        boolean isOk = true;
        try {
            // Define a Trigger that will fire "now" and associate it with the existing job
            Trigger trigger = newTrigger()
                    .withIdentity(triggerName, jobGroup)
                    .withSchedule(dailyAtHourAndMinute(Integer.parseInt(hour), Integer.parseInt(minute))) // fire every day at 15:00
                    .forJob(jobKey(jobName, jobGroup))
                    .build();

            if (!this.scheduler.checkExists(triggerKey(triggerName, jobGroup))) {
                // Schedule the trigger
                scheduler.scheduleJob(trigger);
                logger.info(triggerName + " trigger was scheduled.");
            } else {
                logger.info(triggerName + " trigger already existed.");
                scheduler.unscheduleJob(triggerKey(triggerName, jobGroup));
                scheduler.scheduleJob(trigger);
                logger.info(triggerName + " trigger was rescheduled.");
            }
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    /**
     * Scheduling an Already Stored Job
     */
    @Override
    public boolean triggeringJob(String jobName, String jobGroup, String triggerName, String cronExpression) {
        boolean isOk = true;
        try {
            // Define a Trigger that will fire "now" and associate it with the existing job
            Trigger trigger = newTrigger()
                    .withIdentity(triggerName, jobGroup)
                    .startNow()
                    .withSchedule(cronSchedule(cronExpression))
                    .forJob(jobKey(jobName, jobGroup))
                    .build();

            if (!this.scheduler.checkExists(triggerKey(triggerName, jobGroup))) {
                // Schedule the trigger
                scheduler.scheduleJob(trigger);
                logger.info(triggerName + " trigger was scheduled.");
            } else {
                logger.info(triggerName + " trigger already existed.");
                scheduler.unscheduleJob(triggerKey(triggerName, jobGroup));
                scheduler.scheduleJob(trigger);
                logger.info(triggerName + " trigger was rescheduled.");
            }
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    @Override
    public boolean replacingJob(String jobName, String jobGroup, String triggerName, String cronExpression) {
        boolean isOk = true;
        try {
            // Define a Trigger that will fire "now" and associate it with the existing job
            Trigger trigger = newTrigger()
                    .withIdentity(triggerName, jobGroup)
                    .startNow()
                    .withSchedule(cronSchedule(cronExpression))
                    .forJob(jobKey(jobName, jobGroup))
                    .build();

            // tell the scheduler to remove the old trigger with the given key, and
            // put the new one in its place
            scheduler.rescheduleJob(triggerKey(triggerName, jobGroup), trigger);
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    /**
     * Updating an Existing Trigger
     */
    @Override
    public boolean updateTrigger(String oldTriggerName, String oldTriggerGroupName, String newTriggerName, String cronExpression) {
        boolean isOk = true;
        try {
            // retrieve the trigger
            Trigger oldTrigger = scheduler.getTrigger(triggerKey(oldTriggerName, oldTriggerGroupName));

            // obtain a builder that would produce the trigger
            @SuppressWarnings("rawtypes")
            TriggerBuilder triggerbuilder = oldTrigger.getTriggerBuilder();

            // update the schedule associated with the builder, and build the new trigger
            // (other builder methods could be called, to change the trigger in any desired way)
            @SuppressWarnings("unchecked")
            Trigger newTrigger = triggerbuilder.withSchedule(cronSchedule(cronExpression))
                    .startNow()
                    .build();

            scheduler.rescheduleJob(oldTrigger.getKey(), newTrigger);
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    @Override
    public boolean updateTriggerDailyHourAndMin(String oldTriggerName, String oldTriggerGroupName, String newTriggerName,
                                                String hour, String minute) {
        boolean isOk = true;
        try {
            // retrieve the trigger
            Trigger oldTrigger = scheduler.getTrigger(triggerKey(oldTriggerName, oldTriggerGroupName));

            // obtain a builder that would produce the trigger
            @SuppressWarnings("rawtypes")
            TriggerBuilder triggerbuilder = oldTrigger.getTriggerBuilder();

            // update the schedule associated with the builder, and build the new trigger
            // (other builder methods could be called, to change the trigger in any desired way)
            @SuppressWarnings("unchecked")
            Trigger newTrigger = triggerbuilder.withSchedule(dailyAtHourAndMinute(Integer.parseInt(hour), Integer.parseInt(minute)))
                    .startNow()
                    .build();

            scheduler.rescheduleJob(oldTrigger.getKey(), newTrigger);
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }

    @Override
    public boolean unscheduleingJob(String jobGroup, String triggerName) {
        boolean isOk = true;
        try {
            // Unschedule a particular trigger from the job (a job may have more than one trigger)
            scheduler.unscheduleJob(triggerKey(triggerName, jobGroup));
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }
}
