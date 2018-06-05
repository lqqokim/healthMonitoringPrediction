package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.DashboardMapper;
import com.bistel.a3.portal.dao.common.NotificationMapper;
import com.bistel.a3.portal.dao.common.WidgetMapper;
import com.bistel.a3.portal.domain.common.*;
import com.bistel.a3.portal.domain.usermgt.UsersVo;
import com.bistel.a3.portal.module.usermgt.UserMgtComponent;
import com.bistel.a3.portal.util.notification.NotificationObjectMaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 2016.11.xx 기존 common service의 비구조화를 개선하기 위해, 구조적으로 변경하기 위해 생성 
 * (기존 mapper -> controller)
 * (수정 mapper -> component -> service -> controller)
 * @author AlanMinjaePark
 */
@Component
public class DashboardComponent {
	
	@Autowired
	private WidgetMapper widgetMapper;

	@Autowired
	private DashboardMapper dashboardMapper;

	@Autowired
	private NotificationMapper notificationMapper;
	
	@Autowired
	private UserMgtComponent userMgtComponent;

	/**
	 * onlyMyDashboard 값에 따라 true면 내가 생성한 Dashboard만 false면 share된 Dashboard
	 * 포함해서 null이면 default값으로 내가 생성한 Dashboard만 나타나도록 함.
	 * ex)localhost:8080/portal/service/dashboards?onlyMyDashboard=true
	 */
	public List<Dashboard> gets(Principal user, String onlyMyDashboard) {

		List<Dashboard> dashboardList = null;
		if (onlyMyDashboard == null) {
			dashboardList = this.getDashboards(user.getName());
		} else {
			switch (onlyMyDashboard) {
			case "true":
				dashboardList = this.getDashboards(user.getName());
				break;
			case "false":
				dashboardList = this.getInculdeShareDashboards(user.getName());
				break;
			default:
				dashboardList = this.getDashboards(user.getName());
				break;
			}
		}
		return dashboardList;
	}

	public List<Dashboard> getInculdeShareDashboards(String userId) {
		return dashboardMapper.selectSharedListByUser(userId);
	}

	public List<Dashboard> getDashboards(String userId) {
		return dashboardMapper.selectByUser(userId);
	}


	public Dashboard get(Long dashboardId) {
		return dashboardMapper.selectMyDashboard(dashboardId);
	}

	/**
	 * 입력받은 Request로 dashboard 생성.
	 */
	@Transactional
	public Dashboard create(Dashboard dashboard, Principal user) {
		return this.create(dashboard,user.getName());
//		dashboard.setUserId(user.getName());
//		dashboard.setCreateDtts(new Date());
//		
//		if(dashboard.getHome() == null)
//		{
//			dashboard.setHome(false);
//		}
//		if(dashboard.getFavorite() == null)
//		{
//			dashboard.setFavorite(false);
//		}
//
//		if (dashboard.getDashboardOrder() == null) {
//			dashboard.setDashboardOrder(dashboardMapper.selectOrderByUser(dashboard.getUserId()));
//		} else {
//			dashboardMapper.updateOrder(dashboard);
//		}
//
//		dashboardMapper.insert(dashboard);
//		dashboardMapper.insertLinkData(dashboard);
//		return dashboardMapper.selectMyDashboard(dashboard.getDashboardId());
	}
	@Transactional
	public Dashboard create(Dashboard dashboard, String userId) {

		dashboard.setUserId(userId);
		dashboard.setCreateDtts(new Date());

		if(dashboard.getHome() == null)
		{
			dashboard.setHome(false);
		}
		if(dashboard.getFavorite() == null)
		{
			dashboard.setFavorite(false);
		}

		if (dashboard.getDashboardOrder() == null) {
			dashboard.setDashboardOrder(dashboardMapper.selectOrderByUser(dashboard.getUserId()));
		} else {
			dashboardMapper.updateOrder(dashboard);
		}

		dashboardMapper.insert(dashboard);
		dashboardMapper.insertLinkData(dashboard);
		return dashboardMapper.selectMyDashboard(dashboard.getDashboardId());
	}

