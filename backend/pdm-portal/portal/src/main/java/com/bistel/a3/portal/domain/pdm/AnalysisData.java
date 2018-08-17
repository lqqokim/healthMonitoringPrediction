package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.enums.AnalysisType;

public class AnalysisData {
	private String name;
	private AnalysisType type;
	private AnalysisDatas values =  new AnalysisDatas();
	
	public AnalysisData(String name, AnalysisType type, AnalysisDatas values) {
		this.name = name;
		this.type = type;
		this.values = values;
	}
	public AnalysisData() {
	}
	public AnalysisType getType() {
		return type;
	}
	public void setType(AnalysisType type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public AnalysisDatas getValues() {
		return values;
	}
	public void setValues(AnalysisDatas values) {
		this.values = values;
	}	
}