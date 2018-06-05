package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.WorkspaceMapper;
import com.bistel.a3.portal.domain.common.*;
import com.bistel.a3.portal.util.notification.NotificationObjectMaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 2016.11.xx 기존 common service의 비구조화를 개선하기 위해, 구조적으로 변경하기 위해 생성 
 * (기존 mapper -> controller)
 * (수정 mapper -> component -> service -> controller)
 * @author AlanMinjaePark
 */
@Component
public class WorkspaceComponent {

	@Autowired
	private WorkspaceMapper workspaceMapper;

	@Autowired
	private NotificationComponent notificationComponent;
	
	
	public List<Workspace> getWorkspacesInculdeShare(String userId) {
		return workspaceMapper.selectByUserWithShare(userId);
	}
	
	public List<Workspace> getWorkspaces(String userId) {
		return workspaceMapper.selectByUser(userId);
	}
	
	public Workspace getWorkspace(Long workspaceId, String userId) {
		return workspaceMapper.selectById(userId, workspaceId);
	}
	
	/**
	 * WORKSPACE_A3, USER_WORKSPACE_LNK_A3 테이블에 함께 입력한다.
	 * @param workspace
	 */
	public void createWorkspace(Workspace workspace) {
		workspaceMapper.insert(workspace);
		workspaceMapper.insertUserWorkspaceLnk(workspace);		
	}
	
	/**
	 * Favorite은 USER_WORKSPACE_LNK_A3 테이블에 update 한다.
	 * @param workspace
	 */
	public void updateWorkspace(Workspace workspace) {
		workspaceMapper.update(workspace);
		updateWorkspaceFavorite(workspace);
	}	
	
	public void updateWorkspaceFavorite(Workspace workspace)
	{
		workspaceMapper.updateWorkspaceFavorite(workspace);
	}
	
	/**
	 * only my workspace : NONE
	 * share 해준 workspace : SHARING
	 * share 받은 workspace : SHARED
	 */
	public String getWorkspaceShareStatus(Long workspaceId, String userId) {
		
		String shareStatus = "NONE";
		int workspaceUserCount = workspaceMapper.selectWorkspaceCountByWorkspaceId(workspaceId);
		String ownerId = getOwnerIdByWorkspaceId(workspaceId);
		
		if (workspaceUserCount == 1 && ownerId != null && ownerId.equals(userId)) {
			shareStatus = "NONE";
		}
		else if (workspaceUserCount > 1 )
		{

			if (ownerId != null && ownerId.equals(userId)) {
				shareStatus = "SHARING";
			} else
			if	(ownerId != null && !ownerId.equals(userId)){
				shareStatus = "SHARED";
			}
			 	
		}
		return shareStatus;
	}
	
	public void deleteWorkspaceLinkById(Long workspaceId, String userId) {
		workspaceMapper.deleteWorkspaceLinkById(workspaceId, userId);
	}	
	
	public void deleteWorkspaceById(Long workspaceId, String userId) {
		workspaceMapper.delete(workspaceId, userId);
	}	
	
	public List<String> getSharingUsersById(Long workspaceId, String userId) {
		return workspaceMapper.selectSharingUsersByWorkspaceId(workspaceId, userId);
	}
	
	public List<String> getShareGroupsById(Long workspaceId) {
		return workspaceMapper.selectShareGroupsByWorkspaceId(workspaceId);
	}
	
	public List<String> getSharedUsersById(Long workspaceId) {
		return workspaceMapper.selectSharedUsersByOworkspaceIdIncludeOwner(workspaceId);
	}
	
