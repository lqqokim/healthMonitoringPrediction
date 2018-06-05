package com.bistel.a3.portal.util.object;

public class StringUtil {

	public static String concatString(char c, String ... strs) {
		StringBuilder sb = new StringBuilder();
		
		for(String s : strs) {
			sb.append(s).append(c);
		}
		
		if(sb.length() > 0) {
			sb.deleteCharAt(sb.length()-1);
		}

		return sb.toString();
	}
}
