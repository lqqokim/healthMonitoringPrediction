package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.Widget;
import com.bistel.a3.portal.module.common.WidgetComponent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class WidgetService {

	@Autowired
	private WidgetComponent widgetComponent;
	
	public List<Widget> getWidgetsByDashboardId(Long dashboardId) {
		return widgetComponent.getWidgetsByDashboardId(dashboardId);
	}
	
	public Widget getWidgetByWidgetId(Long widgetId) {
		return widgetComponent.getWidgetById(widgetId);
	}
	
	public Widget getWidgetAferWidgetCreation(Widget widget) {
		
		widgetComponent.createWidget(widget);
		
		return widgetComponent.getWidgetById(widget.getWidgetId());
	}
	
	/**
	 * Widget 객체에서 Page 값이 변경됐는지 확인해서 page에 대한 변경 처리를 해야한다.
	 * @param //widget
	 * @param widgetId
	 * @return
	 */
	@Transactional
	public Widget getWidgetAferWigetUpdate(Widget newWidget, Long widgetId) {
		
		Widget currentWidget = widgetComponent.getWidgetById(widgetId);

		// 변경할 page 정보가 있을 경우 실행
		if (currentWidget.getPage() != null && newWidget.getPage() != null 
				&& currentWidget.getPage() != newWidget.getPage()) {
			updateWidetPage(newWidget.getDashboardId(), widgetId, currentWidget.getPage(), newWidget.getPage());
		}
		
		widgetComponent.updateWidget(newWidget);
		
		return widgetComponent.getWidgetById(widgetId);
	}
	
	/**
	 * Widget이 삭제될 경우 page 변경 처리를 추가해야 한다.
	 * @param widgetId
	 */
	public void deleteWidetById(Long widgetId) {
		
		Widget currentWidget = widgetComponent.getWidgetById(widgetId);
		
		// page가 있는 경우 뒤 쪽 widget들의 page를 변경해야 한다.
		if (currentWidget.getPage() != null && currentWidget.getPage() > 0 ) {
			widgetComponent.updatePageBackAll(currentWidget.getDashboardId(), currentWidget.getPage());
		}
		
		widgetComponent.deleteWidget(widgetId);
	}
	
	public void updateConfiguration(JsonNode configuration, Long widgetId) {
		widgetComponent.updateConfiguration(configuration, widgetId);
	}

	private void updateWidetPage(long dashboardId, long widgetId, int currentPage, int newPage) {

		List<Widget> widgetList = null;
		int changeValue = 0;
		
		if (currentPage > newPage) {
			changeValue = 1;
			widgetList = widgetComponent.getWidgetsByPageRange(dashboardId, newPage, currentPage);
		} else {
			changeValue = -1;
			widgetList = widgetComponent.getWidgetsByPageRange(dashboardId, currentPage, newPage);
		}

		int page = 0;
		Widget widget = null;
		for (int index = 0; index < widgetList.size(); index++){
			widget = widgetList.get(index);
			if (widget.getWidgetId() == widgetId ) {
				page = newPage;
			}	else {
				page = widget.getPage() + changeValue;
			}
			widgetComponent.updatePage(widget.getWidgetId(), page);
		}		
	}

	public void createDefaultWidget(List<Long> defaultDashboardIds, List<Long> dashboardIds) {
		for (int i = 0; i < defaultDashboardIds.size(); i++) {
			List<Widget> widgets = widgetComponent.getWidgetsByDashboardId(defaultDashboardIds.get(i));
			HashMap<String,Long> widgetIdsMap = new HashMap<>();
//			for (int j = 0; j < dashboardIds.size(); j++) {
				long dashboardId = dashboardIds.get(i);
				for (int k = 0; k < widgets.size(); k++) {
					Widget widget = widgets.get(k);
					Widget newWidget = new Widget();
					newWidget.setConditions(widget.getConditions());
					newWidget.setDashboardId(dashboardId);
					newWidget.setHeight(widget.getHeight());
					newWidget.setPage(widget.getPage());
					newWidget.setProperties(widget.getProperties());
					newWidget.setTitle(widget.getTitle());
					newWidget.setWidgetTypeId(widget.getWidgetTypeId());
					newWidget.setWidth(widget.getWidth());
					newWidget.setX(widget.getX());
					newWidget.setY(widget.getY());

					widgetComponent.createWidget(newWidget);
					widgetIdsMap.put(widget.getWidgetId().toString(),newWidget.getWidgetId());
				}
				List<Widget> newWidgets = widgetComponent.getWidgetsByDashboardId(dashboardId);
				for (int k = 0; k < newWidgets.size(); k++) {
					Widget widget = newWidgets.get(k);
					JsonNode jsonNode = widget.getProperties();
					try {
                        ArrayNode widgetsNode = (ArrayNode) jsonNode.get("communication").get("widgets");
                        List<Long> ids = new ArrayList<>();
                        for (int l = 0; l < widgetsNode.size(); l++) {
                            ids.add(widgetIdsMap.get(widgetsNode.get(l).toString()));
                        }
                        widgetsNode.removeAll();
                        for (int l = 0; l < ids.size(); l++) {
                            widgetsNode.add(ids.get(l));
                        }

                        widgetComponent.updateConfiguration(jsonNode, widget.getWidgetId());
                    }catch(Exception err){

                    }
				}

//			}
		}




	}
}