	public List<User> selectSharedList(Principal user, Long dashboardId) {
		return dashboardMapper.selectSharedUsersByDashboardId(user.getName(), dashboardId);
	}

	/**
	 * 선택된 dashboardId를 통해 한명 또는 여러 유저에게 share 한다.
	 */
/*	
	@Transactional
	public void share(Long dashboardId, List<Dashboard> dashboardList, Principal user) {
		
		NotificationObjectMaker notificationObjectMaker = work NotificationObjectMaker();
		
		for (int index = 0; index < dashboardList.size(); index++) {
			dashboardList.get(index).setUserId(dashboardList.get(index).getUserId());
			dashboardList.get(index).setDashboardId(dashboardId);
			dashboardList.get(index).setFavorite(false);
			dashboardList.get(index).setHome(false);
			dashboardList.get(index).setCreateDtts(work Date());
			// dashboard.setUserId(user.getName());
			if (dashboardList.get(index).getDashboardOrder() == null) {
				dashboardList.get(index)
						.setDashboardOrder(dashboardMapper.selectOrderByUser(dashboardList.get(index).getUserId()));
			} else {
				dashboardMapper.updateOrder(dashboardList.get(index));
			}
			
			if (dashboardList.get(index).getDashboardOrder() == null) {
				dashboardList.get(index).setDashboardOrder(dashboardMapper.selectOrderByUser(dashboardList.get(index).getUserId()));
			} else {
				dashboardMapper.updateOrder(dashboardList.get(index));
			}
			// Link table에 Data 삽입.
			dashboardMapper.insertLinkData(dashboardList.get(index));
			// dashboardTitle 검색.

			// Notification 처리
			String dashboardTitle = this.getDashboardTitle(dashboardId);
			notificationMapper.insertNotification(
					notificationObjectMaker.makeDashboardShareCreateNotification(dashboardId, 
							   dashboardTitle,  user.getName(), user.getName(), dashboardList.get(index).getUserId()));
		}
		// return dashboardMapper.select(dashboardId);
	}
*/
	@Transactional
	public Dashboard set(Long dashboardId, Dashboard dashboard, Principal user) {
		dashboard.setUserId(user.getName());
		dashboard.setDashboardId(dashboardId);
		if (dashboard.getDashboardOrder() != null) {
			dashboardMapper.updateOrderMySelf(dashboard);
			dashboardMapper.updateOrderOther(dashboard);
		}
		
		if(dashboard.getHome() == null)
		{
			dashboard.setHome(false);
		}
		if(dashboard.getFavorite() == null)
		{
			dashboard.setFavorite(false);
		}
		dashboardMapper.update(dashboard);

		return dashboardMapper.selectMyDashboard(dashboardId);
	}

	/**
	 * 특정 user에게만 Share된 dashboard를 삭제한다.
	 */
	@Transactional
	public void removeShare(Long dashboardId, String userId, Principal user) {

		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		
		dashboardMapper.deleteLinkData(dashboardId, userId);
		
		// Notification 처리
		String dashboardTitle = this.getDashboardTitle(dashboardId);
	
		notificationMapper.insertNotification(notificationObjectMaker.makeDashboardShareDeletedNotification(dashboardId, 
				   dashboardTitle, user.getName(), user.getName(), userId));
	}
	
