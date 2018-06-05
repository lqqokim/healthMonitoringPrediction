package com.bistel.a3.portal.domain.usermgt;

/**
 * 
 * Operations: Users - GET/POST/PUT/DELETE
 * @author AlanMinjaePark
 *
 */
public class ResultMessageVo {
	
	private String function;
	private String type;
	private String id;
	private boolean resultFlag; 
	private String resultMessage;
	
	public String getFunction() {
		return function;
	}
	public void setFunction(String function) {
		this.function = function;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public boolean isResultFlag() {
		return resultFlag;
	}
	public void setResultFlag(boolean resultFlag) {
		this.resultFlag = resultFlag;
	}
	public String getResultMessage() {
		return resultMessage;
	}
	public void setResultMessage(String resultMessage) {
		this.resultMessage = resultMessage;
	}
	
}
