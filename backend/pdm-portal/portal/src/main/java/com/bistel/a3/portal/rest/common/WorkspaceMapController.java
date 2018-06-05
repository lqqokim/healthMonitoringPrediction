package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.ShareUser;
import com.bistel.a3.portal.domain.common.WorkspaceMap;
import com.bistel.a3.portal.service.impl.WorkspaceMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.QueryParam;
import java.security.Principal;
import java.util.List;

/**
 * Modified by david lee on 2017.3.13
 * Modified by alan on 2016.11.16
 * Created by yohan on 11/30/15.
 */
@RestController
@RequestMapping("/workspacemap")
public class WorkspaceMapController {
	
	@Autowired
	private WorkspaceMapService workspaceMapService;
	
	/**
	 * ?includeSharedUserMapd= true|false null일 경우 기존 로직. true일 경우 share받은 Map
	 * 포함. false일 경우 자신의 Map만 출력.
	 */
	@RequestMapping(method = RequestMethod.GET)
	public List<WorkspaceMap> getIncludeSharedUserMap(Principal user, @QueryParam("includeSharedUserMap") String includeSharedUserMap, 
			                                              @QueryParam("workspacesCount") String workspacesCount) {
		return workspaceMapService.getWorkspaceMaps(user.getName(), includeSharedUserMap, workspacesCount);
	}

	
	/**
	 * 특정 아이디가 가지고 있는 workspaceMap.
	 */
	@RequestMapping(method = RequestMethod.GET, value = ("/{userId}"))
	public WorkspaceMap getWorkspaceMapByUserId(@PathVariable(value="userId") String userId, 
			                                    @QueryParam("workspacesCount") String workspacesCount) {
		return workspaceMapService.getWorkspaceMap(userId, workspacesCount);
	}	
	
	/**
	 * Session을 가지고 있는 id가 share받은. users들 list. + 해주고있
	 */
	@RequestMapping(method = RequestMethod.GET, value = ("/share/users"))
	public List<ShareUser> getSharedUserList(Principal user) {
		return workspaceMapService.getShareUserList(user.getName());		
	}
	
	@RequestMapping(method = RequestMethod.GET,  value = ("/workspace/{workspaceId}"))
	public WorkspaceMap selectWorkspaceMapByWorkspaceId(@PathVariable(value = "workspaceId") Long workspaceId) {
		return workspaceMapService.getWorkspaceMapByWorkspaceId(workspaceId);
	}
	
	/**
	 * 자신에게 share해준 user가 share한 workspaceMap만 리턴.
	 */
	@RequestMapping(method = RequestMethod.GET, value = ("/shared/{sharedUserId}"))
	public WorkspaceMap getSharedWorkspaceMapBySharedUser(@PathVariable String sharedUserId ,Principal user,
			                                       @QueryParam("workspacesCount") String workspacesCount) {
		return workspaceMapService.getSharedWorkspaceMapBySharedUser(sharedUserId, user.getName(), workspacesCount);
	}
	
	/**
	 * 자신이 share해준 workspaceMap (특정 사용자에게)
	 */	
	@RequestMapping(method = RequestMethod.GET, value = ("/sharing/{sharingUserId}"))
	public WorkspaceMap getSharingWorkspaceMapBySharingUser(@PathVariable String sharingUserId, Principal user, 
			                                          @QueryParam("workspacesCount") String workspacesCount) {
		return workspaceMapService.getSharingWorkspaceMapBySharingUser(sharingUserId, user.getName(), workspacesCount);
	}
	
}
