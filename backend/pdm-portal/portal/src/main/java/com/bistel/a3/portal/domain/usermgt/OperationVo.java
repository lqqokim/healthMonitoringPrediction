package com.bistel.a3.portal.domain.usermgt;

import java.util.List;

public class OperationVo {
	boolean actionAll;
	boolean functionAll;
	boolean view;
	boolean create;
	boolean modify;
	boolean delete;
	List<ActionExtVo> actionExt;
	
	public boolean isActionAll() {
		return actionAll;
	}
	public void setActionAll(boolean actionAll) {
		this.actionAll = actionAll;
	}
	public boolean isFunctionAll() {
		return functionAll;
	}
	public void setFunctionAll(boolean functionAll) {
		this.functionAll = functionAll;
	}
	public boolean isView() {
		return view;
	}
	public void setView(boolean view) {
		this.view = view;
	}
	public boolean isCreate() {
		return create;
	}
	public void setCreate(boolean create) {
		this.create = create;
	}
	public boolean isModify() {
		return modify;
	}
	public void setModify(boolean modify) {
		this.modify = modify;
	}
	public boolean isDelete() {
		return delete;
	}
	public void setDelete(boolean delete) {
		this.delete = delete;
	}
	public List<ActionExtVo> getActionExt() {
		return actionExt;
	}
	public void setActionExt(List<ActionExtVo> actionExt) {
		this.actionExt = actionExt;
	}	
}
