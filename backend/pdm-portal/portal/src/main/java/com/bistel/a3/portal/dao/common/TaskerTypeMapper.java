package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.TaskerType;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 11. 3.
 */
public interface TaskerTypeMapper {
    List<TaskerType> selectAll();
    List<TaskerType> selectByName(@Param("taskerTypeName") String taskerTypeName);
    TaskerType selectById(@Param("taskerTypeId") Long taskerType);
    void insert(TaskerType taskerType);
    void update(TaskerType taskerType);
    void delete(@Param("taskerTypeId") Long taskerTypeId);
}
