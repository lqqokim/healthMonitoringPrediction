package com.bistel.pdm.scheduler.controller;

import org.quartz.Scheduler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class SchedulerController {
    private static final Logger log = LoggerFactory.getLogger(SchedulerController.class);

    @Autowired
    private Scheduler scheduler;

    @RequestMapping(method = RequestMethod.GET, value = "/hmp/schedule")
    public String getJobs(@RequestParam(value = "name", defaultValue = "") String name) {
        return "";
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/hmp/delete/schd/{regdNum}")
    public String deleteSchedule(@PathVariable("regdNum") String regdNum) {
        return ""; //obj.getInstance().deleteStudent(regdNum);
    }
}
