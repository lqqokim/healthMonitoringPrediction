package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.Tasker;
import com.bistel.a3.portal.service.impl.TaskerService;
import com.bistel.a3.portal.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * Created by yohan on 15. 11. 3.
 * Modified by David Lee on 03/08/17
 */
@RestController
@RequestMapping("/workspaces/{workspaceId}/taskers")
@Transactional
public class TaskerController {
    @Autowired
    private TaskerService taskerService;

    /**
     * GET : /service/workspaces/{workspaceId}/taskers
     *       /service/workspaces/{workspaceId}/taskers?parentId={parentId}  
     * @param workspaceId
     * @param params
     * @return
     */
    @RequestMapping(method = RequestMethod.GET)
    public List<Tasker> gets(@PathVariable Long workspaceId, @RequestParam Map<String, String> params) {
        if(params.isEmpty()){
            return taskerService.getTakserListByWorkspaceId(workspaceId);
        } else {
            return taskerService.getTakserListByParentId(workspaceId, StringUtil.parseLong(params.get("parentId")));
        }
    }

    @RequestMapping(method = RequestMethod.PUT)
    public Tasker create(@RequestBody Tasker tasker, @PathVariable Long workspaceId) {

    	return taskerService.createTasker(tasker, workspaceId);
   	}

    @RequestMapping(value = "/{taskerId}")
    public Tasker get(@PathVariable Long taskerId) {
        return taskerService.getTakserById(taskerId);
    }

    @RequestMapping(value="/{taskerId}", method = RequestMethod.PUT)
    public Tasker update(@RequestBody Tasker tasker, @PathVariable Long workspaceId, @PathVariable Long taskerId) {
    	
    	return taskerService.modifyTasker(tasker, workspaceId, taskerId);
    }

    @RequestMapping(value="/{taskerId}", method = RequestMethod.DELETE)
    public void remove(@PathVariable Long workspaceId, @PathVariable Long taskerId, Principal user) {
    	taskerService.removeTakserById(workspaceId, taskerId, user);
    }
}
