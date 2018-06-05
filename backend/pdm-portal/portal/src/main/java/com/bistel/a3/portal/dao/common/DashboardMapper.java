package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.*;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 10. 29.
 */
public interface DashboardMapper {
	List<Dashboard> selectByUser(@Param("userId") String userId);

	List<Dashboard> selectSharedListByUser(@Param("userId") String userId);

//	Dashboard select(@Param("dashboardId") Long dashboardId);
	Dashboard selectMyDashboard(@Param("dashboardId") Long dashboardId);
	
	List<User> selectSharedUsersByDashboardId(@Param("userId") String userId, @Param("dashboardId") Long dashboardId);

	void insert(Dashboard dashboard);

	void insertLinkData(Dashboard dashboard);

	void update(Dashboard dashboard);
	
	void updateHome(Dashboard dashboard);
	
	void updateOrder(Dashboard dashboard);

	void updateOrderMySelf(Dashboard dashboard);
	
	void updateOrderOther(Dashboard dashboard);
	
	void deleteLinkData(@Param("dashboardId") Long dashboardId, @Param("userId") String userId);

	void deleteById(@Param("dashboardId") Long dashboardId);

	void deleteLinkDataByDashboardId(@Param("dashboardId") Long dashboardId);
	
	void deleteMyLinkDataByDashboardId(@Param("dashboardId") Long dashboardId, @Param("userId") String userId);
	
	void deleteUserGroupDashboardShareByDashboardId(@Param("dashboardId") Long dashboardId);

	void updateHomeAll(@Param("home") Boolean home, @Param("userId") String userId);
	void setHome(@Param("dashboardId") Long dashboardId, @Param("userId") String userId);	
	
	Integer selectOrderByUser(String userId);

	String selectDashboardTitle(@Param("dashboardId") Long dashboardId);
	
	String selectDashboardOwnerUserId(@Param("dashboardId") Long dashboardId);
	
	List<String> selectShareDashboardUserList(@Param("userId") String userId, @Param("dashboardId") Long dashboardId);
	//자신이 share한 dashboardList
	//List<Dashboard> selectShareDashboardIdList(@Param("userId") String userId);
	//자신이 share받은 dashboardList
	//List<Dashboard> selectReceiveSharedDashboardList(@Param("userId") String userId);
	//share에 연관없는 dashboardList
	//List<Dashboard> selectNotsharedDashbaordList(@Param("userId") String userId);

	List<Dashboard> selectAllUserByWorkspaceId(@Param("userId") String userId, @Param("dashboardId") Long dashboardId);
	
	List<String> selectDashboardShareGroupUserListWithoutMyId(@Param("userId") String userId, @Param("dashboardId") Long dashboardId);
	
	//added
	List<DashboardShareUserGroup> selectUserGroupDashboardShare(@Param("dashboardId") Long dashboardId);
	void insertUserGroupDashboardShare(UserGroupDashboardShare userGroupDashboardShare);
	void deleteUserGroupDashboardShare(UserGroupDashboardShare userGroupDashboardShare);
	List<String> selectUserIdListByGroup(String groupId);
	void insertUserDashboardLnk(UserDashboardLnk userDashboardLnk);
	String selectGroupIdByUser(String userId);
	
	void deleteUserDashboardLnk(UserDashboardLnk userDashboardLnk);
	
	
	//@20161226 user, group ->integrated as member
	List<DashboardShareMember> selectShareDashboardMemberUser(@Param("dashboardId") Long dashboardId, @Param("userId") String userId, @Param("groupListForExclude") List<String> groupListForExclude);
	List<DashboardShareMember> selectShareDashboardMemberGroup(@Param("dashboardId") Long dashboardId, @Param("userId") String userId);
	List<DashboardShareMemberGroupUser> selectUserImgByGroup(@Param("groupId") String groupId);	
	void insertDashboardShareMembersGroup(@Param("dashboardId") long dashboardId, @Param("id") String id);
	void insertDashboardShareMembersUser(@Param("dashboardId") long dashboardId, @Param("id") String id, @Param("favorite") Boolean favorite, @Param("home") Boolean home);
    void deleteDashboardShareMembersGroup(@Param("dashboardId") long dashboardId, @Param("id") String id);
    void deleteDashboardShareMembersUser(@Param("dashboardId") long dashboardId, @Param("id") String id);
    Integer selectCountDashboardShareMembersGroup(@Param("dashboardId") long dashboardId, @Param("id") String id);
    Integer selectCountDashboardShareMembersUser(@Param("dashboardId") long dashboardId, @Param("id") String id);		
}