package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.*;
import com.bistel.a3.portal.service.impl.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.QueryParam;
import java.security.Principal;
import java.util.List;

/**
 * Modified by alan on 2016.11.16
 * Created by yohan on 15. 10. 29.
 */
@RestController
@RequestMapping("/dashboards")
@Transactional
public class DashboardController {
	
	@Autowired
	private DashboardService dashboardSerice;
	
	/**
	 * onlyMyDashboard 값에 따라 true면 내가 생성한 Dashboard만 false면 share된 Dashboard
	 * 포함해서 null이면 default값으로 내가 생성한 Dashboard만 나타나도록 함.
	 * ex)localhost:8080/portal/service/dashboard?onlyMyDashboard=true
	 */
	@RequestMapping(method = RequestMethod.GET)
	public List<Dashboard> gets(Principal user, @QueryParam("onlyMyDashboard") String onlyMyDashboard) {
		
		return dashboardSerice.gets(user, onlyMyDashboard);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{dashboardId}")
	public Dashboard get(@PathVariable Long dashboardId) {
		return dashboardSerice.get(dashboardId);
	}

	/**
	 * 입력받은 Request로 dashboard 생성.
	 */
	@RequestMapping(method = RequestMethod.PUT)
	public Dashboard create(@RequestBody Dashboard dashboard, Principal user) {		
		return dashboardSerice.create(dashboard, user);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{dashboardId}")
	public Dashboard set(@PathVariable Long dashboardId, @RequestBody Dashboard dashboard, Principal user) {
		return dashboardSerice.set(dashboardId, dashboard, user);
	}
	
	// GET /service/dashboards/{dashboardId}/sharedusers
//	@RequestMapping(method = RequestMethod.GET, value = "/{dashboardId}/sharedusers")
//	public List<User> selectSharedList(Principal user, @PathVariable(value = "dashboardId") Long dashboardId) {
//		return dashboardSerice.selectSharedList(user, dashboardId);
//	}

	/**
	 * 선택된 dashboardId를 통해 한명 또는 여러 유저에게 share 한다.
	 */
//	@RequestMapping(method = RequestMethod.PUT, value = "/{dashboardId}/sharedusers")
//	public void share(@PathVariable Long dashboardId, @RequestBody List<Dashboard> dashboardList, Principal user) {
//		dashboardSerice.share(dashboardId, dashboardList, user);
//	}


	/**
	 * 특정 user에게만 Share된 dashboard를 삭제한다.
	 */
//	@RequestMapping(method = RequestMethod.DELETE, value = "/{dashboardId}/sharedusers/{userId}")
//	public void removeShare(@PathVariable Long dashboardId, @PathVariable String userId, Principal user) {
//		dashboardSerice.removeShare(dashboardId, userId, user);
//	}
	
	/**
	 * dashboard delete.
	 * 1.내가 만든 dashboard 일 경우 
	 * 	 1.1 dashboard와 관련된 widget, link 정보들을 모두 삭제한다.
	 *   1.2 dashboard를 share 해 준 user가 있다면 share 관계를 모두 삭제한다.
	 *     1.2.1 share 해 준 user들에게 Notification을 전달한다. 
	 * 2. Share 받은 dashboard일 경우 share 관계만 삭제한다.
     *   2.1 share 해 준 user에게 Notification을 전달한다.
	 */
	@RequestMapping(method = RequestMethod.DELETE, value = "/{dashboardId}")
	public void remove(@PathVariable Long dashboardId, Principal user) {
		dashboardSerice.remove(dashboardId, user);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{dashboardId}/home")
	public void set(@PathVariable Long dashboardId,Principal user) {
		//dashboardSerice.setArea(dashboard, user);
		dashboardSerice.setHome(dashboardId, user);
	}
	
	/**
	 * groupshare concept
	 */
	@RequestMapping(method = RequestMethod.GET, value = "/{dashboardId}/sharegroups")
	public List<DashboardShareUserGroup> selectUserGroupDashboardShare(@PathVariable Long dashboardId){
		return dashboardSerice.selectUserGroupDashboardShare(dashboardId);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/{dashboardId}/sharegroups")
	public void insertUserGroupDashboardShare(@PathVariable Long dashboardId, @RequestBody List<UserGroupDashboardShare> userGroupDashboardShare){
		dashboardSerice.insertUserGroupDashboardShare(dashboardId, userGroupDashboardShare);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{dashboardId}/sharegroups")
	public void deleteUserGroupDashboardShare(@PathVariable long dashboardId, @RequestBody List<UserGroupDashboardShare> userGroupDashboardShare)
	{
		dashboardSerice.deleteUserGroupDashboardShare(dashboardId, userGroupDashboardShare);
	}
	
	/*
	 * not impl.
	 * user의 dashboardlnk를 삭제한다.
	 * user와 관련된 group 정보를 가져온다.
	 * group id로 user 정보를 가져온다. 
	 * 다른 user와 dashboard의 관계가 없다면,
	 * group_id와 dashboard_id를 통해 group share를 지운다.
	 * 있다면, 지우지 않는다.
	 * */		
	@RequestMapping(method = RequestMethod.DELETE, value = "/{dashboardId}/sharedusers")
	public void deleteUserDashboardLnk(@PathVariable long dashboardId, @RequestBody List<UserDashboardLnk> userDashboardLnk)
	{
		dashboardSerice.deleteUserDashboardLnk(dashboardId, userDashboardLnk);
	}
	
	//@20161226 user, group ->integrated as member
	@RequestMapping(method = RequestMethod.GET, value = "/{dashboardId}/sharemembers")
	public List<DashboardShareMember>  selectShareDashboardMember(@PathVariable long dashboardId, Principal user)
	{
		return dashboardSerice.selectShareDashboardMember(dashboardId, user);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{dashboardId}/sharemembers")
	public void insertDashboardShareMembers(@PathVariable long dashboardId, @RequestBody List<DashboardShareMember> dashboardShareMember, Principal user)
	{
		dashboardSerice.insertDashboardShareMembers(dashboardId, dashboardShareMember, user);
	}
	
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{dashboardId}/sharemembers")
	public void deleteDashboardShareMembers(@PathVariable long dashboardId, @RequestBody List<DashboardShareMember> dashboardShareMember, Principal user)
	{
		dashboardSerice.deleteDashboardShareMembers(dashboardId, dashboardShareMember, user);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{dashboardId}/sharedusers/{userId}")	
	public void deleteDashboardeShareUser(@PathVariable long dashboardId, @PathVariable String userId, Principal user)
	{
		dashboardSerice.deleteDashboardeShareUser(dashboardId, userId, user);
	}
}
