package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.Widget;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 10. 29.
 */
public interface WidgetMapper {
    public List<Widget> selectByDashboardId(@Param("dashboardId") Long dashboardId);
    public List<Widget> selectWigetsByPageRange(@Param("dashboardId") Long dashboardId, @Param("startPage") Integer startPage, @Param("endPage") Integer endPage);
    public Widget select(@Param("widgetId") Long widgetId);
    public void insert(Widget widget);
    public void update(Widget widget);
    public void updatePage(@Param("widgetId") Long widgetId, @Param("newPage") Integer newPage);
    public void deleteById(@Param("widgetId") Long widgetId);
    public void updateConfiguration(@Param("configuration") JsonNode configuration, @Param("widgetId") Long widgetId);
    public void deleteByDashboardId(@Param("dashboardId") Long dashboardId);
    public void updatePageBackAll(@Param("dashboardId") Long dashboardId, @Param("page") Integer page );
}
