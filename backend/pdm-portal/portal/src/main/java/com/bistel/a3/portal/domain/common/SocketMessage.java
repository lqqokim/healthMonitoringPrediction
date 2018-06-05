package com.bistel.a3.portal.domain.common;

import java.util.HashMap;

public class SocketMessage {
	String id;
	String type;//Request/Response
	String status; //First/Progress/Last
	HashMap<String,Object> parameters;
	Object reply;
	String replySubject;
	String parameterData;
	String userId;
	int sequence;
	public static  enum Status {Request,Response,RequestNext}
	public static  enum Type {First,Progress,Finish}
		
	public SocketMessage(){
//		this.id = java.util.UUID.randomUUID().toString();
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public HashMap<String, Object> getParameters() {
		return parameters;
	}
	public void setParameters(HashMap<String, Object> parameters) {
		this.parameters = parameters;
	}
	public Object getReply() {
		return reply;
	}
	public void setReply(Object reply) {
		this.reply = reply;
	}
	public String getReplySubject() {
		return replySubject;
	}
	public void setReplySubject(String replySubject) {
		this.replySubject = replySubject;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public int getSequence() {
		return sequence;
	}
	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public String getParameterData() {
		return parameterData;
	}

	public void setParameterData(String paramterData) {
		this.parameterData = paramterData;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

}
