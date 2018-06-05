package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.Tasker;
import com.bistel.a3.portal.domain.common.WorkspaceMap;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 10. 29.
 */
public interface TaskerMapper {
    List<Tasker> selectByWorkspaceId(@Param("workspaceId") Long workspaceId);
    List<Tasker> selectByParentId(@Param("workspaceId") Long workspaceId, @Param("parentId") Long parentId);
    Tasker select(@Param("taskerId") Long taskerId);
    void insert(Tasker tasker);
    void update(Tasker tasker);
    void deleteById(@Param("taskerId") Long taskerId);
    List<WorkspaceMap> selectMapByWorkspaceId(@Param("workspaceId") Long workspaceId, @Param("parentId") Long parentId);
    void deleteConditionById(@Param("taskerId") Long taskerId);
    void deletePropertyById(@Param("taskerId") Long taskerId);
    void deleteTreePathById(@Param("taskerId") Long taskerId);
    String hasParentId(Long taskerId);
    List<Long> getChildTaskerIdList(Long taskerId);
}
