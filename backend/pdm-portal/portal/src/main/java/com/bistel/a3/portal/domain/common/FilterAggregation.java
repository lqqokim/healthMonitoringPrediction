package com.bistel.a3.portal.domain.common;

import java.util.List;

public class FilterAggregation {
    private List<String> functions;
    private int groupValue;
    private String groupUnit;
    private boolean use=true;

    public boolean isUse() {
        return use;
    }

    public void setUse(boolean use) {
        this.use = use;
    }

    public List<String> getFunctions() {
        return functions;
    }

    public void setFunctions(List<String> functions) {
        this.functions = functions;
    }

    public int getGroupValue() {
        return groupValue;
    }

    public void setGroupValue(int groupValue) {
        this.groupValue = groupValue;
    }

    public String getGroupUnit() {
        return groupUnit;
    }

    public void setGroupUnit(String groupUnit) {
        this.groupUnit = groupUnit;
    }
}
