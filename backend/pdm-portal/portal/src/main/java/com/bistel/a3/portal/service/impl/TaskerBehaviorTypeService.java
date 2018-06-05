package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.TaskerBehaviorType;
import com.bistel.a3.portal.module.common.TaskerBehaviorTypeComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskerBehaviorTypeService {

	@Autowired
	private TaskerBehaviorTypeComponent taskerBehaviorTypeComponent;
	
	public TaskerBehaviorType get(String taskerBehaviorTypeName) {
		return taskerBehaviorTypeComponent.getByName(taskerBehaviorTypeName);
	}
}
