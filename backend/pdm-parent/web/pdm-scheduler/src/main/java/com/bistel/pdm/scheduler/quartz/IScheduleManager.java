package com.bistel.pdm.scheduler.quartz;

import org.quartz.Job;
import org.quartz.JobDataMap;

/**
 *
 *
 */
public interface IScheduleManager {

    public boolean execute();
    public boolean shutdown(boolean waitForJobsToComplete);

    public boolean deleteJob(String jobName, String jobGroup);
    public boolean registerJob(String jobName, String jobGroup, JobDataMap jobDataMap, Class<? extends Job> jobClass);
    public boolean updateJob(String jobName, String jobGroup, JobDataMap jobDataMap, Class<? extends Job> jobClass);
    public boolean triggeringJob(String jobName, String jobGroup, String triggerName, String cronExpression);
    public boolean replacingJob(String jobName, String jobGroup, String triggerName, String cronExpression);
    public boolean unscheduleingJob(String jobGroup, String triggerName);
    public boolean triggeringJobDailyHourAndMin(String jobName, String jobGroup, String triggerName, String hour, String minute);
    public boolean updateTrigger(String oldTriggerName, String oldTriggerGroupName, String newTriggerName, String cronExpression);
    public boolean updateTriggerDailyHourAndMin(String oldTriggerName, String oldTriggerGroupName, String newTriggerName, String hour, String minute);
}
