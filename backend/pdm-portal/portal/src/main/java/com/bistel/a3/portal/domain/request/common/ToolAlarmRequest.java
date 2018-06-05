package com.bistel.a3.portal.domain.request.common;

import com.bistel.a3.portal.domain.data.TimePeriod;

import java.util.Collection;

public class ToolAlarmRequest{
	TimePeriod timePeriod;
	Collection<Long> toolIds;
	public TimePeriod getTimePeriod() {
		return timePeriod;
	}
	public void setTimePeriod(TimePeriod timePeriod) {
		this.timePeriod = timePeriod;
	}
	public Collection<Long> getToolIds() {
		return toolIds;
	}
	public void setToolIds(Collection<Long> toolIds) {
		this.toolIds = toolIds;
	}
}
