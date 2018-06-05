package com.bistel.a3.portal.util.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
	public static final String DEFAULT_TIMESTAMP = "yyyy-MM-dd HH:mm:ss.SSS";

	public static Date toDate(long millis) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(millis);
		
		return cal.getTime();
	}

	public static Date toDate(String strTime) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat(DEFAULT_TIMESTAMP);
		return sdf.parse(strTime);
	}
	
	public static String toString(Date iTime) {
		SimpleDateFormat sdf = new SimpleDateFormat(DEFAULT_TIMESTAMP);
		return sdf.format(iTime);
	}


	public static Date add(Date endDtts, int[] fields, int[] amount) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(endDtts.getTime());

		for(int i=0; i<fields.length; i++) {
			cal.add(fields[i], amount[i]);
		}
		
		return cal.getTime();
	}
	public static String getProgressStatusString(String fab, int totalCount, int iCount, Date startDate, String jobName) {
		try{
			long diff = new Date().getTime() - startDate.getTime();

			long diffTotalSeconds = diff / 1000 % 60;
			long diffTotalMinutes = diff / (60*1000) % 60;
			long diffTotalHours = diff /(60 *60 * 1000) %24;
			long diffTotalDays = diff / (24*60*60*1000);

			diff =(long) ((totalCount - iCount)/(double)iCount*diff);
			long diffSeconds = diff / 1000 % 60;
			long diffMinutes = diff / (60*1000) % 60;
			long diffHours = diff /(60 *60 * 1000) %24;
			long diffDays = diff / (24*60*60*1000);
			int percentage = (int)((double) iCount/totalCount*100);
			String result = String.format("Processing %s ... Fab:%s %d/%d %d%% Estimate=>%d:%d:%d Total=>%d:%d:%d",jobName,fab,iCount++,totalCount,percentage,diffHours,diffMinutes,diffSeconds,diffTotalHours,diffTotalMinutes,diffTotalSeconds);
			return result;
		}catch(Exception err){

		}
		return "";

	}
}
