package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.behavior.tasker.ITaskerBehavior;
import com.bistel.a3.portal.domain.common.TaskerBehavior;
import com.bistel.a3.portal.domain.common.TaskerBehaviorData;
import com.bistel.a3.portal.domain.common.TaskerBehaviorType;
import com.bistel.a3.portal.domain.request.common.BehaviorRequest;
import com.bistel.a3.portal.enums.BEHAVIOR_STATUS;
import com.bistel.a3.portal.enums.ERROR_CODE;
import com.bistel.a3.portal.module.common.TaskerBehaviorComponent;
import com.bistel.a3.portal.util.ClassUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskerBehaviorService {
	
	@Autowired
    private ApplicationContext context;
	
    @Autowired
    private TaskerExecuteService taskerExecuteService;
    
    @Autowired
    private TaskerBehaviorTypeService taskerBehaviorTypeService;
	
	@Autowired
	private TaskerBehaviorComponent taskerBehaviorComponent;
	
	public void removeByTaskerId(Long workspaceId, Long taskerId) {
		List<TaskerBehavior> taskerBehaviors = taskerBehaviorComponent.getTaskerBehaviorListByTaskerId(workspaceId, taskerId);
		
        for(TaskerBehavior taskerBehavior : taskerBehaviors) {
        	taskerBehaviorComponent.remove(taskerBehavior.getTaskerBehaviorId());
        }
	}
	
	public List<TaskerBehavior> gets(Long workspaceId, Long taskerId) {
		return taskerBehaviorComponent.getTaskerBehaviorListByTaskerId(workspaceId, taskerId);
	}
	
	public TaskerBehavior get(Long taskerBehaviorId) {
		return taskerBehaviorComponent.getTaskerBehaviorById(taskerBehaviorId);
	}
	
	public Object getStatus(Long taskerBehaviorId) {
		TaskerBehavior taskerBehavior = get(taskerBehaviorId);
		return taskerBehavior.getStatus();
	}
	
	public Object getOutput(Long taskerBehaviorId) {
		return taskerBehaviorComponent.getTaskerBehaviorOutputById(taskerBehaviorId);
	}
	
	public Object getInput(Long taskerBehaviorId) {
		return taskerBehaviorComponent.getTaskerBehaviorInputById(taskerBehaviorId);
	}
	
	public TaskerBehavior create(Long taskerId, BehaviorRequest request) {
		
        TaskerBehavior taskerBehavior = new TaskerBehavior(request.getTaskerBehaviorTypeName(), taskerId, BEHAVIOR_STATUS.PENDING);
        taskerBehaviorComponent.insert(taskerBehavior);

        TaskerBehaviorData taskerBehaviorData = new TaskerBehaviorData(taskerBehavior.getTaskerBehaviorId(), request.getInput());
        taskerBehaviorComponent.insertBehaviorData(taskerBehaviorData);

        TaskerBehaviorType behaviorType = taskerBehaviorTypeService.get(request.getTaskerBehaviorTypeName());
 
        if(behaviorType == null) {
            throw new RuntimeException(ERROR_CODE.NOT_EXIST_TYPE_INFO.name());
        }

        ITaskerBehavior task = ClassUtil.newInstance(behaviorType.getClassType(), ITaskerBehavior.class);
        context.getAutowireCapableBeanFactory().autowireBeanProperties(task, AutowireCapableBeanFactory.AUTOWIRE_BY_TYPE, true);
        taskerExecuteService.runTask(task, ClassUtil.newInstance(request.getInput(), ClassUtil.getClass(behaviorType.getInputClassType())), taskerBehavior, taskerBehaviorData);
        System.out.println(task);

        return taskerBehaviorComponent.getTaskerBehaviorById(taskerBehavior.getTaskerBehaviorId());

	}
	
	public void remove(Long taskerBehaviorId) {
		taskerBehaviorComponent.deleteBehaviorData(taskerBehaviorId);
		taskerBehaviorComponent.delete(taskerBehaviorId);
	}
}
