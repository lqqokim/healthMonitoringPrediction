package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.*;
import com.bistel.a3.portal.module.common.WorkspaceComponent;
import com.bistel.a3.portal.util.ListUtil;
import com.bistel.a3.portal.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkspaceService {
	
	@Autowired
	private WorkspaceComponent workspaceComponent;
	
	@Autowired
	private TaskerService taskerService;	
	
	@Autowired
	private UserMgtService userMgtService;
	
	public List<Workspace> gets(String userId, String onlyMyWorkspaces) {

		List<Workspace> workspaceList = null;
		
		boolean isIncludeShareWorkspace = StringUtil.parseBoolean(onlyMyWorkspaces);
		
		if (!isIncludeShareWorkspace) {
			workspaceList = workspaceComponent.getWorkspacesInculdeShare(userId);
		} else {
			workspaceList = workspaceComponent.getWorkspaces(userId);
		}	
		
		return workspaceList;
	}
	
	public Workspace get(Long workspaceId, String userId) {
		return workspaceComponent.getWorkspace(workspaceId, userId);
	}
	
	public Workspace create(Workspace workspace, String userId) {
		
		workspace.setUserId(userId);
		
		if(workspace.getFavorite() == null)
		{
			workspace.setFavorite(false);
		}
		
		workspaceComponent.createWorkspace(workspace);
		
		return workspaceComponent.getWorkspace(workspace.getWorkspaceId(), userId);
	}		
	
	public Workspace updateWorkspace(Workspace workspace, Long workspaceId, String userId) {
		
		workspace.setWorkspaceId(workspaceId);
		workspace.setUserId(userId);
		
		workspaceComponent.updateWorkspace(workspace);
		
		return workspaceComponent.getWorkspace(workspace.getWorkspaceId(), userId);
	}
	
	/**
	 * 1. OnlyMy Workspace / Share 해준 workspace / Share 받은 workspace 파악
	 * 2. share 관계가 있을 경우 Notification 발송
	 * 3. workspace에 속한 tasker 관련 정보들 삭제 
	 * 
	 * FK 관계가 있어 Tasker 관련 정보 먼저 삭제해야 한다.
	 * 
	 * @param workspaceId
	 * @param user
	 */
	@Transactional
	public void remove(Long workspaceId, String userId) {

		removeTasker(workspaceId, userId);
		
		// workspace node만 삭제
		removeWorkspaceNode(workspaceId, userId);
	}	
	
	/**
	 * 하위의 모든 tasker 관련 정보들 삭제
	 * (Tasker, TaskerBehavior, TaskerProperty, TaskerTree 등)
	 * @param workspaceId
	 * @param user
	 */
	private void removeTasker(Long workspaceId, String userId) {
		List<Tasker> taskers = taskerService.getTakserListByWorkspaceId(workspaceId);
		for (Tasker tasker : taskers) {
			taskerService.removeOnlyTaksersById(workspaceId, tasker.getTaskerId(), userId);
		}
	}	
	
	/**
	 * 1. OnlyMy Workspace / Share 해준 workspace / Share 받은 workspace 파악
	 * 2. share 관계가 있을 경우 Notification 발송
	 * USER_WORKSPACE_LNK_A3 테이블 데이터부터 삭제해야 한다.
	 * @param workspaceId
	 * @param userId
	 */
	public void removeWorkspaceNode(Long workspaceId, String userId) {
		String shareStatus = workspaceComponent.getWorkspaceShareStatus(workspaceId, userId);
		
		// Only My Workspace
		if (shareStatus.equals("NONE")) {
			workspaceComponent.deleteWorkspaceLinkById(workspaceId, userId);
			workspaceComponent.deleteWorkspaceById(workspaceId, userId);
		}
		// Share 해준 workspace
		else if (shareStatus.equals("SHARING")) {
			removeSharingWorkspace(workspaceId, userId);

		}
		// share 받은 workspace
		else if (shareStatus.equals("SHARED")) {
            removeSharedWorkspace(workspaceId, userId);
		}
	}	
	
	private void removeSharingWorkspace(Long workspaceId, String userId) {
		List<String> sharingUserList = workspaceComponent.getSharingUsersById(workspaceId, userId);
		List<String> sharingGroupList = workspaceComponent.getShareGroupsById(workspaceId);
		
		// Notification 필요함.
		if (sharingUserList != null && sharingUserList.size() > 0) {
			workspaceComponent.deleteSharingWorkspaceUsersById(sharingUserList, workspaceId, userId);
		}

		if (sharingGroupList != null && sharingGroupList.size() > 0) {
			workspaceComponent.deleteSharingWorkspaceGroupsById(sharingGroupList, workspaceId);
		}

		workspaceComponent.deleteWorkspaceLinkById(workspaceId, userId);
		workspaceComponent.deleteWorkspaceById(workspaceId, userId);
	}
	
	private void removeSharedWorkspace(Long workspaceId, String userId) {

		String ownerUserId = workspaceComponent.getOwnerIdByWorkspaceId(workspaceId);
		List<String> sharedUserList = workspaceComponent.getSharedUsersById(workspaceId);
		List<String> sharedGroupList = workspaceComponent.getShareGroupsById(workspaceId);

		// Notification 필요함.
		if (sharedUserList != null && sharedUserList.size() > 0) {
			sharedUserList.add(ownerUserId);
			for (String sharedUserId : sharedUserList) {
				workspaceComponent.deleteSharedWorkspaceUserById(userId, workspaceId, ownerUserId, sharedUserId);
			}	
		}

		if (sharedGroupList != null && sharedGroupList.size() > 0) {
			workspaceComponent.deleteSharingWorkspaceGroupsById(sharedGroupList, workspaceId);
		}

		workspaceComponent.deleteWorkspaceById(workspaceId, ownerUserId);
		
	}
	
	public void removeWorkspaces(List<Workspace> workspaces, String userId) {
		for (Workspace workspace : workspaces) {
			remove(workspace.getWorkspaceId(), userId); 
		}
	}	
	
	public void updateWorkspaceFavorite(Workspace workspace)
	{
		workspaceComponent.updateWorkspaceFavorite(workspace);
	}	
	
	public List<MyWorkspace> getMyWorkspaces(String userId)
	{
		return workspaceComponent.getMyWorkspaces(userId);
	}
	
	public MyWorkspace getMyWorkspace(Long workspaceId, String userId)
	{
		return workspaceComponent.getMyWorkspace(workspaceId, userId);
	}
	
	public List<WorkspaceShareMember> getSharedWorkspaceMembers(Long workspaceId, String userId)
	{
		return workspaceComponent.getSharedWorkspaceMembers(workspaceId, userId);
	}
	
	/**
	 * Share to group, share to user
	 * @param workspaceId
	 * @param workspaceShareMember
	 * @param userId
	 */
	@Transactional
	public void createWorkspaceShareToMembers(long workspaceId, List<WorkspaceShareMember> workspaceShareMemberList, String userId)
	{
		String id = "";
		String type ="";
		
		List<String> groupUserList = null;
		List<String> insertConfirmUserList = new ArrayList<String>();
		List<String> insertConfirmGroupList = new ArrayList<String>();
		
		for (WorkspaceShareMember workspaceShareMember : workspaceShareMemberList) {
			id = workspaceShareMember.getId();
			type = workspaceShareMember.getType();
			
			if (type.equals("group")) {
				groupUserList = userMgtService.selectGroupUserIds(id);
				ListUtil.addItemWithoutDuplication(insertConfirmGroupList, id);
				ListUtil.mergeListWithoutDuplication(insertConfirmUserList, groupUserList);
			} else 
			if (type.equals("user")) {
				ListUtil.addItemWithoutDuplication(insertConfirmUserList, id);
			}
		}
		
		if (insertConfirmUserList.size() > 0 && insertConfirmUserList.contains(userId)) {
			insertConfirmUserList.remove(userId);
		}
		
		// share된 user list & group list의 중복 제거
		List<String> existSharedGroupList = workspaceComponent.getSharingGroupsById(workspaceId);
		List<String> existSharedUserList = workspaceComponent.getSharingUsersById(workspaceId, userId);
		
		if (existSharedGroupList != null && existSharedGroupList.size() > 0) {
			ListUtil.removeContainListItems(insertConfirmGroupList, existSharedGroupList);
		}
		
		if (existSharedUserList != null && existSharedUserList.size() > 0) {
			ListUtil.removeContainListItems(insertConfirmUserList, existSharedUserList);
		}
		
		// 2. insert share group
		if (insertConfirmGroupList.size() > 0) {
			workspaceComponent.shareWorkspaceToGroups(workspaceId, insertConfirmGroupList);
		}
		
		// 3. insert share user & notification send
		if (insertConfirmUserList.size() > 0) {
			workspaceComponent.shareWorkspaceToUsers(workspaceId, insertConfirmUserList, userId);
		}	
	}
	
	public void deleteWorkspaceShareMembers(long workspaceId, List<WorkspaceShareMember> workspaceShareMemberList, String userId)
	{
		// 1. Share Group List / share user list 생성
		List<String> deleteGroupList = new ArrayList<String>();
		List<String> deleteUserList = new ArrayList<String>();

		List<String> groupUserList = null;
		String id = "";
		String type ="";
		
		for (WorkspaceShareMember workspaceShareMember : workspaceShareMemberList) {
			id = workspaceShareMember.getId();
			type = workspaceShareMember.getType();
			
			if (type.equals("group")) {
				deleteGroupList.add(id);
			} else
			if (type.equals("user")) {
				deleteUserList.add(id);
				String groupId = workspaceComponent.getGroupIdByUserId(workspaceId, id);
				if (groupId != null && !groupId.equals("")) {
					groupUserList = workspaceComponent.getWorkspaceSharingGroupUserListWithoutMyId(workspaceId, userId, groupId);
				}	
				if (groupUserList != null && groupUserList.size() < 1) {
					deleteGroupList.add(userMgtService.selectGroupIdByUserId(id));
				}
			}
		}
		
		// share 목록에 본인 ID가 있을 경우 삭제
		if (deleteUserList.size() > 0 && deleteUserList.contains(userId)) {
			deleteUserList.remove(userId);
		}
		
		// 2. insert share group
		if (deleteGroupList.size() > 0) {
			workspaceComponent.deleteSharingWorkspaceGroupsById(deleteGroupList, workspaceId);
		}
		
		// 3. insert share user & notification send
		if (deleteUserList.size() > 0) {
			workspaceComponent.deleteSharingRelationUsersById(deleteUserList, workspaceId, userId);
		}
	}
	
	public void deleteWorkspaceShareUser(long workspaceId, String sharingUserId, String ownerUserId)
	{
		// 1. Share Group List / share user list 생성
		List<String> deleteGroupList = new ArrayList<String>();
		List<String> deleteUserList = new ArrayList<String>();

		List<String> groupUserList = null;

		groupUserList = workspaceComponent.getWorkspaceSharingGroupUserListWithoutMyId(workspaceId, sharingUserId, ownerUserId);

		deleteUserList.add(sharingUserId);
		
		if (groupUserList != null && groupUserList.size() <= 1) {
			deleteGroupList.add(userMgtService.selectGroupIdByUserId(sharingUserId));
		}
		
		// share 목록에 본인 ID가 있을 경우 삭제
		if (deleteUserList.size() > 0 && deleteUserList.contains(ownerUserId)) {
			deleteUserList.remove(ownerUserId);
		}
		
		// 2. insert share group
		if (deleteGroupList.size() > 0) {
			workspaceComponent.deleteSharingWorkspaceGroupsById(deleteGroupList, workspaceId);
		}
		
		// 3. insert share user & notification send
		if (deleteUserList.size() > 0) {
			workspaceComponent.deleteSharingRelationUsersById(deleteUserList, workspaceId, ownerUserId);
		}
	}
	
    public List<User> getWorkspaceSharedUsers(String userId)
    {
    	return workspaceComponent.getWorkspaceSharedUsers(userId);
    }
    
    public List<User> getWorkspaceSharingUsers(String userId)
    {
		return workspaceComponent.getWorkspaceSharingUsers(userId);
    }	
	
    public List<Workspace> getWorkspaces(String userId) {
    	return workspaceComponent.getWorkspaces(userId);
    }
	
}
