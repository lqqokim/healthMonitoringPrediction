package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.Tasker;
import com.bistel.a3.portal.module.common.TaskerComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

/**
 * Created by David Lee on 03/08/17
 */
@Service
public class TaskerService {
	
	@Autowired
	private TaskerComponent taskerComponent;
	
	@Autowired
	private TaskerBehaviorService taskerBehaviorService;

	@Autowired
	private WorkspaceService workspaceService;
	
	public List<Tasker> getTakserListByWorkspaceId(Long workspaceId) {
		
		return taskerComponent.getByWorkspaceId(workspaceId);
	}

	public List<Tasker> getTakserListByParentId(Long workspaceId, Long parentTaskerId) {
		
		return taskerComponent.getByParentTaskerId(workspaceId, parentTaskerId);
	}
	
	public Tasker getTakserById(Long taskerId) {
		return taskerComponent.getById(taskerId);
	}
	
	public Tasker createTasker(Tasker tasker, Long workspaceId) {
		tasker.setWorkspaceId(workspaceId);
		taskerComponent.createTasker(tasker);
		
		return taskerComponent.getById(tasker.getTaskerId());
	}
	
	public Tasker modifyTasker(Tasker tasker, Long workspaceId, Long taskerId) {
        tasker.setWorkspaceId(workspaceId);
        tasker.setTaskerId(taskerId);
	    taskerComponent.updateTasker(tasker);
	    
	    return taskerComponent.getById(tasker.getTaskerId());
	}
	
	/**
	 * root tasker일 경우 workspace도 함께 삭제한다.
	 * @param workspaceId
	 * @param taskerId
	 */
	public void removeTakserById(Long workspaceId, Long taskerId, Principal user) {
		boolean isExistParentId = taskerComponent.isExistParentId(taskerId);
        List<Long> childTaskerIdList = taskerComponent.getChildTaskerIdList(taskerId);
        
        for(Long childTaskerId : childTaskerIdList) {
        	taskerBehaviorService.removeByTaskerId(workspaceId, childTaskerId);

        	taskerComponent.deleteConditionById(childTaskerId);
        	taskerComponent.deletePropertyById(childTaskerId);
        	taskerComponent.deleteTreePathById(childTaskerId);
        	taskerComponent.deleteById(childTaskerId);
        }
        
        // root tasker일 경우 workspace를 삭제한다.
        if (!isExistParentId) {
        	workspaceService.removeWorkspaceNode(workspaceId, user.getName());
        } 
	}
	
	/**
	 * root tasker일 경우 workspace도 함께 삭제한다.
	 * @param workspaceId
	 * @param taskerId
	 */
	public void removeOnlyTaksersById(Long workspaceId, Long taskerId, String userId) {
        List<Long> childTaskerIdList = taskerComponent.getChildTaskerIdList(taskerId);
        
        for(Long childTaskerId : childTaskerIdList) {
        	taskerBehaviorService.removeByTaskerId(workspaceId, childTaskerId);

        	taskerComponent.deleteConditionById(childTaskerId);
        	taskerComponent.deletePropertyById(childTaskerId);
        	taskerComponent.deleteTreePathById(childTaskerId);
        	taskerComponent.deleteById(childTaskerId);
        }
	}
}
