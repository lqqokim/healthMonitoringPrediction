package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.TaskerBehavior;
import com.bistel.a3.portal.domain.common.TaskerBehaviorData;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 11/27/15.
 */
public interface TaskerBehaviorMapper {
    List<TaskerBehavior> selectByTaskerId(@Param("workspaceId") Long workspaceId, @Param("taskerId") Long taskerId);
    TaskerBehavior select(@Param("taskerBehaviorId") Long taskerBehaviorId);
    void insert(TaskerBehavior taskerBehavior);
    void insertData(TaskerBehaviorData taskerBehaviorData);
    TaskerBehaviorData selectOutput(@Param("taskerBehaviorId") Long taskerBehaviorId);
    void deleteData(@Param("taskerBehaviorId") Long taskerBehaviorId);
    void delete(@Param("taskerBehaviorId") Long taskerBehaviorId);
    void updateStatus(TaskerBehavior taskerBehavior);
    void updateOutputData(TaskerBehaviorData taskerBehaviorData);
}