	/**
	 * share 해준 workspace 삭제
	 * 삭제후 Notification을 발송한다.
	 * @param workspaceId
	 * @param sharingUserId
	 * @param ownerUserId
	 */
	public void deleteSharingWorkspaceUsersById(List<String> userList, Long workspaceId, String ownerUserId) {
		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		String workspaceTitle = workspaceMapper.selectWorkspaceTitle(workspaceId);
		
		for (String sharingUserId : userList ) {
			deleteWorkspaceLinkById(workspaceId, sharingUserId);
			notificationComponent.insertNotification(notificationObjectMaker.makeWorkspaceShareDeletedNotification(workspaceId, 
					workspaceTitle, ownerUserId, ownerUserId, sharingUserId));
		}
	}	
	
	public void deleteSharingWorkspaceGroupsById(List<String> groupList, Long workspaceId) {
		for (String groupId : groupList) {
			deleteShareGroupById(workspaceId, groupId);
		}
	}	
	
	public void deleteShareGroupById(Long workspaceId, String groupId) {
		workspaceMapper.deleteGroupShareById(workspaceId, groupId);
	}	
	
	public String getOwnerIdByWorkspaceId(Long workspaceId) {
		return workspaceMapper.selectUserIdByWorkspaceId(workspaceId);
	}	
	
	public void deleteSharedWorkspaceUserById(String userId, Long workspaceId, String ownerUserId, String sharedUserId) {
		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		String workspaceTitle = workspaceMapper.selectWorkspaceTitle(workspaceId);
		
		deleteWorkspaceLinkById(workspaceId, userId);
		notificationComponent.insertNotification(notificationObjectMaker.makeWorkspaceShareDeletedNotification(workspaceId, 
					workspaceTitle, ownerUserId, userId, sharedUserId));

	}
	
	public List<MyWorkspace> getMyWorkspaces(String userId)
	{
		List<MyWorkspace> myWorkspaces = workspaceMapper.selectMyWorkspaces(userId);
		int index = 0;

		for(MyWorkspace myWorkspace : myWorkspaces)
		{
			Long workspaceId = myWorkspace.getWorkspaceId();
			
			setShareIntoIntoMyWorkspace(myWorkspace, userId, workspaceId);
			myWorkspaces.set(index, myWorkspace);
			index++;
		}
		
		return myWorkspaces;
	}
	
	private void setShareIntoIntoMyWorkspace(MyWorkspace myWorkspace, String userId, Long workspaceId) {
		String shareType = "";
		List<WorkspaceShareMemberInfo> shareInfoList = null;
		if (myWorkspace.getWorkspaceCount() == 1 && myWorkspace.getUserId().equals(userId)) {
			shareType = "mine;";
		} else
		if (myWorkspace.getWorkspaceCount() > 1) {
			if (!myWorkspace.getUserId().equals(userId))
				shareType = "user-shared;";
			else {
				// sharing user를 검색해야한다.
				shareInfoList = getShareInfo(workspaceId, userId);
				shareType = makeShareType(shareInfoList);
				
				myWorkspace.setShareInfo(shareInfoList);
				myWorkspace.setShareType(shareType);
			}
		} else {
			shareType = "mine;";
		}
		myWorkspace.setShareType(shareType);
	}
	
	private List<WorkspaceShareMemberInfo> getShareInfo(Long workspaceId, String userId) {
        List<WorkspaceShareMemberInfo> shareInfoList = workspaceMapper.selectWorspaceShareMemberInfo(workspaceId, userId);

		return shareInfoList;
	}
	
	private String makeShareType( List<WorkspaceShareMemberInfo> shareInfoList) {
		String shareType = "";
		String userType = "";
		if (shareInfoList == null ) return shareType;
		
		for (int index = 0; index < shareInfoList.size(); index++) {
			
			userType = shareInfoList.get(index).getType();
			
			if (userType.equals("user"))
				shareType += "user-sharing;";
			if (userType.equals("group"))
				shareType += "group-sharing;";
		}
		return shareType;
	}

    public MyWorkspace getMyWorkspace(Long workspaceId, String userId) {
  		
		MyWorkspace myWorkspace = workspaceMapper.selectMyWorkspace(userId, workspaceId);
		setShareIntoIntoMyWorkspace(myWorkspace, userId, workspaceId);
		
		return myWorkspace;
	}
	