	/**
	 * dashboard delete.
	 * 1. 내가 만든 것인지 share 받은 것이지 확인
	 * 2. 내가 만든 dashboard 일 경우 
	 * 	 2.1 dashboard와 관련된 widget, link 정보들을 모두 삭제한다.
	 *   2.2 dashboard를 share 해 준 user가 있다면 share 관계를 모두 삭제한다.
	 *     2.2.1 share 해 준 user들에게 Notification을 전달한다. 
	 * 3. Share 받은 dashboard일 경우 share 관계만 삭제한다.
     *   3.1 share 해 준 user에게 Notification을 전달한다.
	 */
	@Transactional
	public void remove(Long dashboardId, Principal user) {

		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		
		String userId = user.getName();
		String dashboardOwnerUserId = dashboardMapper.selectDashboardOwnerUserId(dashboardId);
		String dashboardTitle = this.getDashboardTitle(dashboardId); // dashboardTitle가져옴.
		
		// 자신이 만든 dashboard 일 경우
		if (userId.equals(dashboardOwnerUserId)) {
			// share 해준 user list를 검색한다.
			List<String> dashboardShareUserList = dashboardMapper.selectShareDashboardUserList(dashboardOwnerUserId, dashboardId);
		
			// share & dashboard 정보 삭제
			dashboardMapper.deleteLinkDataByDashboardId(dashboardId); // user_dashboard_lnk_a3에서
			dashboardMapper.deleteUserGroupDashboardShareByDashboardId(dashboardId); // group share 삭제
			widgetMapper.deleteByDashboardId(dashboardId);
			dashboardMapper.deleteById(dashboardId); // dashboard_a3 table에서 삭제.
			
			// Share 해준 User가 존재하는 경우 Notification 전송
			if (dashboardShareUserList != null && dashboardShareUserList.size() > 0) {
				
				for (String shareUserId :dashboardShareUserList) {
					notificationMapper.insertNotification(notificationObjectMaker.makeDashboardDeleteNotification(dashboardId, 
						   dashboardTitle, dashboardOwnerUserId, userId, shareUserId));
				}
			}
			
		}
		// share 받은 dashboard인 경우
		else {
			
			List<String> shareGroupUserList = dashboardMapper.selectDashboardShareGroupUserListWithoutMyId(userId, dashboardId);
			
			// group_share에 해당하는 dashboard인지 확인하고 group_share 일 경우 share 하고 있는 유저가 남아 있는지 확인
			// 없을 경우 group share 정보도 삭제한다.
			if (shareGroupUserList == null || shareGroupUserList.size() == 0) {
				String groupId = dashboardMapper.selectGroupIdByUser(userId);
				dashboardMapper.deleteDashboardShareMembersGroup(dashboardId, groupId);
				
			}
			
			dashboardMapper.deleteMyLinkDataByDashboardId(dashboardId, userId);
			
			notificationMapper.insertNotification(notificationObjectMaker.makeDashboardShareDeleteNotification(dashboardId, 
					   dashboardTitle, dashboardOwnerUserId, user.getName(), dashboardOwnerUserId));		
		}
		
	}


	/**
	 * Alan 리팩토링이 필요해 보임 
	 * @param dashboard
	 * @param user
	 */
	@Transactional
	public void set(Dashboard dashboard, Principal user) {
		dashboardMapper.updateHomeAll(false, user.getName());
		dashboard.setHome(true);
		dashboardMapper.update(dashboard);
		dashboardMapper.updateHome(dashboard); 
	}

	@Transactional
	public void setHome(long dashboardId, Principal user)
	{
		dashboardMapper.updateHomeAll(false, user.getName());
		dashboardMapper.setHome(dashboardId, user.getName());
	}
	/**
	 * dashboardId를 받아 Title을 return
	 */
	private String getDashboardTitle(long dashboardId) {
		return dashboardMapper.selectDashboardTitle(dashboardId);
	}
		
	/**
	 * added group concepts
	 */
	
	public List<DashboardShareUserGroup> selectUserGroupDashboardShare(Long dashboardId){
		return dashboardMapper.selectUserGroupDashboardShare(dashboardId);
	}
	
	//dashboard를 share할때, 
	//group share에 값을 넣고,
	//각 그룹의 user에게도 share 정보를 입력한다.
	@Transactional
	public void insertUserGroupDashboardShare(long dashboardId, List<UserGroupDashboardShare> userGroupDashboardShare){
				
		for (int i=0; i<userGroupDashboardShare.size(); i++)
		{
			UserGroupDashboardShare localUserGroupDashboardShare = new UserGroupDashboardShare();
			localUserGroupDashboardShare.setDashboardId(dashboardId);
			localUserGroupDashboardShare.setGroupId(userGroupDashboardShare.get(i).getGroupId());
			dashboardMapper.insertUserGroupDashboardShare(localUserGroupDashboardShare);
			
			String groupId = userGroupDashboardShare.get(i).getGroupId();
			
			List<String> userIds = dashboardMapper.selectUserIdListByGroup(groupId);			

			for(int j=0;j<userIds.size();j++)
			{
				UserDashboardLnk userDashboardLnk = new UserDashboardLnk();
				userDashboardLnk.setDashboardId(dashboardId);
				userDashboardLnk.setUserId(userIds.get(j));
				dashboardMapper.insertUserDashboardLnk(userDashboardLnk);
			}
		}
	}
	

