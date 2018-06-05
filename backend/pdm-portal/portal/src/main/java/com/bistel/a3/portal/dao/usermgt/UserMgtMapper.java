package com.bistel.a3.portal.dao.usermgt;

import com.bistel.a3.portal.domain.usermgt.*;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * GET(SELECT)/POST(INSERT)/PUT(UPDATE)/DELETE 
 * @author AlanMinjaePark
 *
 */
public interface UserMgtMapper {
	//1.users
	
	public List<UsersVo> selectUserList();
	public List<String> selectUserAuthorityList(String userId);
	public UsersVo selectUser(String userId);
	public List<UsersVo> selectGroupUsers(@Param("groupId") String groupId);
	public void insertUser(UsersVo usersVo);
	public void insertUserGroupLnk(UsersVo usersVo);
	public void updateUser(UsersVo usersVo);
	public void deleteUserGroupLnk(String userId);
	public void deleteUser(String userId);
	
	//2.groups
	public List<GroupsVo> selectGroupList();
	public GroupsVo selectGroup(String groupId);
	public void insertGroup(GroupsVo groupsVo);
	public void insertGroupRoleLnk(GroupRoleLnk groupRoleLnk);
	public void updateGroup(GroupsVo groupsVo);
	public void deleteGroupRoleLnk(String groupId);	
	public void deleteGroup(String groupId);
	public List<String> selectUsersByGroupId(@Param("groupId") String groupId);
	public List<String> selectGroupsByRoleId(@Param("roleId") String roleId);	
	public String selectGroupIdByUserId(@Param("userId") String userId);
	
	//3.roles
	public List<RolesVo> selectRolesList();
	public List<RoleVo> selectRoles(String roleId);
	public RoleObjectVo selectRoleObjectList(String roleId);
	public RoleObjectVo selectRoleObjectListIncludeChild(String roleId);
	public List<String> selectOperationNameListByObjectId(String objectId);
	public List<ActionExtVo> selectActionExtListByObjectId(String objectId);	
	public void insertRole(RoleVo roleVo);
	public void insertRoleTreePaths(RoleTreePaths roleTreePath);
	public void insertPermission(RoleObjectOperationLnk roleObjectOperationLnk);
	public void updateRole(RoleVo roleVo);
	public void deleteRoleTreePath(String ancestor);
	public void deletePermission(String roleId);
	public void deleteRole(String roleId);
		
	//4.permissions
	public List<PermissionVo> selectPermissionList();
	public List<ObjectOperationVo> selectOperationList(String objectId);

	//#object
	//#operation
	//#user-ext(profile)
	public String checkCirculaReference(RoleTreePaths roleTreePath);
	
	public void insertObject(PermissionVo permissionVo);
	public String selectCurrObjectId();
	public void insertObjectOperation(ObjectOperationVo objectOperationVo);
	public String selectCurrObjectOperationId();
	public void insertObjectOperationLnk(ObjectOperationLnk objectOperationLnk);
	
	//
	public List<String> selectObjectName();
	public List<String> selectOperationName();
	
	//
	public List<String> selectExtOperationIdsByObjectId(String objectId);
	public void deleteObjectOperationLnk(ObjectOperationLnk objectOperationLnk);
	public void deleteExtOperationById(String operationId);
	public void deleteObjectById(String objectId);
	//
	public void  updateObject(PermissionVo permissionVo); //
	
	// image
	public void insertImage(UserImage userImage);
	public UserImage selectImageByUser(@Param("userId") String userId);
	public void updateProfileImageUrl(@Param("userId") String userId, @Param("userImageUrl")String userImageUrl);
	public void updateStoredImageUrl(UserImage userImage);
	
}
