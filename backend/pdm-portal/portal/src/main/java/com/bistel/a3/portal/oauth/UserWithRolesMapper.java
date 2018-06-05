package com.bistel.a3.portal.oauth;

import com.bistel.a3.portal.domain.common.UserWithRole;
import org.apache.ibatis.annotations.Param;

/**
 * Created by yohan on 9/15/15.
 */
public interface UserWithRolesMapper {
    UserWithRole selectUserWithRoles(@Param("userId") String userId);
}
