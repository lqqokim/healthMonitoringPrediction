package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.TaskerMapper;
import com.bistel.a3.portal.domain.common.Tasker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by David Lee on 03/08/17
 */
@Component
public class TaskerComponent {

    @Autowired
    private TaskerMapper taskerMapper;
    
    public List<Tasker> getByWorkspaceId(Long workspaceId) {
    	return taskerMapper.selectByWorkspaceId(workspaceId);
    }
    
    public List<Tasker> getByParentTaskerId(Long workspaceId, Long parentTaskerId) {
    	return taskerMapper.selectByParentId(workspaceId, parentTaskerId);
    }
    
    public Tasker getById(Long taskerId) {
    	return taskerMapper.select(taskerId);
    }
    
    public void createTasker(Tasker tasker) {
    	taskerMapper.insert(tasker);
    }
    
    public void updateTasker(Tasker tasker) {
    	taskerMapper.update(tasker);
    }
    
    public boolean isExistParentId(Long taskerId) {
    	return Boolean.parseBoolean(taskerMapper.hasParentId(taskerId)); 
    }
    
    public List<Long> getChildTaskerIdList (Long taskerId) {
    	return taskerMapper.getChildTaskerIdList(taskerId);
    }
    
    public void deleteConditionById(Long taskerId) {
    	taskerMapper.deleteConditionById(taskerId);
    }
	
    public void deletePropertyById(Long taskerId){
    	taskerMapper.deletePropertyById(taskerId);
    }
	
    public void deleteTreePathById(Long taskerId) {
    	taskerMapper.deleteTreePathById(taskerId);
    }
	
    public void deleteById(Long taskerId) {
    	taskerMapper.deleteById(taskerId);
    }
}
