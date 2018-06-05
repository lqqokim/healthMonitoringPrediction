package com.bistel.a3.portal.util.parser;

import java.util.regex.Pattern;

public class ParserPattern {
	public static Pattern LINE = Pattern.compile("\\r\n");
	public static Pattern TAB = Pattern.compile("\\t");
	public static Pattern CONTROL = Pattern.compile("\\^");
	public static Pattern EQUAL = Pattern.compile("\\=");
	public static Pattern AT = Pattern.compile("\\@");
	public static Pattern COLON = Pattern.compile(":");
	public static Pattern TILDE = Pattern.compile("\\~");
}
