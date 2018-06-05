package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.TaskerPropertyMapper;
import com.bistel.a3.portal.domain.common.Property;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by yohan on 11/27/15.
 */
@RestController
@RequestMapping("/workspaces/{workspaceId}/taskers/{taskerId}")
@Transactional
public class TaskerPropertyController {
    @Autowired
    private TaskerPropertyMapper taskerPropertyMapper;

    @RequestMapping(value = "/properties")
    public List<Property> properties(@PathVariable Long taskerId) {
        return taskerPropertyMapper.selectByTaskerId("property", taskerId);
    }

    @RequestMapping(value = "/properties/{key}")
    public JsonNode property(@PathVariable Long taskerId, @PathVariable String key) {
        return taskerPropertyMapper.select("property", taskerId, key);
    }

    @RequestMapping(value = "/properties", method = RequestMethod.PUT)
    public void setProperties(@PathVariable Long taskerId, @RequestBody List<Property> properties) {
        for(Property property : properties) {
            taskerPropertyMapper.insert("property", taskerId, property);
        }
    }

    @RequestMapping(value = "/properties/{key}", method = RequestMethod.PUT)
    public void setProperty(@PathVariable Long taskerId, @PathVariable String key, @RequestBody JsonNode value) {
        taskerPropertyMapper.update("property", taskerId, key, value);
    }

    @RequestMapping(value="/properties/{key}", method = RequestMethod.DELETE)
    public void removeProperty(@PathVariable Long taskerId, @PathVariable String key) {
        taskerPropertyMapper.delete("property", taskerId, key);
    }


    @RequestMapping(value = "/conditions")
    public List<Property> conditions(@PathVariable Long taskerId) {
        return taskerPropertyMapper.selectByTaskerId("condition", taskerId);
    }

    @RequestMapping(value = "/conditions/{key}")
    public JsonNode condition(@PathVariable Long taskerId, @PathVariable String key) {
        return taskerPropertyMapper.select("condition", taskerId, key);
    }

    @RequestMapping(value = "/conditions", method = RequestMethod.PUT)
    public void setConditions(@PathVariable Long taskerId, @RequestBody List<Property> properties) {
        for(Property property : properties) {
            taskerPropertyMapper.insert("condition", taskerId, property);
        }
    }

    @RequestMapping(value = "/conditions/{key}", method = RequestMethod.PUT)
    public void setCondition(@PathVariable Long taskerId, @PathVariable String key, @RequestBody JsonNode value) {
        taskerPropertyMapper.update("condition", taskerId, key, value);
    }

    @RequestMapping(value="/conditions/{key}", method = RequestMethod.DELETE)
    public void removeCondition(@PathVariable Long taskerId, @PathVariable String key) {
        taskerPropertyMapper.delete("condition", taskerId, key);
    }
}
