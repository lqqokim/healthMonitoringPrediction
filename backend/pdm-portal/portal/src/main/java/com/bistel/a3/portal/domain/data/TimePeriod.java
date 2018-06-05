package com.bistel.a3.portal.domain.data;

import java.util.Date;

public class TimePeriod {
	private Long from;
	private Long to;
	public Long getFrom() {
		return from;
	}
	public void setFrom(Long from) {
		this.from = from;
	}
	public Long getTo() {
		return to;
	}
	public void setTo(Long to) {
		this.to = to;
	}

	public Date getFromDate() {
		return new Date(this.from);
	}
	public Date getToDate() {
		return new Date(this.to);
	}
}
