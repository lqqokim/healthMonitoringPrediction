package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.ShareUser;
import com.bistel.a3.portal.domain.common.WorkspaceMap;
import com.bistel.a3.portal.module.common.WorkspaceMapComponent;
import com.bistel.a3.portal.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * common
 * @author AlanMinjaePark
 *
 */

@Service
public class WorkspaceMapService {
	
	@Autowired
	private WorkspaceMapComponent workspaceMapComponent;

	final static Long DEFAUL_WORKSPACE_NODE_COUNT = 30L;
	
	public List<WorkspaceMap> getWorkspaceMaps(String userId, String includeSharedUserMap, String workspacesCount) {
		
		// includeSharedUserMap : null일 경우는 false 처리
		boolean isIncludeSharedUserMap = StringUtil.parseBoolean(includeSharedUserMap);
		Long mapSize = 0L;
		if (workspacesCount == null) {
			mapSize = DEFAUL_WORKSPACE_NODE_COUNT;
		} else {
			mapSize = StringUtil.parseLong(workspacesCount);	
		}
		
		
		if (isIncludeSharedUserMap) {
			return workspaceMapComponent.getWorkspaceMapIncludeSharedMap(userId, mapSize);
		} else {
			List<WorkspaceMap> workspaceMapList = new ArrayList<WorkspaceMap>();
			workspaceMapList.add(workspaceMapComponent.getWorkspaceMapOnlyUserId(userId, mapSize));
			return workspaceMapList;
		}

	}
	
	public WorkspaceMap getWorkspaceMap(String userId, String workspacesCount) {
		
		Long mapSize = 0L;
		if (workspacesCount == null) {
			mapSize = DEFAUL_WORKSPACE_NODE_COUNT;
		} else {
			mapSize = StringUtil.parseLong(workspacesCount);	
		}
		
		
		return workspaceMapComponent.getWorkspaceMapOnlyUserId(userId, mapSize);

	}
	
	public List<ShareUser> getShareUserList(String userId) {
		return workspaceMapComponent.getShareUserList(userId);
	}
	
	public WorkspaceMap getWorkspaceMapByWorkspaceId(Long workspaceId) {
		return workspaceMapComponent.getWorkspaceMapByWorkspaceId(workspaceId);
	}
	
    public WorkspaceMap getSharedWorkspaceMapBySharedUser(String sharedUserId ,String userId, String workspacesCount) {
		
		Long mapSize = 0L;
		if (workspacesCount == null) {
			mapSize = DEFAUL_WORKSPACE_NODE_COUNT;
		} else {
			mapSize = StringUtil.parseLong(workspacesCount);	
		}
		
		return workspaceMapComponent.getSharedWorkspaceMapBySharedUser(sharedUserId, userId, mapSize);
	}
	
    public WorkspaceMap getSharingWorkspaceMapBySharingUser(String sharingUserId ,String userId, String workspacesCount) {
		
		Long mapSize = 0L;
		if (workspacesCount == null) {
			mapSize = DEFAUL_WORKSPACE_NODE_COUNT;
		} else {
			mapSize = StringUtil.parseLong(workspacesCount);	
		}
		
		return workspaceMapComponent.getSharingWorkspaceMapBySharedUser(sharingUserId, userId, mapSize);
	}
}
