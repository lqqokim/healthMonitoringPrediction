package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.WorkspaceMapper;
import com.bistel.a3.portal.domain.common.*;
import com.bistel.a3.portal.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 2016.11.xx 기존 common service의 비구조화를 개선하기 위해, 구조적으로 변경하기 위해 생성 
 * 2017.01.xx 변경이 많이 됨 
 * workspace+tasker -> 분리된 부분이 많이 있음
 * 분리하여 쿼리 호출후, list 합침 
 * (기존 mapper -> controller)
 * (수정 mapper -> component -> service -> controller)
 * @author AlanMinjaePark
 */
@Component
public class WorkspaceMapComponent {

	@Autowired
	private WorkspaceMapper workspaceMapper;

	@Autowired
	private UserService userService;
	
	/**
	 * Share 받은 workspacemap을 포함하여 return 함.
	 * workspaceCount가 return하는 limit 임. 
	 * @param userId
	 * @param workspacesCount
	 * @return
	 */
	public List<WorkspaceMap> getWorkspaceMapIncludeSharedMap(String userId, Long workspacesCount) {
		
		List<WorkspaceOwner> workspaceIdOwnerList = workspaceMapper.selectWorkspaceIdsWithOwnerId(userId, true, workspacesCount);
		
		List<WorkspaceMap> workspaceMapList = makeWorkspaceMapList(userId, workspaceIdOwnerList);
		
		return workspaceMapList;
	}
	
	
	public WorkspaceMap getWorkspaceMapOnlyUserId(String userId, Long workspacesCount) {
		
		// Map에서 workspace Node 만 검색
		List<WorkspaceOwner> workspaceIdOwnerList = workspaceMapper.selectWorkspaceIdsWithOwnerId(userId, false, workspacesCount);
		
		WorkspaceMap workspaceMap = makeWorkspaceMap(userId, workspaceIdOwnerList);
		
		return workspaceMap;
	}	
	
	private List<WorkspaceMap> makeWorkspaceMapList(String userId, List<WorkspaceOwner> workspaceIdOwnerList) {
		
		if (workspaceIdOwnerList == null ||  workspaceIdOwnerList.size() == 0) 
			return null;
		
		List<WorkspaceMap> workspaceMapList = new ArrayList<WorkspaceMap>();
		WorkspaceMap workspaceMap = null;
		
		Map<String, List<Long>> workspaceIdListMap =  makeWorkspaceIdListMap(workspaceIdOwnerList);
		
		for (String ownerId : workspaceIdListMap.keySet() ) {
			workspaceMap = makeWorkspaceMapObject(ownerId, workspaceIdListMap.get(ownerId));
			workspaceMapList.add(workspaceMap);
		}
		
		return workspaceMapList;
	}
	
	private Map<String, List<Long>> makeWorkspaceIdListMap(List<WorkspaceOwner> workspaceIdOwnerList) {
		Map<String, List<Long>>  workspaceIdListMap = new HashMap<String, List<Long>>();
		
		String ownerId = "";
		Long workspaceId = null;
		List<Long> workspaceIds = null;
		
		for(WorkspaceOwner workspaceOwner : workspaceIdOwnerList) {
			ownerId = workspaceOwner.getOwnerId();
			workspaceId = workspaceOwner.getWorkspaceId();
			
			if (workspaceIdListMap.containsKey(ownerId)) {
				workspaceIds = workspaceIdListMap.get(ownerId);
			} else {
				workspaceIds = new ArrayList<Long>();
			}
			workspaceIds.add(workspaceId);
			workspaceIdListMap.put(ownerId,  workspaceIds);
		}
		
		return workspaceIdListMap;
	}
	
	private WorkspaceMap makeWorkspaceMapObject(String userId, List<Long> workspaceIdList) {
		
		WorkspaceMap workspaceMap = new WorkspaceMap();
		
		if (workspaceIdList == null || workspaceIdList.size() == 0) {
			return null;
		}
		
		// User 정보 검색
		User userInfo = userService.get(userId); // userInfo.
		
		List<WorkspaceMapNode> workspaceMapNodeList = workspaceMapper.selectWorkspaceNodes(userId, workspaceIdList);
		
		// workspace 하부의 tasker map 검색
		List<WorkspaceMapNode> taskerNodeList = workspaceMapper.selectTaskerMapByWorkspaceIdList(userId, workspaceIdList);
		// map data 톻합
		workspaceMapNodeList.addAll(taskerNodeList);
		
		workspaceMap.setUserId(userInfo.getUserId());
		workspaceMap.setUserName(userInfo.getName());
		workspaceMap.setImageUrl(userInfo.getImageUrl());
		workspaceMap.setScore(10);
		workspaceMap.setMap(workspaceMapNodeList);

		return workspaceMap;
	}
	
    private WorkspaceMap makeWorkspaceMap(String userId, List<WorkspaceOwner> workspaceIdOwnerList) {
		
		if (workspaceIdOwnerList == null ||  workspaceIdOwnerList.size() == 0) 
			return null;
		
		List<Long> workspaceIdList = new ArrayList<Long>();
		
		for(WorkspaceOwner workspaceOwner : workspaceIdOwnerList) {
			workspaceIdList.add(workspaceOwner.getWorkspaceId());	
		}
		
		WorkspaceMap workspaceMap = makeWorkspaceMapObject(userId, workspaceIdList);
		
		return workspaceMap;
	}
	
    /**
	 * Session을 가지고 있는 id가 share받은. users들 list.
	 */
	public List<ShareUser> getShareUserList(String userId) {
		List<ShareUser> shareUsers = new ArrayList<ShareUser>();
		shareUsers.addAll(workspaceMapper.selectSharedWorkspaceUsers(userId));
		shareUsers.addAll(workspaceMapper.selectSharingWorkspaceUsers(userId));
		return shareUsers;
	}
	
	public WorkspaceMap getWorkspaceMapByWorkspaceId(Long workspaceId) {		
		User userInfo = workspaceMapper.selectUserByWorkspaceId(workspaceId);

		List<Long> workspaceIdList = new ArrayList<Long>();
		workspaceIdList.add(workspaceId);
		
		WorkspaceMap workspaceMap = makeWorkspaceMapObject(userInfo.getUserId(),  workspaceIdList);
		
		return workspaceMap;
	}
    
	/**
	 * 자신에게 share해준 user가 share한 workspaceMap만 리턴.
	 */
	public WorkspaceMap getSharedWorkspaceMapBySharedUser(String sharedUserId ,String userId, Long requestWorkspacesCount) {
		
		List<Long> workspaceIdList = workspaceMapper.selectSharedWorkspaceIds(sharedUserId, userId, requestWorkspacesCount);
		
		WorkspaceMap workspaceMap = makeWorkspaceMapObject(sharedUserId, workspaceIdList);
		
		return workspaceMap;
	}
	
    public WorkspaceMap getSharingWorkspaceMapBySharedUser(String sharingUserId ,String userId, Long requestWorkspacesCount) {
		
		List<Long> workspaceIdList = workspaceMapper.selectSharingWorkspaceIds(userId, sharingUserId, requestWorkspacesCount);
		
		WorkspaceMap workspaceMap = makeWorkspaceMapObject(sharingUserId, workspaceIdList);
		
		return workspaceMap;
	}	
	
}
