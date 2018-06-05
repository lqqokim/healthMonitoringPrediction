package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.TaskerTypeMapper;
import com.bistel.a3.portal.domain.common.TaskerType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by yohan on 15. 11. 3.
 */
@RestController
@RequestMapping("/taskertypes")
@Transactional
public class TaskerTypeController {
    @Autowired
    private TaskerTypeMapper taskerTypeMapper;

    @RequestMapping(method = RequestMethod.GET)
    public List<TaskerType> gets(@RequestParam(value = "taskerTypeName", required = false) String taskerTypeName) {
        if(taskerTypeName == null) {
            return taskerTypeMapper.selectAll();
        }
        return taskerTypeMapper.selectByName(taskerTypeName);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{taskerTypeId}")
    public TaskerType get(@PathVariable Long taskerTypeId) {
        return taskerTypeMapper.selectById(taskerTypeId);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public TaskerType create(@RequestBody TaskerType taskerType) {
        taskerTypeMapper.insert(taskerType);
        return taskerTypeMapper.selectById(taskerType.getTaskerTypeId());
    }

    @RequestMapping(method = RequestMethod.PUT, value = "/{taskerTypeId}")
    public TaskerType set(@RequestBody TaskerType taskerType, @PathVariable Long taskerTypeId) {
        taskerTypeMapper.update(taskerType);
        return taskerTypeMapper.selectById(taskerTypeId);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/{taskerTypeId}")
    public void remove(@PathVariable Long taskerTypeId) {
        taskerTypeMapper.delete(taskerTypeId);
    }
}
