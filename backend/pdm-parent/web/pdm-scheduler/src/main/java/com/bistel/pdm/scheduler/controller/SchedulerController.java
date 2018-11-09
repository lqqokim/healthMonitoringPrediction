package com.bistel.pdm.scheduler.controller;

import com.bistel.pdm.scheduler.job.impl.AlarmSummaryJob;
import com.bistel.pdm.scheduler.job.impl.HealthSummaryJob;
import com.bistel.pdm.scheduler.service.SchedulerJobService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hmp/scheduler")
public class SchedulerController {
    private static final Logger log = LoggerFactory.getLogger(SchedulerController.class);

    @Autowired
    private SchedulerJobService schedulerJobService;

    @RequestMapping("/schedule")
    public ServerResponse schedule(@RequestParam("jobName") String jobName,
                                   @RequestParam("jobScheduleTime") @DateTimeFormat(pattern = "yyyy/MM/dd HH:mm") Date jobScheduleTime,
                                   @RequestParam("cronExpression") String cronExpression,
                                   @RequestParam("taskName") String taskName) {

        //Job Name is mandatory
        if (jobName == null || jobName.trim().equals("")) {
            return getServerResponse(ServerResponseCode.JOB_NAME_NOT_PRESENT, false);
        }

        //Check if job Name is unique;
        if (!schedulerJobService.isJobWithNamePresent(jobName)) {

            boolean status = false;
            if (cronExpression == null || cronExpression.trim().equals("")) {

                if(taskName.equalsIgnoreCase("ALARM")){
                    //Single Trigger
                    status = schedulerJobService.scheduleOneTimeJob(jobName, AlarmSummaryJob.class, jobScheduleTime);
                } else if (taskName.equalsIgnoreCase("HEALTH")){
                    status = schedulerJobService.scheduleOneTimeJob(jobName, HealthSummaryJob.class, jobScheduleTime);
                }

                if (status) {
                    return getServerResponse(ServerResponseCode.SUCCESS, schedulerJobService.getAllJobs());
                } else {
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }

            } else {

                if(taskName.equalsIgnoreCase("ALARM")){
                    status = schedulerJobService.scheduleCronJob(jobName, AlarmSummaryJob.class, jobScheduleTime, cronExpression);
                } else if (taskName.equalsIgnoreCase("HEALTH")){
                    status = schedulerJobService.scheduleCronJob(jobName, HealthSummaryJob.class, jobScheduleTime, cronExpression);
                }

                if (status) {
                    return getServerResponse(ServerResponseCode.SUCCESS, schedulerJobService.getAllJobs());
                } else {
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }
            }
        } else {
            return getServerResponse(ServerResponseCode.JOB_WITH_SAME_NAME_EXIST, false);
        }
    }

    @RequestMapping("/unschedule")
    public void unschedule(@RequestParam("jobName") String jobName) {
        schedulerJobService.unScheduleJob(jobName);
        log.debug("{} unscheduled.", jobName);
    }

    @RequestMapping("/delete")
    public ServerResponse delete(@RequestParam("jobName") String jobName) {
        if (schedulerJobService.isJobWithNamePresent(jobName)) {
            boolean isJobRunning = schedulerJobService.isJobRunning(jobName);

            if (!isJobRunning) {
                boolean status = schedulerJobService.deleteJob(jobName);
                log.debug("{} job deleted.", jobName);

                if (status) {
                    return getServerResponse(ServerResponseCode.SUCCESS, true);
                } else {
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }
            } else {
                return getServerResponse(ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE, false);
            }
        } else {
            //Job doesn't exist
            return getServerResponse(ServerResponseCode.JOB_DOESNT_EXIST, false);
        }
    }

    @RequestMapping("/pause")
    public ServerResponse pause(@RequestParam("jobName") String jobName) {
        if (schedulerJobService.isJobWithNamePresent(jobName)) {

            boolean isJobRunning = schedulerJobService.isJobRunning(jobName);

            if (!isJobRunning) {
                boolean status = schedulerJobService.pauseJob(jobName);
                if (status) {
                    return getServerResponse(ServerResponseCode.SUCCESS, true);
                } else {
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }
            } else {
                return getServerResponse(ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE, false);
            }

        } else {
            //Job doesn't exist
            return getServerResponse(ServerResponseCode.JOB_DOESNT_EXIST, false);
        }
    }

    @RequestMapping("/resume")
    public ServerResponse resume(@RequestParam("jobName") String jobName) {
        if (schedulerJobService.isJobWithNamePresent(jobName)) {
            String jobState = schedulerJobService.getJobState(jobName);

            if (jobState.equals("PAUSED")) {
                System.out.println("Job current state is PAUSED, Resuming job...");
                boolean status = schedulerJobService.resumeJob(jobName);

                if (status) {
                    return getServerResponse(ServerResponseCode.SUCCESS, true);
                } else {
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }
            } else {
                return getServerResponse(ServerResponseCode.JOB_NOT_IN_PAUSED_STATE, false);
            }

        } else {
            //Job doesn't exist
            return getServerResponse(ServerResponseCode.JOB_DOESNT_EXIST, false);
        }
    }

