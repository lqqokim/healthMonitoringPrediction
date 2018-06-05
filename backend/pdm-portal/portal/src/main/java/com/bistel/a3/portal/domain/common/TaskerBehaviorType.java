package com.bistel.a3.portal.domain.common;

/**
 * Created by yohan on 11/30/15.
 */
public class TaskerBehaviorType {
    private String taskerBehaviorTypeName;
    private String classType;
    private String inputClassType;
    private String outputClassType;

    public String getTaskerBehaviorTypeName() {
        return taskerBehaviorTypeName;
    }

    public void setTaskerBehaviorTypeName(String taskerBehaviorTypeName) {
        this.taskerBehaviorTypeName = taskerBehaviorTypeName;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public String getInputClassType() {
        return inputClassType;
    }

    public void setInputClassType(String inputClassType) {
        this.inputClassType = inputClassType;
    }

    public String getOutputClassType() {
        return outputClassType;
    }

    public void setOutputClassType(String outputClassType) {
        this.outputClassType = outputClassType;
    }
}
