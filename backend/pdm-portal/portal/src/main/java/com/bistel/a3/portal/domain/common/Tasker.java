package com.bistel.a3.portal.domain.common;

/**
 * Created by yohan on 15. 11. 3.
 */
public class Tasker {
    private Long taskerId;
    private Long taskerTypeId;
    private Long workspaceId;
    private String title;
    private Long parentId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Long getTaskerId() {
        return taskerId;
    }

    public void setTaskerId(Long taskerId) {
        this.taskerId = taskerId;
    }

    public Long getTaskerTypeId() {
        return taskerTypeId;
    }

    public void setTaskerTypeId(Long taskerTypeId) {
        this.taskerTypeId = taskerTypeId;
    }

    public Long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(Long workspaceId) {
        this.workspaceId = workspaceId;
    }
}
