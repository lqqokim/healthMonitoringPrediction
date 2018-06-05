package com.bistel.a3.portal.domain.analysis;

import java.util.Date;

public class AnalysisFilterData {
	int guid; 
  	String recipeIds;
  	String steps;
  	String seriesName;
  	byte[] image;
  	String color;
  	long dataCount;
  	Date createDtts;
  	
	public int getGuid() {
		return guid;
	}
	public void setGuid(int guid) {
		this.guid = guid;
	}
	public String getRecipeIds() {
		return recipeIds;
	}
	public void setRecipeIds(String recipeIds) {
		this.recipeIds = recipeIds;
	}
	public String getSteps() {
		return steps;
	}
	public void setSteps(String steps) {
		this.steps = steps;
	}
	public String getSeriesName() {
		return seriesName;
	}
	public void setSeriesName(String seriesName) {
		this.seriesName = seriesName;
	}
	public byte[] getImage() {
		return image;
	}
	public void setImage(byte[] image) {
		this.image = image;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public long getDataCount() {
		return dataCount;
	}
	public void setDataCount(long dataCount) {
		this.dataCount = dataCount;
	}
	public Date getCreateDtts() {
		return createDtts;
	}
	public void setCreateDtts(Date createDtts) {
		this.createDtts = createDtts;
	} 

}