	@Transactional
	public void deleteUserGroupDashboardShare(long dashboardId, List<UserGroupDashboardShare> userGroupDashboardShare){
		for (int i=0; i<userGroupDashboardShare.size(); i++)
		{
			UserGroupDashboardShare localUserGroupDashboardShare = new UserGroupDashboardShare();
			localUserGroupDashboardShare.setDashboardId(dashboardId);
			localUserGroupDashboardShare.setGroupId(userGroupDashboardShare.get(i).getGroupId());
			dashboardMapper.deleteUserGroupDashboardShare(localUserGroupDashboardShare);
		}
	}
	
	/*
	 * user의 dashboardshare 정보를 삭제한다.
	 * 1. user_dashboard_lnk의 정보를 삭제한다.
	 * 2. user와 관련된 group 정보(groupId)를 가져온다.
	 * 3. group 정보(groupId)로 해당 그룹의 user 정보를 가져온다. 
	 * 4. 가져온 user정보와 dashboard 관계가 있는지를 확인한다.
	 * 4.1 다른 user와 dashboard의 관계가 있다면, user_group_dashboard_share 정보를 그대로 둔다.
	 * 4.1 다른 user와 dashboard의 관계가 없다면, (관련 user의 size가 0), 해당 user_group_dashboard_share 정보 삭제한다.
	 * */	
	@Transactional
	public void deleteUserDashboardLnk(long dashboardId, List<UserDashboardLnk> userDashboardLnk)
	{
		for(int i=0;i<userDashboardLnk.size();i++)
		{
			//user의 dashboardlnk정보를 삭제한다.
			UserDashboardLnk localUserDashboardLnk = new UserDashboardLnk();
			String userId = userDashboardLnk.get(i).getUserId();
			localUserDashboardLnk.setDashboardId(dashboardId);
			localUserDashboardLnk.setUserId(userId);
			dashboardMapper.deleteUserDashboardLnk(localUserDashboardLnk);
			//user와 관련된 group 정보를 가져온다.
			String groupId = dashboardMapper.selectGroupIdByUser(userId); //현재 구조상은 1개의 그룹이지만, 나중에 정책이 바뀔 수 있어도 대응 가능하도록 일단 이렇게 짜 놓음.
			if (groupId != null && !groupId.equals(""))
			{
				List<String> inuserIds = dashboardMapper.selectUserIdListByGroup(groupId);
				inuserIds.remove(userId); //현재 userId는 제외 
				if(inuserIds.size()>0)
				{
					continue;
				}
				else
				{
					UserGroupDashboardShare localUserGroupDashboardShare = new UserGroupDashboardShare();
					localUserGroupDashboardShare.setDashboardId(dashboardId);
					localUserGroupDashboardShare.setGroupId(groupId);
					dashboardMapper.deleteUserGroupDashboardShare(localUserGroupDashboardShare);
				}
			}
		}
	}
	
	
	//@20161226 user, group ->integrated as member
	@Transactional
	public List<DashboardShareMember>  selectShareDashboardMember(long dashboardId, Principal user)
	{
		
		String userId = user.getName();
		List<DashboardShareMember> dashboardShareMemberList = new ArrayList<DashboardShareMember>();
		
		List<DashboardShareMember> groupDashboardShareMemberList = dashboardMapper.selectShareDashboardMemberGroup(dashboardId, userId);
		List<String> groupListForExclude = new ArrayList<String>();
		
		for(int i=0;i<groupDashboardShareMemberList.size();i++)
		{
			//group인경우, 
			String groupId = groupDashboardShareMemberList.get(i).getId();
			List<DashboardShareMemberGroupUser> groupUsers = dashboardMapper.selectUserImgByGroup(groupId);
			groupDashboardShareMemberList.get(i).setGroupUsers(groupUsers);
			groupListForExclude.add(groupId);
		}
		
		
		//::임시용 지울 것 (추후에 로직 확인 및 정리) 
		if(groupListForExclude != null)
		{
			if(groupListForExclude.size() == 0)
			{
				groupListForExclude = null;
			}		
		}

		List<DashboardShareMember> userDashboardShareMemberList = dashboardMapper.selectShareDashboardMemberUser(dashboardId, userId, groupListForExclude);

		dashboardShareMemberList.addAll(groupDashboardShareMemberList);						
		dashboardShareMemberList.addAll(userDashboardShareMemberList);
		return dashboardShareMemberList;			
	}
	