    @RequestMapping("/update")
    public ServerResponse updateJob(@RequestParam("jobName") String jobName,
                                    @RequestParam("jobScheduleTime") @DateTimeFormat(pattern = "yyyy/MM/dd HH:mm") Date jobScheduleTime,
                                    @RequestParam("cronExpression") String cronExpression) {

        //Job Name is mandatory
        if (jobName == null || jobName.trim().equals("")) {
            return getServerResponse(ServerResponseCode.JOB_NAME_NOT_PRESENT, false);
        }

        //Edit Job
        if (schedulerJobService.isJobWithNamePresent(jobName)) {

            if (cronExpression == null || cronExpression.trim().equals("")) {
                //Single Trigger
                boolean status = schedulerJobService.updateOneTimeJob(jobName, jobScheduleTime);
                if (status) {
                    return getServerResponse(ServerResponseCode.SUCCESS, schedulerJobService.getAllJobs());
                } else {
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }

            } else {
                //Cron Trigger
                boolean status = schedulerJobService.updateCronJob(jobName, jobScheduleTime, cronExpression);
                if (status) {
                    return getServerResponse(ServerResponseCode.SUCCESS, schedulerJobService.getAllJobs());
                } else {
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }
            }


        } else {
            return getServerResponse(ServerResponseCode.JOB_DOESNT_EXIST, false);
        }
    }

    @RequestMapping("/allJobs")
    public ServerResponse getAllJobs() {
        List<Map<String, Object>> list = schedulerJobService.getAllJobs();
        return getServerResponse(ServerResponseCode.SUCCESS, list);
    }

    @RequestMapping("/checkJobName")
    public ServerResponse checkJobName(@RequestParam("jobName") String jobName) {
        //Job Name is mandatory
        if (jobName == null || jobName.trim().equals("")) {
            return getServerResponse(ServerResponseCode.JOB_NAME_NOT_PRESENT, false);
        }

        boolean status = schedulerJobService.isJobWithNamePresent(jobName);
        return getServerResponse(ServerResponseCode.SUCCESS, status);
    }

    @RequestMapping("/isJobRunning")
    public ServerResponse isJobRunning(@RequestParam("jobName") String jobName) {
        boolean status = schedulerJobService.isJobRunning(jobName);
        return getServerResponse(ServerResponseCode.SUCCESS, status);
    }

    @RequestMapping("/jobState")
    public ServerResponse getJobState(@RequestParam("jobName") String jobName) {
        String jobState = schedulerJobService.getJobState(jobName);
        return getServerResponse(ServerResponseCode.SUCCESS, jobState);
    }

    @RequestMapping("/stop")
    public ServerResponse stopJob(@RequestParam("jobName") String jobName) {
        if (schedulerJobService.isJobWithNamePresent(jobName)) {

            if (schedulerJobService.isJobRunning(jobName)) {
                boolean status = schedulerJobService.stopJob(jobName);
                if (status) {
                    return getServerResponse(ServerResponseCode.SUCCESS, true);
                } else {
                    //Server error
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }

            } else {
                //Job not in running state
                return getServerResponse(ServerResponseCode.JOB_NOT_IN_RUNNING_STATE, false);
            }

        } else {
            //Job doesn't exist
            return getServerResponse(ServerResponseCode.JOB_DOESNT_EXIST, false);
        }
    }

    @RequestMapping("/start")
    public ServerResponse startJobNow(@RequestParam("jobName") String jobName) {
        if (schedulerJobService.isJobWithNamePresent(jobName)) {

            if (!schedulerJobService.isJobRunning(jobName)) {
                boolean status = schedulerJobService.startJobNow(jobName);
                log.debug("{} job started.", jobName);

                if (status) {
                    //Success
                    return getServerResponse(ServerResponseCode.SUCCESS, true);
                } else {
                    //Server error
                    return getServerResponse(ServerResponseCode.ERROR, false);
                }

            } else {
                //Job already running
                return getServerResponse(ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE, false);
            }

        } else {
            //Job doesn't exist
            return getServerResponse(ServerResponseCode.JOB_DOESNT_EXIST, false);
        }
    }

    public ServerResponse getServerResponse(int responseCode, Object data) {
        ServerResponse serverResponse = new ServerResponse();
        serverResponse.setStatusCode(responseCode);
        serverResponse.setData(data);
        return serverResponse;
    }
}
