package com.bistel.a3.portal.domain.common;

public class SchedulerInfo {
	private String cutoffType;
	private String cutoffCycle;
	private String makeTime;
	private String fromTime;
	private String toTime;
	private String buildDate;
	private String used;

	public String getCutoffType() {
		return cutoffType;
	}

	public void setCutoffType(String cutoffType) {
		this.cutoffType = cutoffType;
	}

	public String getCutoffCycle() {
		return cutoffCycle;
	}

	public void setCutoffCycle(String cutoffCycle) {
		this.cutoffCycle = cutoffCycle;
	}

	public String getMakeTime() {
		return makeTime;
	}

	public void setMakeTime(String makeTime) {
		this.makeTime = makeTime;
	}

	public String getFromTime() {
		return fromTime;
	}

	public void setFromTime(String fromTime) {
		this.fromTime = fromTime;
	}

	public String getToTime() {
		return toTime;
	}

	public void setToTime(String toTime) {
		this.toTime = toTime;
	}

	public String getBuildDate() {
		return buildDate;
	}

	public void setBuildDate(String buildDate) {
		this.buildDate = buildDate;
	}

	public String getUsed() {
		return used;
	}

	public void setUsed(String used) {
		this.used = used;
	}
}
