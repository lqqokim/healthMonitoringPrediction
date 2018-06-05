package com.bistel.a3.portal.util.object;

public class NumberUtil {
	public static Long getLongValue(Object value) {
		Number n = (Number) value;
		return n.longValue();
	}
	
	public static Long getLongValue(int value) {
		Number n = Integer.valueOf(value);
		return n.longValue();
	}
	
	public static Double getDoubleValue(int value) {
		Number n = Integer.valueOf(value);
		return n.doubleValue();
	}
	
    public static double round(double d, int n) {
        return Math.round(d * Math.pow(10, n)) / Math.pow(10, n);
     }    

    public static boolean isStringDouble(String s) {
        try {
            Double.parseDouble(s);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static double average(double[] array) {
        double sum = 0.0;

        for (int i = 0; i < array.length; i++)
            sum += array[i];

        return sum / array.length;
    }

	public static int getIntValue(Long value) {
		Number n = Long.valueOf(value);
		return n.intValue();
	}
}