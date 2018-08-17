package com.bistel.a3.portal.domain.pdm;

import java.util.HashMap;
import java.util.Map;

public class AnalysisDatas {
	private Map<String, AnalysisData> datas = new HashMap<String, AnalysisData>();

	public Map<String, AnalysisData> getDatas() {
		return datas;
	}

	public void setDatas(Map<String, AnalysisData> datas) {
		this.datas = datas;
	}	
}