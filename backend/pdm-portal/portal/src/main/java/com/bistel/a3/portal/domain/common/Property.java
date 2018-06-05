package com.bistel.a3.portal.domain.common;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Created by yohan on 15. 11. 25.
 */
public class Property {
    private String key;
    private JsonNode value;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public JsonNode getValue() {
        return value;
    }

    public void setValue(JsonNode value) {
        this.value = value;
    }
}
