package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.App;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 11. 17.
 */
public interface AppMapper {
    List<App> selectAll();
    App selectByName(@Param("appName") String appName);
}
