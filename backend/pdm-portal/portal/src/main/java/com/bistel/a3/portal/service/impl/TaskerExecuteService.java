package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.behavior.tasker.ITaskerBehavior;
import com.bistel.a3.portal.dao.common.TaskerBehaviorMapper;
import com.bistel.a3.portal.domain.common.TaskerBehavior;
import com.bistel.a3.portal.domain.common.TaskerBehaviorData;
import com.bistel.a3.portal.enums.BEHAVIOR_STATUS;
import com.bistel.a3.portal.util.ClassUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by yohan on 11/27/15.
 */
@Service
public class TaskerExecuteService {
    @Autowired
    private TaskerBehaviorMapper taskerBehaviorMapper;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void runTask(ITaskerBehavior task, Object input, TaskerBehavior taskerBehavior, TaskerBehaviorData taskerBehaviorData) {
        try {
            Object result =  task.execute(input);
            saveStatus(taskerBehavior, BEHAVIOR_STATUS.DONE);
            saveData(taskerBehaviorData, result);
        } catch (Exception e) {
            saveStatus(taskerBehavior, BEHAVIOR_STATUS.FAIL);
            saveData(taskerBehaviorData, e);
        }
    }

    private void saveData(TaskerBehaviorData taskerBehaviorData, Object obj) {
        taskerBehaviorData.setOutput(ClassUtil.getJsonNode(obj));
        taskerBehaviorMapper.updateOutputData(taskerBehaviorData);
    }

    private void saveStatus(TaskerBehavior taskerBehavior, BEHAVIOR_STATUS status) {
        taskerBehavior.setStatus(status);
        taskerBehaviorMapper.updateStatus(taskerBehavior);
    }
}