	/**
	 * groups / users에 dashboard를 share 한다.
	 * @param dashboardId
	 * @param dashboardShareMember
	 * @param user
	 * @return 이미 신청된 User에 대해 다시 share 할 경우 already message를 전송
	 */
	@Transactional
	public String insertDashboardShareMembers(long dashboardId, List<DashboardShareMember> dashboardShareMember, Principal user)
	{
		StringBuffer resultString = new StringBuffer();
		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		
		//dashboard Title
		String dashboardTitle = this.getDashboardTitle(dashboardId); // dashboardTitle가져옴.
		
		String shareRequestId = "";
		String idType = "";
		String userId = user.getName();
		
		for(int i=0; i < dashboardShareMember.size(); i++)
		{
			shareRequestId = dashboardShareMember.get(i).getId();
			idType = dashboardShareMember.get(i).getType();
			
			if(idType.equals("group"))
			{
				//group인 경우, group 추가 후, 각 group에 대한 user 정보 또한 추가한다.
				//user인 경우 user 정보만 추가한다.
				
				//if(group이 있는가?)
				Integer countForExtGroup = dashboardMapper.selectCountDashboardShareMembersGroup(dashboardId, shareRequestId);
				if(countForExtGroup > 0)
				{
					resultString.append( dashboardId + " is already assigned to " + dashboardShareMember.get(i).getId() + ".\n");
				}
				else
				{
					dashboardMapper.insertDashboardShareMembersGroup(dashboardId, shareRequestId);					
				}

				//userId 추출
				List<String> groupUserList = dashboardMapper.selectUserIdListByGroup(shareRequestId);
				for(String groupUserId : groupUserList)
				{
//					DashboardShareMember localDashboardShareMember = work DashboardShareMember();
//					localDashboardShareMember.setId(groupUserId);

					//if(user가 등록되어 있는가?) 없다면 등록
					Integer countForExtUser = dashboardMapper.selectCountDashboardShareMembersUser(dashboardId, groupUserId);
					if(countForExtUser>0)
					{
						resultString.append( dashboardId + " is already assigned to " + groupUserId + ".\n");
					}
					else
					{
						dashboardMapper.insertDashboardShareMembersUser(dashboardId, groupUserId, Boolean.FALSE, Boolean.FALSE);

						/*Notification*/
						notificationMapper.insertNotification(notificationObjectMaker.makeDashboardShareCreateNotification(
								     dashboardId, dashboardTitle, userId, userId, groupUserId));
						
					}
				}
			}
			else if(idType.equals("user"))
			{
				Integer countForExtUser = dashboardMapper.selectCountDashboardShareMembersUser(dashboardId, shareRequestId);
				if(countForExtUser > 0)
				{
					resultString.append( dashboardId + " is already assigned to " + shareRequestId + ".\n");
				}
				else{
					dashboardMapper.insertDashboardShareMembersUser(dashboardId, shareRequestId, Boolean.FALSE, Boolean.FALSE);
					
					/*Notification*/
					notificationMapper.insertNotification(notificationObjectMaker.makeDashboardShareCreateNotification(
							     dashboardId, dashboardTitle, userId, userId, shareRequestId));
				}				
			}
		}
		return resultString.toString();
	}
	
