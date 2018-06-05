package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.WidgetMapper;
import com.bistel.a3.portal.domain.common.Widget;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WidgetComponent {

	@Autowired
    private WidgetMapper widgetMapper;
	
	public List<Widget> getWidgetsByDashboardId(Long dashboardId) {
		return widgetMapper.selectByDashboardId(dashboardId);
	}
	
	public List<Widget> getWidgetsByPageRange(Long dashboardId, int startPage, int endPage) {
		return widgetMapper.selectWigetsByPageRange(dashboardId, startPage,endPage);
	}
	
	public Widget getWidgetById(Long widgetId) {
		return widgetMapper.select(widgetId);
	}
	
	public void createWidget(Widget widget) {
		widgetMapper.insert(widget); 
	}
	
	public void updateWidget(Widget widget) {
		widgetMapper.update(widget);
	}
	
	public void updatePage(Long widgetId, int newPage) {
		widgetMapper.updatePage(widgetId, newPage);
	}
	
	public void deleteWidget(Long widgetId) {
		widgetMapper.deleteById(widgetId);
	}
	
	public void updateConfiguration(JsonNode configuration, Long widgetId) {
		widgetMapper.updateConfiguration(configuration, widgetId);
	}
	
	public void updatePageBackAll(Long dashboardId, int page) {
		widgetMapper.updatePageBackAll(dashboardId, page);
	}
}
