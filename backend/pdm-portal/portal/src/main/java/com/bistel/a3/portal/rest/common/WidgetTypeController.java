package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.WidgetTypeMapper;
import com.bistel.a3.portal.domain.common.WidgetType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by yohan on 15. 10. 29.
 */
@RestController
@RequestMapping("/widgettypes")
@Transactional
public class WidgetTypeController {
    @Autowired
    private WidgetTypeMapper widgetTypeMapper;

    @RequestMapping(method = RequestMethod.GET)
    public List<WidgetType> gets() {
        return widgetTypeMapper.selectAll();
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{widgetTypeId}")
    public WidgetType get(@PathVariable Long widgetTypeId) {
        return widgetTypeMapper.selectById(widgetTypeId);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public WidgetType create(@RequestBody WidgetType widgetType) {
        widgetTypeMapper.insert(widgetType);
        return widgetTypeMapper.selectById(widgetType.getWidgetTypeId());
    }

    @RequestMapping(method = RequestMethod.PUT, value = "/{widgetTypeId}")
    public WidgetType set(@RequestBody WidgetType widgetType, @PathVariable Long widgetTypeId) {
        widgetTypeMapper.update(widgetType);
        return widgetTypeMapper.selectById(widgetTypeId);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/{widgetTypeId}")
    public void remove(@PathVariable Long widgetTypeId) {
        widgetTypeMapper.delete(widgetTypeId);
    }
}
