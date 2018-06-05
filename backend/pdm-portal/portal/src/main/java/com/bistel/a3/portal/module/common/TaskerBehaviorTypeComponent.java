package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.TaskerBehaviorTypeMapper;
import com.bistel.a3.portal.domain.common.TaskerBehaviorType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TaskerBehaviorTypeComponent {

	@Autowired
	private TaskerBehaviorTypeMapper taskerBehaviorTypeMapper;
	
	public TaskerBehaviorType getByName(String taskerBehaviorTypeName) {
		return taskerBehaviorTypeMapper.selectByName(taskerBehaviorTypeName);
	}
}
