package com.bistel.a3.portal.domain.common;

/**
 * Created by yohan on 15. 11. 3.
 */
public class TaskerWithType extends Tasker {
    private TaskerType taskerType;

    public TaskerType getTaskerType() {
        return taskerType;
    }

    public void setTaskerType(TaskerType taskerType) {
        this.taskerType = taskerType;
    }
}
