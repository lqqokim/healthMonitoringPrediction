package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.Widget;
import com.bistel.a3.portal.service.impl.WidgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by yohan on 15. 11. 2.
 */
@RestController
@RequestMapping("/dashboards/{dashboardId}/widgets")
@Transactional
public class WidgetController {

	@Autowired
    private WidgetService widgetService;
	
	
    @RequestMapping(method = RequestMethod.GET)
    public List<Widget> gets(@PathVariable Long dashboardId) {
        return widgetService.getWidgetsByDashboardId(dashboardId);
    }
	
    @RequestMapping(method = RequestMethod.GET, value="/{widgetId}")
    public Widget get(@PathVariable Long widgetId) {
        return widgetService.getWidgetByWidgetId(widgetId);
    }
    
    @RequestMapping(method = RequestMethod.PUT)
    public Widget create(@RequestBody Widget widget) {
        return widgetService.getWidgetAferWidgetCreation(widget);
    }
    
    @RequestMapping(method = RequestMethod.PUT, value="/{widgetId}")
    public Widget set(@RequestBody Widget widget, @PathVariable Long widgetId) {
        return widgetService.getWidgetAferWigetUpdate(widget, widgetId);
    }
    
    @RequestMapping(method = RequestMethod.DELETE, value="/{widgetId}")
    public void remove(@PathVariable Long widgetId) {
    	widgetService.deleteWidetById(widgetId);
    }
    

    @RequestMapping(method = RequestMethod.PUT, value="/{widgetId}/configuration")
    public void setConfiguration(@RequestBody Widget widget, @PathVariable Long widgetId) {
    	widgetService.updateConfiguration(widget.getProperties(), widgetId);
    }
	
}