	public List<WorkspaceShareMember> getSharedWorkspaceMembers(long workspaceId, String userId)
	{

		List<WorkspaceShareMember> workspaceShareMemberList = workspaceMapper.selectShareWorkspaceMember(workspaceId, userId);
		
		// group내 user 정보 add
		int index = 0;
		for (WorkspaceShareMember workspaceShareMember : workspaceShareMemberList) {
			
			if (workspaceShareMember.getType().equals("group")) {
				String groupId = workspaceShareMember.getId();
				List<WorkspaceShareMemberGroupUser> groupUsers = workspaceMapper.selectUserImgByGroup(userId, groupId);
				workspaceShareMember.setGroupUsers(groupUsers);
			}
			workspaceShareMemberList.set(index++, workspaceShareMember);
		}
	
		return workspaceShareMemberList;		
	}	
	
	public List<String> getSharingGroupsById(Long workspaceId) {
		return workspaceMapper.selectSharingGroupsByWorkspaceId(workspaceId);
		
	}
    
	public void shareWorkspaceToGroups(Long workspaceId, List<String> groupIdList) {
		for (String groupId : groupIdList) {
			shareWorkspaceToGroup(workspaceId, groupId);
		}
	}	
	
	public void shareWorkspaceToGroup(Long workspaceId, String groupId) {
		workspaceMapper.insertWorkspaceShareMembersGroup(workspaceId, groupId);
	}	
	
	public void shareWorkspaceToUsers(Long workspaceId, List<String> userIdList, String ownerUserId) {
		for (String userId : userIdList) {
			shareWorkspaceToUser(workspaceId, userId, ownerUserId);
		}
	}
	
	public void shareWorkspaceToUser(Long workspaceId, String userId, String ownerUserId) {
		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		String workspaceTitle = getWorkspaceTitle(workspaceId);
		
		workspaceMapper.insertWorkspaceShareMembersUser(workspaceId, userId, Boolean.FALSE);
		
		notificationComponent.insertNotification(notificationObjectMaker.makeWorkspaceShareCreateNotification(workspaceId, 
				workspaceTitle, ownerUserId, ownerUserId, userId));
	}
	
	public String getGroupIdByUserId(Long workspaceId, String userId) {
		return workspaceMapper.selectGroupIdByUserId(userId, workspaceId);
	}
	
	public List<String> getWorkspaceSharingGroupUserListWithoutMyId(Long workspaceId, String userId, String groupId) {
		return workspaceMapper.selectWorkspaceSharingGroupUserListWithoutMyId(workspaceId, userId, groupId);
	}
	
	/**
	 * share 관계 해지
	 * 삭제후 Notification을 발송한다.
	 * @param workspaceId
	 * @param sharingUserId
	 * @param ownerUserId
	 */
	public void deleteSharingRelationUsersById(List<String> userList, Long workspaceId, String ownerUserId) {
		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		String workspaceTitle = workspaceMapper.selectWorkspaceTitle(workspaceId);
		
		for (String sharingUserId : userList ) {
			deleteWorkspaceLinkById(workspaceId, sharingUserId);
			notificationComponent.insertNotification(notificationObjectMaker.makeWorkspaceSharingDeletedNotification(workspaceId, 
					workspaceTitle, ownerUserId, ownerUserId, sharingUserId));
		}
	}	
	
    public List<User> getWorkspaceSharedUsers(String userId)
	{
	    return workspaceMapper.selectWorkspaceSharedUser(userId);
    }
		
    public List<User> getWorkspaceSharingUsers(String userId)
    {
		return workspaceMapper.selectWorkspaceSharingUser(userId);
    }	
	
    /**
	 * Title 검색 by workspaceId
	 */
    private String getWorkspaceTitle(Long workspaceId) {
		return workspaceMapper.selectWorkspaceTitle(workspaceId);
	}
}
