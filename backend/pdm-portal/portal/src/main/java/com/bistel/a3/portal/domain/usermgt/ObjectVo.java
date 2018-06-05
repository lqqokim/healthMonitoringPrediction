package com.bistel.a3.portal.domain.usermgt;

public class ObjectVo {
	
	String id;
	String name;
	String level;
	String objectOperationId;
	OperationVo operation;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getObjectOperationId() {
		return objectOperationId;
	}
	public void setObjectOperationId(String objectOperationId) {
		this.objectOperationId = objectOperationId;
	}
	public OperationVo getOperation() {
		return operation;
	}
	public void setOperation(OperationVo operation) {
		this.operation = operation;
	}

}
