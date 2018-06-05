package com.bistel.a3.common.util;

/**
 * Created by yohan on 4/15/16.
 */
public class BooleanUtil {
    public static Boolean toBoolean(String bool) {
        if(bool == null || bool.equals("")) {
            return false;
        } else if(bool != null && bool.toLowerCase().equals("y")) {
            return true;    // Boolean.parseBoolean(bool); 욘석이 y, n 체크가 아니되어서 추가.
        }
        return Boolean.parseBoolean(bool);
    }
}
