package com.bistel.a3.portal.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Created by yohan on 11/30/15.
 */
public class ClassUtil {
    public static <T> T newInstance(String classType, Class<T> t) {
        try {
            return (T) Class.forName(classType).newInstance();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> T newInstance(JsonNode node, Class<T> t) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(node.traverse(), t);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static JsonNode getJsonNode(Object object) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.valueToTree(object);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    public static JsonNode getJsonNode(String str) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readTree(str);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static Class<?> getClass(String classType) {
        try {
            return Class.forName(classType);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
