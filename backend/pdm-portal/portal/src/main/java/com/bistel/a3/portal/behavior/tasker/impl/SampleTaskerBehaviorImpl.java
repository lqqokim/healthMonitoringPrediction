package com.bistel.a3.portal.behavior.tasker.impl;

import com.bistel.a3.portal.behavior.tasker.ITaskerBehavior;
import com.bistel.a3.portal.rest.common.AppController;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by yohan on 12/1/15.
 */
public class SampleTaskerBehaviorImpl implements ITaskerBehavior {
    @Autowired
    private AppController appController;

    @Override
    public Object execute(Object in) {
        /*Tool tool = (Tool) in;
        tool.setName(String.format("return %s", tool.getName()));

        App app = appController.get("MCC");
        tool.setAlias(String.format("%s(%d)", app.getName(), app.getAppId()));
        return in;*/
        return null;
    }
}
