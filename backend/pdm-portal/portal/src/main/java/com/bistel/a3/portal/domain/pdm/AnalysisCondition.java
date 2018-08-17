package com.bistel.a3.portal.domain.pdm;

import java.util.ArrayList;
import java.util.List;

public class AnalysisCondition {
	private List<AnalysisParamGroup> x_category;
	private List<AnalysisParamGroup> y_category;
	private List<AnalysisParamGroup> x;
	private List<AnalysisParamGroup> y;
	private List<AnalysisParamGroup> y2;
	private List<Long> eqp_ids;
	private List<String> param_names;
	private Boolean isGroupBy = null;
	private List<AnalysisParamGroup> parameters = new ArrayList<AnalysisParamGroup>();
	

	public List<AnalysisParamGroup> getParameters() {
		parameters = new ArrayList<AnalysisParamGroup>();
		
		List<AnalysisParamGroup> datas = this.x_category;
		for (int i = 0; i < datas.size(); i++) {
			AnalysisParamGroup analysisParamGroup = datas.get(i);
			if (!analysisParamGroup.getParam_name().equals("AREA_NAME") || !analysisParamGroup.getParam_name().equals("EQP_NAME") || !analysisParamGroup.getParam_name().equals("DATE")) {
				parameters.add(analysisParamGroup);
			}
		}
		
		datas = this.y_category;
		for (int i = 0; i < datas.size(); i++) {
			AnalysisParamGroup analysisParamGroup = datas.get(i);
			if (!analysisParamGroup.getParam_name().equals("AREA_NAME") || !analysisParamGroup.getParam_name().equals("EQP_NAME") || !analysisParamGroup.getParam_name().equals("DATE")) {
				parameters.add(analysisParamGroup);
			}
		}

		datas = this.x;
		for (int i = 0; i < datas.size(); i++) {
			AnalysisParamGroup analysisParamGroup = datas.get(i);
			if (!analysisParamGroup.getParam_name().equals("AREA_NAME") || !analysisParamGroup.getParam_name().equals("EQP_NAME") || !analysisParamGroup.getParam_name().equals("DATE")) {
				parameters.add(analysisParamGroup);
			}
		}

		datas = this.y;
		for (int i = 0; i < datas.size(); i++) {
			AnalysisParamGroup analysisParamGroup = datas.get(i);
			if (!analysisParamGroup.getParam_name().equals("AREA_NAME") || !analysisParamGroup.getParam_name().equals("EQP_NAME") || !analysisParamGroup.getParam_name().equals("DATE")) {
				parameters.add(analysisParamGroup);
			}
		}

		datas = this.y2;
		for (int i = 0; i < datas.size(); i++) {
			AnalysisParamGroup analysisParamGroup = datas.get(i);
			if (!analysisParamGroup.getParam_name().equals("AREA_NAME") || !analysisParamGroup.getParam_name().equals("EQP_NAME") || !analysisParamGroup.getParam_name().equals("DATE")) {
				parameters.add(analysisParamGroup);
			}
		}
		
		return parameters;
	}
	public void setParameters(List<AnalysisParamGroup> parameters) {
		this.parameters = parameters;
	}
	public boolean getIsGroupBy() {
		if (isGroupBy != null) {
			return this.isGroupBy;
		}
		
		for (int i = 0; i < x_category.size(); i++) {
			AnalysisParamGroup analysisParamGroup = x_category.get(i);
			if(analysisParamGroup.getGroup_name().length() > 0) {
				this.isGroupBy = true;
				return this.isGroupBy;
			}
		}
		
		for (int i = 0; i < y_category.size(); i++) {
			AnalysisParamGroup analysisParamGroup = y_category.get(i);
			if(analysisParamGroup.getGroup_name().length() > 0) {
				this.isGroupBy = true;
				return this.isGroupBy;
			}
		}
		
		for (int i = 0; i < x.size(); i++) {
			AnalysisParamGroup analysisParamGroup = x.get(i);
			if(analysisParamGroup.getGroup_name().length() > 0) {
				this.isGroupBy = true;
				return this.isGroupBy;
			}
		}
		this.isGroupBy = false;
		return isGroupBy;
	}
	public void setIsGroupBy(boolean isGroupBy) {
		this.isGroupBy = isGroupBy;
	}
	public List<Long> getEqp_ids() {
		return eqp_ids;
	}
	public void setEqp_ids(List<Long> eqp_ids) {
		this.eqp_ids = eqp_ids;
	}
	public List<String> getParam_names() {
		return param_names;
	}
	public void setParam_names(List<String> param_names) {
		this.param_names = param_names;
	}
	public List<AnalysisParamGroup> getX_category() {
		return x_category;
	}
	public void setX_category(List<AnalysisParamGroup> x_category) {
		this.x_category = x_category;
	}
	public List<AnalysisParamGroup> getY_category() {
		return y_category;
	}
	public void setY_category(List<AnalysisParamGroup> y_category) {
		this.y_category = y_category;
	}
	public List<AnalysisParamGroup> getX() {
		return x;
	}
	public void setX(List<AnalysisParamGroup> x) {
		this.x = x;
	}
	public List<AnalysisParamGroup> getY() {
		return y;
	}
	public void setY(List<AnalysisParamGroup> y) {
		this.y = y;
	}
	public List<AnalysisParamGroup> getY2() {
		return y2;
	}
	public void setY2(List<AnalysisParamGroup> y2) {
		this.y2 = y2;
	}
}