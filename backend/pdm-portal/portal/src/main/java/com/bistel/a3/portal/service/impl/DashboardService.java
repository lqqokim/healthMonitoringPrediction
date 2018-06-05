package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.*;
import com.bistel.a3.portal.domain.usermgt.UsersVo;
import com.bistel.a3.portal.module.common.DashboardComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {
	
	@Autowired
	private DashboardComponent dashboardComponent;
	
	public List<Dashboard> gets(Principal user, String onlyMyDashboard) {
		return dashboardComponent.gets(user, onlyMyDashboard);
	}


	public Dashboard get(Long dashboardId) {
		return dashboardComponent.get(dashboardId);
	}

	public Dashboard create(Dashboard dashboard, Principal user) {
		return dashboardComponent.create(dashboard, user);
	}

	public List<User> selectSharedList(Principal user, Long dashboardId) {
		return dashboardComponent.selectSharedList(user, dashboardId);
	}

	
/*	public void share(Long dashboardId, List<Dashboard> dashboardList, Principal user) {
		dashboardComponent.share(dashboardId, dashboardList, user);
	}*/

	public Dashboard set(Long dashboardId, Dashboard dashboard, Principal user) {
		return dashboardComponent.set(dashboardId, dashboard, user);
	}

	public void removeShare(Long dashboardId, String userId, Principal user) {
		dashboardComponent.removeShare(dashboardId, userId, user);
	}
	

	public void remove(Long dashboardId, Principal user) {
		dashboardComponent.remove(dashboardId, user);
	}

	public void set(@RequestBody Dashboard dashboard, Principal user) {
		dashboardComponent.set(dashboard, user);
	}

	public void setHome(Long dashboardId, Principal user) {
		dashboardComponent.setHome(dashboardId, user);
	}
	
	public List<DashboardShareUserGroup> selectUserGroupDashboardShare(Long dashboardId){
		return dashboardComponent.selectUserGroupDashboardShare(dashboardId);
	}
	
	public void insertUserGroupDashboardShare(long dashboardId, List<UserGroupDashboardShare> userGroupDashboardShare){
		dashboardComponent.insertUserGroupDashboardShare(dashboardId, userGroupDashboardShare);
	}
	public void deleteUserGroupDashboardShare(long dashboardId, List<UserGroupDashboardShare> userGroupDashboardShare){
		dashboardComponent.deleteUserGroupDashboardShare(dashboardId, userGroupDashboardShare);
	}
	
	public void deleteUserDashboardLnk(long dashboardId, List<UserDashboardLnk> userDashboardLnk)
	{
		dashboardComponent.deleteUserDashboardLnk(dashboardId, userDashboardLnk);
	}	
	
	
	//@20161226 user, group ->integrated as member
	public List<DashboardShareMember>  selectShareDashboardMember(long dashboardId, Principal user)
	{
		return dashboardComponent.selectShareDashboardMember(dashboardId, user);
	}
	
	public void insertDashboardShareMembers(long dashboardId, List<DashboardShareMember> dashboardShareMember, Principal user)
	{
		dashboardComponent.insertDashboardShareMembers(dashboardId, dashboardShareMember, user);
	}
	
	public void deleteDashboardShareMembers(long dashboardId, List<DashboardShareMember> dashboardShareMember, Principal user)
	{
		dashboardComponent.deleteDashboardShareMembers(dashboardId, dashboardShareMember, user);
	}
	
	public void deleteDashboardeShareUser(long dashboardId, String userId, Principal user)
	{
		dashboardComponent.deleteDashboardeShareUser(dashboardId, userId, user);
	}
	public List<Dashboard> getDashboards(String userId){
		List<Dashboard> dashboards = dashboardComponent.getDashboards(userId);
		return dashboards;
	}

    public List<Long> createDefaultDashboard(List<UsersVo> usersVo) {

		List<Dashboard> dashboards = dashboardComponent.getDashboards("DEFAULTDASHBOARD");
		if(dashboards.size()==0) return null;

		List<Long> dashboardIds = new ArrayList<>();

		for (int i = 0; i < usersVo.size(); i++) {

			for (int j = 0; j < dashboards.size(); j++) {
				Dashboard dashboard = new Dashboard();
				dashboard.setDashboardOrder(dashboards.get(j).getDashboardOrder());
				dashboard.setFavorite(dashboards.get(j).getFavorite());
				dashboard.setHome(dashboards.get(j).getHome());
				dashboard.setPredefined(dashboards.get(j).getPredefined());
				dashboard.setTitle(dashboards.get(j).getTitle());
				dashboard.setUserId(usersVo.get(i).getUserId());
				dashboard = dashboardComponent.create(dashboard,usersVo.get(i).getUserId());
				dashboardIds.add(dashboard.getDashboardId());
			}

		}
		return dashboardIds;

    }
}
