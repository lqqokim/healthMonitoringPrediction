package com.bistel.a3.portal.domain.usermgt;
import java.util.List;

public class PermissionVo {
	String objectId;
	String objectName;
	String parentId;
	String objectLevel;
	List<ObjectOperationVo> operations;
	
	public String getObjectId() {
		return objectId;
	}
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
	public String getObjectName() {
		return objectName;
	}
	public void setObjectName(String objectName) {
		this.objectName = objectName;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public String getObjectLevel() {
		return objectLevel;
	}
	public void setObjectLevel(String objectLevel) {
		this.objectLevel = objectLevel;
	}
	public List<ObjectOperationVo> getOperations() {
		return operations;
	}
	public void setOperations(List<ObjectOperationVo> operations) {
		this.operations = operations;
	}	
}
