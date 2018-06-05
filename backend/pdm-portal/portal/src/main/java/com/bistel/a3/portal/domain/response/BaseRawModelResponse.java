package com.bistel.a3.portal.domain.response;

public abstract class BaseRawModelResponse {
	private int faultCount;

	public int getFaultCount() {
		return faultCount;
	}

	public void setFaultCount(int faultCount) {
		this.faultCount = faultCount;
	}
}
