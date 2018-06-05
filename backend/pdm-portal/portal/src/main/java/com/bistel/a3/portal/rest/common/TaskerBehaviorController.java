package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.TaskerBehavior;
import com.bistel.a3.portal.domain.request.common.BehaviorRequest;
import com.bistel.a3.portal.service.impl.TaskerBehaviorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by yohan on 11/27/15.
 * modified by David Lee on 03/08/17
 */
@RestController
@RequestMapping("/workspaces/{workspaceId}/taskers/{taskerId}/behaviors")
@Transactional
public class TaskerBehaviorController {

    @Autowired
    private TaskerBehaviorService taskerBehaviorService;

    @RequestMapping(method=RequestMethod.GET)
    public List<TaskerBehavior> gets(@PathVariable Long workspaceId, @PathVariable Long taskerId) {
    	return taskerBehaviorService.gets(workspaceId, taskerId);
    }

    @RequestMapping(method=RequestMethod.GET, value="/{taskerBehaviorId}")
    public TaskerBehavior get(@PathVariable Long taskerBehaviorId) {
    	return taskerBehaviorService.get(taskerBehaviorId);
    }

    @RequestMapping(method=RequestMethod.GET, value="/{taskerBehaviorId}/status")
    public Object status(@PathVariable Long taskerBehaviorId) {
        return taskerBehaviorService.getStatus(taskerBehaviorId);
    }

    @RequestMapping(method=RequestMethod.GET, value="/{taskerBehaviorId}/output")
    public Object output(@PathVariable Long taskerBehaviorId) {
    	return taskerBehaviorService.getOutput(taskerBehaviorId);
    }

    @RequestMapping(method=RequestMethod.GET, value="/{taskerBehaviorId}/input")
    public Object input(@PathVariable Long taskerBehaviorId) {
    	return taskerBehaviorService.getInput(taskerBehaviorId);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public Object set(@PathVariable Long taskerId, @RequestBody BehaviorRequest request) {
    	
    	return taskerBehaviorService.create(taskerId, request);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/{taskerBehaviorId}")
    public void remove(@PathVariable Long taskerBehaviorId) {
    	taskerBehaviorService.remove(taskerBehaviorId);
    }
}