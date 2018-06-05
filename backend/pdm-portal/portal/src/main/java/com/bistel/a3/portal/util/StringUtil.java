package com.bistel.a3.portal.util;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by yohan on 15. 11. 25.
 */
public class StringUtil {
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
    public static String concat(Set<String> strings, char c, String pre, String post) {
        return concat(strings.toArray(new String[strings.size()]), c, pre, post);
    }

    public static Long parseLong(String str) {
        if(str == null || str.equals("")) return null;
        return Long.parseLong(str);
    }

    public static Boolean parseBoolean(String str) {
        if(str == null || str.equals("")) return false;
        return Boolean.parseBoolean(str);
    }
    
    public static String concat(Set<String> strings, char c) {
        StringBuilder sb = new StringBuilder();
        for(String string : strings) {
            sb.append(string).append(c);
        }
        if(sb.length() > 0) return sb.deleteCharAt(sb.length()-1).toString();
        return sb.toString();
    }

    public static Set<String> createSet(String ... str) {
        Set<String> set = new HashSet<>();
        for(String s : str) {
            set.add(s);
        }
        return set;
    }
    
    public static boolean matches(String filter, String realValue) {
    	if(filter == null || filter.length() == 0) return false;
		
		String[] filters = filter.split(";");
		for(String subFilter : filters) {
			if(subMatches(subFilter, realValue)) 
				return true;
		}
		return false;
	}
    
    private static boolean subMatches(String filter, String realValue) {
		if(filter.compareTo("*") == 0) return true;
		if(realValue == null || realValue.length() == 0) return false;
		if (filter.indexOf("*") == -1) {
			return filter.compareTo(realValue) == 0;
		}
		return realValue.matches(filter.replace("*", ".*"));	
	}	
	
	public static String overlay(String str, String overlay, int start, int end) {
		if (str == null) return null;
		if (overlay == null) overlay = "";
		int len = str.length();
		if (start < 0) start = 0;
		if (start > len) start = len;
		if (end < 0) end = 0;
		if (end > len) end = len;
		if (start > end) {
			int temp = start;
			start = end;
			end = temp;
		}
		
		return (new StringBuilder(((len + start) - end) + overlay.length() + 1)).append(str.substring(0, start)).append(overlay).append(str.substring(end)).toString();
	}
}
