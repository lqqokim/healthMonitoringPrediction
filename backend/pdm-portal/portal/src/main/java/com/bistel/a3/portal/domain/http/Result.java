package com.bistel.a3.portal.domain.http;

import com.bistel.a3.portal.enums.RESULT;

public class Result {

	private RESULT result;
	private String errorCode;
	private String errorMessage;
	private Object data;
	
	public Result setResult(RESULT result) {
		this.result = result;
		return this;
	}
	
	public Result setErrorCode(String errorCode) {
		this.errorCode = errorCode;
		return this;
	}
	
	public RESULT getResult() {
		return result;
	}
	
	public String getErrorCode() {
		return errorCode;
	}
	
	public String getErrorMessage() {
		return errorMessage;
	}
	
	public Object getData() {
		return data;
	}
	
	public Result setData(Object data) {
		this.data = data;
		return this;
	}
	
	public Result setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
		return this;
	}
}
