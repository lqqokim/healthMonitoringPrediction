package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.enums.AnalysisType;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AnalysisData {
	private String param_name;
	private String name;
	private AnalysisType type;
	private List<List<Object>> values = new ArrayList<>();
	private List<AnalysisData> children = new ArrayList<>();
	private Map<String,AnalysisData> childrendKey = new HashMap<>();

	public Map<String, AnalysisData> getChildrendKey() {
		return childrendKey;
	}
	public String getParam_name() {
		return param_name;
	}

	public void setParam_name(String param_name) {
		this.param_name = param_name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public AnalysisType getType() {
		return type;
	}

	public void setType(AnalysisType type) {
		this.type = type;
	}

	public List<List<Object>> getValues() {
		return values;
	}

	public void setValues(List<List<Object>> values) {
		this.values = values;
	}

	public List<AnalysisData> getChildren() {
		return children;
	}

	public void setChildren(List<AnalysisData> children) {
		this.children = children;
		this.childrendKey = new HashMap<>();
		for (AnalysisData key:this.children
			 ) {
			this.childrendKey.put(key.param_name,key);
		}
	}
	public void addChildren(AnalysisData analysisData){
		this.children.add(analysisData);
		this.childrendKey.put(analysisData.getName(),analysisData);
	}
}