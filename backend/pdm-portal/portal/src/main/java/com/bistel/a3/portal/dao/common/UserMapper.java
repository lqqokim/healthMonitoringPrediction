package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 9/15/15.
 */
public interface UserMapper {
    User selectById(@Param("userId") String userId);
    List<User> selectAll();
    void insert(User user);
    void update(User user);
    void delete(@Param("userId") String userId);
}
