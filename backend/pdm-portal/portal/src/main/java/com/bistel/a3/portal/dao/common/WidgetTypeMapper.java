package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.WidgetType;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 10. 29.
 */
public interface WidgetTypeMapper {
    List<WidgetType> selectAll();
    WidgetType selectById(@Param("widgetTypeId") Long widgetTypeId);
    void insert(WidgetType widgetType);
    void update(WidgetType widgetType);
    void delete(@Param("widgetTypeId") Long widgetTypeId);
}
