package com.bistel.a3.portal.domain.response;

import com.bistel.a3.portal.util.DataWindow;

import java.util.HashMap;

public class FaultAnnotationResponse {
	HashMap<String, Integer> count;
	DataWindow<String, Object> data;
	public HashMap<String, Integer> getCount() {
		return count;
	}
	public void setCount(HashMap<String, Integer> count) {
		this.count = count;
	}
	public DataWindow<String, Object> getData() {
		return data;
	}
	public void setData(DataWindow<String, Object> data) {
		this.data = data;
	}
}
