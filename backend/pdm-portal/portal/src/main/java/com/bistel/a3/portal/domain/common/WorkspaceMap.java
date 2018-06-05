package com.bistel.a3.portal.domain.common;

import java.util.List;

/**
 * Created by yohan on 11/30/15.
 * modify by david lee on 03/06/17
 */
public class WorkspaceMap {
	private String userId;
	private String userName;
	private String imageUrl;
	private int score;
	private List<WorkspaceMapNode> map;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public List<WorkspaceMapNode> getMap() {
		return map;
	}

	public void setMap(List<WorkspaceMapNode> map) {
		this.map = map;
	}

}
