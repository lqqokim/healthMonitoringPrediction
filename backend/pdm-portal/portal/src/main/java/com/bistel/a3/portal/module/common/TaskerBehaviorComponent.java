package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.TaskerBehaviorMapper;
import com.bistel.a3.portal.domain.common.TaskerBehavior;
import com.bistel.a3.portal.domain.common.TaskerBehaviorData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TaskerBehaviorComponent {

	@Autowired
	private TaskerBehaviorMapper taskerBehaviorMapper;
	
	public void remove(Long taskerBehaviorId) {
		taskerBehaviorMapper.delete(taskerBehaviorId);
	}
	
	public List<TaskerBehavior> getTaskerBehaviorListByTaskerId(Long workspaceId, Long taskerId) {
		return taskerBehaviorMapper.selectByTaskerId(workspaceId, taskerId);
	}

	public TaskerBehavior getTaskerBehaviorById(Long taskerBehaviorId) {
		return taskerBehaviorMapper.select(taskerBehaviorId);
	}
	
	public Object getTaskerBehaviorOutputById(Long taskerBehaviorId) {
		return taskerBehaviorMapper.selectOutput(taskerBehaviorId).getOutput();
	}
	
	public Object getTaskerBehaviorInputById(Long taskerBehaviorId) {
		return taskerBehaviorMapper.selectOutput(taskerBehaviorId).getInput();
	}
	
	public void insert(TaskerBehavior taskerBehavior) {
		taskerBehaviorMapper.insert(taskerBehavior);
	}
	
	public void insertBehaviorData(TaskerBehaviorData taskerBehaviorData) {
		taskerBehaviorMapper.insertData(taskerBehaviorData);
	}
	
	public void delete (Long taskerBehaviorId)  {
		taskerBehaviorMapper.delete(taskerBehaviorId);
	}
	
	public void deleteBehaviorData(Long taskerBehaviorId) {
		taskerBehaviorMapper.deleteData(taskerBehaviorId);
	}
}
