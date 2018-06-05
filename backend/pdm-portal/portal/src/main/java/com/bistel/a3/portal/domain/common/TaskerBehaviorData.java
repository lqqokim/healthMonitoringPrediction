package com.bistel.a3.portal.domain.common;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Created by yohan on 11/27/15.
 */
public class TaskerBehaviorData {
    private Long taskerBehaviorId;
    private JsonNode input;
    private JsonNode output;

    public TaskerBehaviorData() {}

    public TaskerBehaviorData(Long taskerBehaviorId, JsonNode input) {
        this.taskerBehaviorId = taskerBehaviorId;
        this.input = input;
    }

    public Long getTaskerBehaviorId() {
        return taskerBehaviorId;
    }

    public void setTaskerBehaviorId(Long taskerBehaviorId) {
        this.taskerBehaviorId = taskerBehaviorId;
    }

    public JsonNode getInput() {
        return input;
    }

    public void setInput(JsonNode input) {
        this.input = input;
    }

    public JsonNode getOutput() {
        return output;
    }

    public void setOutput(JsonNode output) {
        this.output = output;
    }
}
