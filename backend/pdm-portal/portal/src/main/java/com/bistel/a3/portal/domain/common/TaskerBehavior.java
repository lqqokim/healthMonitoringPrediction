package com.bistel.a3.portal.domain.common;

import com.bistel.a3.portal.enums.BEHAVIOR_STATUS;

import java.util.Date;

/**
 * Created by yohan on 11/27/15.
 */
public class TaskerBehavior {
    private Long taskerBehaviorId;
    private String taskerBehaviorTypeName;
    private Long taskerId;
    private BEHAVIOR_STATUS status;
    private Date startDtts;
    private Date endDtts;

    public TaskerBehavior() {}
    public TaskerBehavior(String taskerBehaviorTypeName, Long taskerId, BEHAVIOR_STATUS status) {
        this.taskerBehaviorTypeName = taskerBehaviorTypeName;
        this.taskerId = taskerId;
        this.status = status;
    }

    public Long getTaskerBehaviorId() {
        return taskerBehaviorId;
    }

    public void setTaskerBehaviorId(Long taskerBehaviorId) {
        this.taskerBehaviorId = taskerBehaviorId;
    }

    public String getTaskerBehaviorTypeName() {
        return taskerBehaviorTypeName;
    }

    public void setTaskerBehaviorTypeName(String taskerBehaviorTypeName) {
        this.taskerBehaviorTypeName = taskerBehaviorTypeName;
    }

    public Long getTaskerId() {
        return taskerId;
    }

    public void setTaskerId(Long taskerId) {
        this.taskerId = taskerId;
    }

    public BEHAVIOR_STATUS getStatus() {
        return status;
    }

    public void setStatus(BEHAVIOR_STATUS status) {
        this.status = status;
    }

    public Date getStartDtts() {
        return startDtts;
    }

    public void setStartDtts(Date startDtts) {
        this.startDtts = startDtts;
    }

    public Date getEndDtts() {
        return endDtts;
    }

    public void setEndDtts(Date endDtts) {
        this.endDtts = endDtts;
    }
}
