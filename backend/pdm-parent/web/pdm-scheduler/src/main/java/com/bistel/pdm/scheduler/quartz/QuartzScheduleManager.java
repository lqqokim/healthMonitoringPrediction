package com.bistel.pdm.scheduler.quartz;

import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.CronScheduleBuilder.dailyAtHourAndMinute;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.JobKey.jobKey;
import static org.quartz.TriggerBuilder.newTrigger;
import static org.quartz.TriggerKey.triggerKey;

/**
 *
 *
 */
public final class QuartzScheduleManager implements IScheduleManager {

    private static final Logger logger = LoggerFactory.getLogger(QuartzScheduleManager.class);

    private Scheduler scheduler;

    public QuartzScheduleManager() {
        try {
            this.scheduler = StdSchedulerFactory.getDefaultScheduler();
        } catch (SchedulerException e) {
            logger.error(e.getMessage(), e);
        }
    }

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
            if (!this.scheduler.isStarted()) {
                this.scheduler.start();
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
            this.scheduler.shutdown(waitForJobsToComplete);
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
            isOk = this.scheduler.deleteJob(jobKey(jobName, jobGroup));
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
    public boolean registerJob(String jobName, String jobGroup, JobDataMap jobDataMap, Class<? extends Job> jobClass) {
        boolean isOk = true;
        try {
            JobDetail job = newJob(jobClass)
                    .withIdentity(jobName, jobGroup)
                    .usingJobData(jobDataMap)
                    .storeDurably()
                    .build();

            if (!this.scheduler.checkExists(job.getKey())) {
                // Add the the job to the scheduler's store
                this.scheduler.addJob(job, false);
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
    public boolean updateJob(String jobName, String jobGroup, JobDataMap jobDataMap, Class<? extends Job> jobClass) {
        boolean isOk = true;
        try {
            JobDetail job = newJob(jobClass)
                    .withIdentity(jobName, jobGroup)
                    .usingJobData(jobDataMap)
                    .storeDurably()
                    .build();

            this.scheduler.addJob(job, true);
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
                this.scheduler.scheduleJob(trigger);
                logger.info(triggerName + " trigger was scheduled.");
            } else {
                logger.info(triggerName + " trigger already existed.");
                this.scheduler.unscheduleJob(triggerKey(triggerName, jobGroup));
                this.scheduler.scheduleJob(trigger);
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
                this.scheduler.scheduleJob(trigger);
                logger.info(triggerName + " trigger was scheduled.");
            } else {
                logger.info(triggerName + " trigger already existed.");
                this.scheduler.unscheduleJob(triggerKey(triggerName, jobGroup));
                this.scheduler.scheduleJob(trigger);
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
            this.scheduler.rescheduleJob(triggerKey(triggerName, jobGroup), trigger);
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
            Trigger oldTrigger = this.scheduler.getTrigger(triggerKey(oldTriggerName, oldTriggerGroupName));

            // obtain a builder that would produce the trigger
            @SuppressWarnings("rawtypes")
            TriggerBuilder triggerbuilder = oldTrigger.getTriggerBuilder();

            // update the schedule associated with the builder, and build the new trigger
            // (other builder methods could be called, to change the trigger in any desired way)
            @SuppressWarnings("unchecked")
            Trigger newTrigger = triggerbuilder.withSchedule(cronSchedule(cronExpression))
                    .startNow()
                    .build();

            this.scheduler.rescheduleJob(oldTrigger.getKey(), newTrigger);
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
            Trigger oldTrigger = this.scheduler.getTrigger(triggerKey(oldTriggerName, oldTriggerGroupName));

            // obtain a builder that would produce the trigger
            @SuppressWarnings("rawtypes")
            TriggerBuilder triggerbuilder = oldTrigger.getTriggerBuilder();

            // update the schedule associated with the builder, and build the new trigger
            // (other builder methods could be called, to change the trigger in any desired way)
            @SuppressWarnings("unchecked")
            Trigger newTrigger = triggerbuilder.withSchedule(dailyAtHourAndMinute(Integer.parseInt(hour), Integer.parseInt(minute)))
                    .startNow()
                    .build();

            this.scheduler.rescheduleJob(oldTrigger.getKey(), newTrigger);
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
            this.scheduler.unscheduleJob(triggerKey(triggerName, jobGroup));
        } catch (SchedulerException e) {
            isOk = false;
            logger.error(e.getMessage(), e);
        }
        return isOk;
    }
}