	/**
	 * Group share 해지일 경우 : 
	 *   - USER_GROUP_DASHBOARD_SHARE_A3 테이블에서 해당 GROUP_ID 삭제
	 *   - USER_DASHBOARD_LNK_A3 테이블에서  GROUP_ID에 속하는 USER_ID 들을 삭제
	 *   - 해당 GROUP Member 모두에게 Notification 발송
	 * USER SHARE 해지일 경우 
	 * 	- USER_DASHBOARD_LNK_A3 테이블에서   USER_ID 들을 삭제
	 *  - 해당 User에게 Notification 발송
	 * @param //workspaceId
	 * @param //workspaceShareMember
	 * @param user
	 */
	@Transactional
	public void deleteDashboardShareMembers(long dashboardId, List<DashboardShareMember> dashboardShareMemberList, Principal user)
	{
		
		String deleteRequestId = "";
		String type = "";
		List<String> deleteUserList = new ArrayList<String>();
		List<String> deleteGroupList = new ArrayList<String>();
		List<UsersVo> userVoList = null;
		List<String> shareGroupUserList = null;
		
		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		String userId = user.getName();
		String dashboardTitle = this.getDashboardTitle(dashboardId); // dashboardTitle가져옴.
		
		// 삭제 대상이 group 일 경우 group의 모든 user list를 검색해서 하나의 delete user list를 만든다.
		// share group 일 경우 group user list가 share user table에 입력되어 있음.
		for(int i = 0; i < dashboardShareMemberList.size(); i++) {
			
			deleteRequestId = dashboardShareMemberList.get(i).getId();
			type = dashboardShareMemberList.get(i).getType();
			
			if (type.toLowerCase().equals("group")) {
				
				// get user list
				userVoList =  userMgtComponent.selectGroupUsers(deleteRequestId);
				for (int k=0; k < userVoList.size(); k++) {
					if (userVoList.get(k).getUserId().equals(user.getName())) continue;
					
					deleteUserList.add(userVoList.get(k).getUserId());
				}
				deleteGroupList.add(deleteRequestId);
			} else 
			if (type.toLowerCase().equals("user")) {
				deleteUserList.add(deleteRequestId);
				shareGroupUserList = dashboardMapper.selectDashboardShareGroupUserListWithoutMyId(deleteRequestId, dashboardId);
			
				if (shareGroupUserList == null || shareGroupUserList.size() == 0) {
					String groupId =  dashboardMapper.selectGroupIdByUser(deleteRequestId); 
					deleteGroupList.add(groupId);
				}
			}
		}
		
		for (String deleteUserId : deleteUserList) {
			// owner id일 경우 삭제하지 않는다.
			if (deleteUserId.equals(userId)) continue;
			
			dashboardMapper.deleteDashboardShareMembersUser(dashboardId, deleteUserId);
			
			// Notification
			notificationMapper.insertNotification(notificationObjectMaker.makeDashboardShareDeletedNotification(dashboardId, 
					dashboardTitle, userId, userId,  deleteUserId));
		}
		
		for (String deleteGroupId : deleteGroupList) {
			//그룹인 경우, 그룹 정보만 삭제
			dashboardMapper.deleteDashboardShareMembersGroup(dashboardId, deleteGroupId);					
		}
	}
	
	@Transactional
	public void deleteDashboardeShareUser(long dashboardId, String userId, Principal user) {

		NotificationObjectMaker notificationObjectMaker = new NotificationObjectMaker();
		String dashboardTitle = this.getDashboardTitle(dashboardId);
		
		// 해당 user 정보를 그룹 정보를 가져와서 (쉐어하고 있는 )
		// 한개라도 있다면, group정보를 그대로 두고,
		// 없다면 group share 정보를 지운다.
		dashboardMapper.deleteDashboardShareMembersUser(dashboardId, userId);

		
		List<String> shareGroupUserList = dashboardMapper.selectDashboardShareGroupUserListWithoutMyId(userId, dashboardId);
		
		if (shareGroupUserList == null || shareGroupUserList.size() == 0) {
			String groupId = dashboardMapper.selectGroupIdByUser(userId); // 실제로는 그룹 1개 값 리턴
			dashboardMapper.deleteDashboardShareMembersGroup(dashboardId, groupId);
		}
		
		
		/*Notification*/
		notificationMapper.insertNotification(notificationObjectMaker.makeDashboardShareDeletedNotification(dashboardId, 
				dashboardTitle, user.getName(), user.getName(), userId));
	}	
}
