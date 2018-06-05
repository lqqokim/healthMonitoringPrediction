package com.bistel.a3.portal.domain.response;

import com.bistel.a3.portal.domain.data.DataWindow;

public class ShotDataResponse {
	String lot;
	String substrate;
	String recipe;
	String reticle;
	String parameter;
	long startDtts;
	long endDtts;
	double shotHeight;
	double shotWidth;
	DataWindow<String, Object> dataSet;
	public String getLot() {
		return lot;
	}
	public void setLot(String lot) {
		this.lot = lot;
	}
	public String getSubstrate() {
		return substrate;
	}
	public void setSubstrate(String substrate) {
		this.substrate = substrate;
	}
	public String getRecipe() {
		return recipe;
	}
	public void setRecipe(String recipe) {
		this.recipe = recipe;
	}
	public String getReticle() {
		return reticle;
	}
	public void setReticle(String reticle) {
		this.reticle = reticle;
	}
	public String getParameter() {
		return parameter;
	}
	public void setParameter(String parameter) {
		this.parameter = parameter;
	}
	public long getStartDtts() {
		return startDtts;
	}
	public void setStartDtts(long startDtts) {
		this.startDtts = startDtts;
	}
	public long getEndDtts() {
		return endDtts;
	}
	public void setEndDtts(long endDtts) {
		this.endDtts = endDtts;
	}
	public double getShotHeight() {
		return shotHeight;
	}
	public void setShotHeight(double shotHeight) {
		this.shotHeight = shotHeight;
	}
	public double getShotWidth() {
		return shotWidth;
	}
	public void setShotWidth(double shotWidth) {
		this.shotWidth = shotWidth;
	}
	public DataWindow<String, Object> getDataSet() {
		return dataSet;
	}
	public void setDataSet(DataWindow<String, Object> dataSet) {
		this.dataSet = dataSet;
	}
}
