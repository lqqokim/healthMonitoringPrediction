package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.TaskerBehaviorType;
import org.apache.ibatis.annotations.Param;

/**
 * Created by yohan on 11/30/15.
 */
public interface TaskerBehaviorTypeMapper {
    TaskerBehaviorType selectByName(@Param("taskerBehaviorTypeName") String taskerBehaviorTypeName);
}
