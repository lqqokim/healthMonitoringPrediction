package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.MyWorkspace;
import com.bistel.a3.portal.domain.common.User;
import com.bistel.a3.portal.domain.common.Workspace;
import com.bistel.a3.portal.domain.common.WorkspaceShareMember;
import com.bistel.a3.portal.service.impl.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.QueryParam;
import java.security.Principal;
import java.util.List;

/**
 * Modified by david lee on 2017.2.20
 * Modified my alan on 2016.11.16
 * Created by yohan on 15. 11. 3.
 **/
@RestController
@RequestMapping("/workspaces")
@Transactional
public class WorkspaceController {
	
	@Autowired
	private WorkspaceService workspaceService;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<Workspace> gets(Principal user, @QueryParam("onlyMyWorkspaces") String onlyMyWorkspaces) {
		
		return workspaceService.gets(user.getName(), onlyMyWorkspaces);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/{workspaceId}")
	public Workspace get(@PathVariable Long workspaceId, Principal user) {
		return workspaceService.get(workspaceId, user.getName());
	}

	/**
	 * Create Workspace
	 */
	@RequestMapping(method = RequestMethod.PUT)
	public Workspace create(@RequestBody Workspace workspace, Principal user) {
		return workspaceService.create(workspace, user.getName());
	}
	
	/**
	 * update workspace
	 */
	@RequestMapping(method = RequestMethod.PUT, value = "/{workspaceId}")
	public Workspace set(@RequestBody Workspace workspace, @PathVariable Long workspaceId, Principal user) {
		return workspaceService.updateWorkspace(workspace, workspaceId, user.getName());
	}	
	
	/**
	 * workspace를 삭제. 
	 * only my / share 해준 workspace / share 받은 workspace 의 상황에 따른 처리가 필요함.
	 * share 관계가 있을 경우 각 user들에게 Notification도 해줘야 한다.
	 */
	@RequestMapping(method = RequestMethod.DELETE, value = "/{workspaceId}")
	public void remove(@PathVariable Long workspaceId, Principal user) {
		workspaceService.remove(workspaceId, user.getName());		
	}	
	
	@RequestMapping(method = RequestMethod.DELETE)
	public void deleteWorkspaces(@RequestBody List<Workspace> workspaces, Principal user) {
		workspaceService.removeWorkspaces(workspaces, user.getName());
	}	
	
	//Update a workspace for favorite
	@RequestMapping(method = RequestMethod.PUT, value = "/{workspaceId}/favorite")	
	public void updateWorkspaceFavorite(@PathVariable long workspaceId, @RequestBody Workspace workspace, Principal user)
	{
		workspace.setUserId(user.getName());
		workspace.setWorkspaceId(workspaceId);
		workspaceService.updateWorkspaceFavorite(workspace);	
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/myworkspaces")
	public List<MyWorkspace> getMyWorkspaces(Principal user)
	{
		return workspaceService.getMyWorkspaces(user.getName());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/myworkspaces/{workspaceId}")
	public MyWorkspace getMyWorkspace(@PathVariable long workspaceId, Principal user)
	{
		return workspaceService.getMyWorkspace(workspaceId, user.getName());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/{workspaceId}/sharemembers")
	public List<WorkspaceShareMember> getShareWorkspaceMember(@PathVariable long workspaceId, Principal user)
	{
		return workspaceService.getSharedWorkspaceMembers(workspaceId, user.getName());
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/{workspaceId}/sharemembers")	
	public void createWorkspaceShareToMembers(@PathVariable long workspaceId, @RequestBody List<WorkspaceShareMember> workspaceShareMember, Principal user)
	{
		workspaceService.createWorkspaceShareToMembers(workspaceId, workspaceShareMember, user.getName());
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{workspaceId}/sharemembers")	
	public void deleteWorkspaceShareMembers(@PathVariable long workspaceId, @RequestBody List<WorkspaceShareMember> workspaceShareMember, Principal user)
	{
		workspaceService.deleteWorkspaceShareMembers(workspaceId, workspaceShareMember, user.getName());
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{workspaceId}/sharedusers/{userId}")	
	public void deleteWorkspaceShareUser(@PathVariable long workspaceId, @PathVariable String userId, Principal user)
	{
		workspaceService.deleteWorkspaceShareUser(workspaceId, userId, user.getName());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/sharedusers")
    public List<User> selectWorkspaceSharedUser(Principal user)
    {
		return workspaceService.getWorkspaceSharedUsers(user.getName());
    }
	
	@RequestMapping(method = RequestMethod.GET, value = "/sharingusers")
    public List<User> selectWorkspaceSharingUser(Principal user)
    {
		return workspaceService.getWorkspaceSharingUsers(user.getName());
    }

}
