package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.usermgt.*;
import com.bistel.a3.portal.module.usermgt.UserMgtComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Service
public class UserMgtService {
	
	@Autowired
	private UserMgtComponent userMgtComponent;

	public List<UsersVo> selectUserList(){
		return userMgtComponent.selectUserList();
	}
	public List<String> selectUserAuthorityList(String userId){
		return userMgtComponent.selectUserAuthorityList(userId);
	}
	
	public UsersVo selectUser(String userId){
		return userMgtComponent.selectUser(userId);
	}	
	
	
    public List<UsersVo> selectGroupUsers(String groupId){
        return userMgtComponent.selectGroupUsers(groupId);
    }
    
    public List<String> selectGroupUserIds(String groupId) {
    	return userMgtComponent.selectGroupUserIds(groupId);
    }
    
	public void insertUsers(List<UsersVo> usersVo)
	{
		userMgtComponent.insertUsers(usersVo);
	}
		
	public void updateUser(UsersVo usersVo)
	{
		userMgtComponent.updateUser(usersVo);
	}
	
    public void updateUserProfile(UsersVo usersVo)
    {
    	userMgtComponent.updateUserProfile(usersVo);
    }

	public void deleteUsers(List<String> userId)
	{
		userMgtComponent.deleteUsers(userId);
	}
	
	//
	public List<GroupsVo> selectGroupList()
	{
		return userMgtComponent.selectGroupList();
	}
	
	public GroupsVo selectGroup(String groupId)
	{
		return userMgtComponent.selectGroup(groupId);
	}
	
	public void insertGroups(List<GroupsVo> groupsVo)
	{
		userMgtComponent.insertGroups(groupsVo);
	}
	
	public void updateGroup(GroupsVo groupsVo)
	{
		userMgtComponent.updateGroup(groupsVo);
	}
		
	public List<ResultMessageVo> deleteGroups(List<String> groupId)
	{
		return userMgtComponent.deleteGroups(groupId);
	}
	
	//
	
	public List<RolesVo> selectRolesList()
	{
		return userMgtComponent.selectRolesList();
	}
	
	public List<RoleVo> selectRoles(String roleId)
	{
		return userMgtComponent.selectRoles(roleId);
	}
	
	public void insertRoles(List<RoleVo> roleVo) throws Exception
	{
		userMgtComponent.insertRoles(roleVo);
	}
	
	public void updateRole(RoleVo roleVo) throws Exception
	{
		userMgtComponent.updateRole(roleVo);
	}
	
	public List<ResultMessageVo> deleteRoles(List<String> roleId)
	{
		return userMgtComponent.deleteRoles(roleId);
	}
	
	public RoleObjectVo selectRoleObjectList(String roleId)
	{
		return userMgtComponent.selectRoleObjectList(roleId);
	}
	
	public RoleObjectVo selectRoleObjectListIncludeChild(String roleId)
	{
		return userMgtComponent.selectRoleObjectListIncludeChild(roleId);
	}
	
	public List<PermissionVo> selectPermissionList()
	{
		return userMgtComponent.selectPermissionList();
	}
	
	public void insertObjectList(List<PermissionVo> permissionVos) throws Exception
	{
		userMgtComponent.insertObjectList(permissionVos);
	}
	
	public void updateObject(PermissionVo permissionVo) throws Exception
	{
		userMgtComponent.updateObject(permissionVo);
	}
	
	public void deleteObjectById(String objectId)
	{
		userMgtComponent.deleteObjectById(objectId);
	}
	
    public void uploadImage(String userId, MultipartFile uploadFile, HttpServletRequest request) throws IllegalStateException, IOException{
    	userMgtComponent.uploadImage(userId, uploadFile, request);
    }
    
    public void downloadImage(String userId, HttpServletResponse response) throws IOException{
    	userMgtComponent.downloadImage(userId, response);
    }
    
    public UserImage selectImageByUser(String userId){
    	return userMgtComponent.selectImageByUser(userId);
    }
	
    public String selectGroupIdByUserId(String userId) {
    	return userMgtComponent.selectGroupIdByUserId(userId);
    }
}