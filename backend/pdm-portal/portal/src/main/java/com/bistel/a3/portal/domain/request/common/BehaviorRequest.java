package com.bistel.a3.portal.domain.request.common;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Created by yohan on 11/27/15.
 */
public class BehaviorRequest {
    private String taskerBehaviorTypeName;
    private JsonNode input;

    public String getTaskerBehaviorTypeName() {
        return taskerBehaviorTypeName;
    }

    public void setTaskerBehaviorTypeName(String taskerBehaviorTypeName) {
        this.taskerBehaviorTypeName = taskerBehaviorTypeName;
    }

    public JsonNode getInput() {
        return input;
    }

    public void setInput(JsonNode input) {
        this.input = input;
    }
}
