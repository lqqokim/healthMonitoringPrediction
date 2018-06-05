package com.bistel.a3.common.util;

import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by yohan on 16. 4. 7.
 */
public class StringUtil {
	private static final String NULL_STR  = "null";
	private static final String NAN_STR  = "NaN";
	
    public static String concat(String[] strings, char c) {
        return concat(strings, c, "", "");
    }

    public static String concat(String[] strings, char c, String pre, String post) {
        StringBuilder sb = new StringBuilder();
        for(String string : strings) {
            sb.append(pre).append(string).append(post).append(c);
        }
        if(sb.length() > 0) {
            return sb.deleteCharAt(sb.length() - 1).toString();
        }
        return sb.toString();
    }

    public static String concat(Set<String> strings, char c) {
        return concat(strings.toArray(new String[strings.size()]), c);
    }
    public static String concat(Set<String> strings, char c, String pre, String post) {
        return concat(strings.toArray(new String[strings.size()]), c, pre, post);
    }

    public static Set<String> createSet(String ... str) {
        Set<String> set = new HashSet<>();
        for(String s : str) {
            set.add(s);
        }
        return set;
    }
    
    /**
     * comma(',')로 분리된 String을 java.util.List로 변환 
     * 
     * @param str
     * @return
     */
    public static List<String> convertCsvStringToList(String str) {
        List<String> list = null;
        
        if (StringUtils.isNotEmpty(str)) {
            String[] values = str.split(",");
            list = Arrays.asList(values);
        }
        
        return list;
    }
    
    /**
     * Parameter로 주어진 string이 null, ""(empty string), "null"(case insensitive) 인지 체크한다.  
     *  
     * @param str
     * @return
     */
    public static boolean isEmptyOrNullData(String str) {
        boolean result = false;
        
        result = StringUtils.isEmpty(str);
        if(!result) {
            result = NULL_STR.equals(str.toLowerCase());
        }
        
        return result;
    }
    
    /**
     * Parameter로 주어진 string이 null, ""(empty string), "NaN"(case sensitive) 인지 체크한다.  
     *  
     * @param str
     * @return
     */
    public static boolean isEmptyOrNaNData(String str) {
        boolean result = false;
        
        result = StringUtils.isEmpty(str);
        if(!result) {
            result = NAN_STR.equals(str);
        }
        
        return result;
    }
}
