package com.bistel.a3.portal.module.usermgt;

import com.bistel.a3.portal.dao.usermgt.UserMgtMapper;
import com.bistel.a3.portal.domain.usermgt.*;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class UserMgtComponent {

	@Autowired
	private UserMgtMapper userMgtMapper;

	//1. users
	public List<UsersVo> selectUserList(){
		
    	List<UsersVo> users = userMgtMapper.selectUserList();
    	for(int i=0; i<users.size(); i++)
    	{
    		if(users.get(i).getPassword() == null)
    			continue;
    		String encodedPassword = users.get(i).getPassword();
    		byte[] decoded = Base64.decodeBase64(encodedPassword);
    		String decodedPassword = new String(decoded);
    		users.get(i).setPassword(decodedPassword);	
    	}
        return users;
        
	}
	public List<String> selectUserAuthorityList(String userId){		
		return userMgtMapper.selectUserAuthorityList(userId);
	}
	
	
	public UsersVo selectUser(String userId){		
		UsersVo user = userMgtMapper.selectUser(userId);
		if(user.getPassword() != null)
		{
			String encodedPassword = user.getPassword();
			byte[] decoded = Base64.decodeBase64(encodedPassword);
			String decodedPassword = new String(decoded);
			user.setPassword(decodedPassword);				
		}
        return user;        
	}
	
    public List<UsersVo> selectGroupUsers(String groupId){
    	List<UsersVo> users = userMgtMapper.selectGroupUsers(groupId);
    	for(int i=0; i<users.size(); i++)
    	{    
    		if(users.get(i).getPassword() == null)
    			continue;
    		
    		String encodedPassword = users.get(i).getPassword();
    		byte[] decoded = Base64.decodeBase64(encodedPassword);
    		String decodedPassword = new String(decoded);
    		users.get(i).setPassword(decodedPassword);	
    	}
    	return users;
    }
	
    public List<String> selectGroupUserIds(String groupId){
    	List<String> userIds = userMgtMapper.selectUsersByGroupId(groupId);
    	return userIds;
    }
    
	@Transactional
	public void insertUsers(List<UsersVo> usersVo){
		for(int i=0 ;  i<usersVo.size(); i++)
		{
			String orgPassword = usersVo.get(i).getPassword();
			if(usersVo.get(i).getPassword() == null)
			{
				usersVo.get(i).setPassword("1");
			}
			byte[] encodedPassword = Base64.encodeBase64(orgPassword.getBytes());
			usersVo.get(i).setPassword(new String(encodedPassword));
			if(usersVo.get(i).getGroupId() == null)
			{
				usersVo.get(i).setGroupId("Guest");
			}
			userMgtMapper.insertUser(usersVo.get(i));
			userMgtMapper.insertUserGroupLnk(usersVo.get(i));
		}
	}

	@Transactional
	public void updateUser(UsersVo usersVo)
	{			
		if(usersVo.getPassword() == null)
		{
			usersVo.setPassword("1");
		}
		String orgPassword = usersVo.getPassword();
		byte[] encodedPassword = Base64.encodeBase64(orgPassword.getBytes());
		usersVo.setPassword(new String(encodedPassword));
		if(usersVo.getGroupId() == null)
		{
			usersVo.setGroupId("Guest");
		}
		userMgtMapper.updateUser(usersVo);
		userMgtMapper.deleteUserGroupLnk(usersVo.getUserId());
		userMgtMapper.insertUserGroupLnk(usersVo);
	} 
	
	/**
	 * update userprofile 
	 * user 정보만 변경하도록 함
	 * 기존 user 정보는 update할 시 group까지 갱신(삭제 및 다시입력)하도록 되어 있음.
	 * @param usersVo
	 */
	public void updateUserProfile(UsersVo usersVo)
	{
		String orgPassword = usersVo.getPassword();
		byte[] encodedPassword = Base64.encodeBase64(orgPassword.getBytes());
		usersVo.setPassword(new String(encodedPassword));		
		userMgtMapper.updateUser(usersVo);
	}
	
	@Transactional
	public void deleteUsers(List<String> userId)
	{
		for(int i=0; i<userId.size(); i++)
		{
			userMgtMapper.deleteUserGroupLnk(userId.get(i));
			userMgtMapper.deleteUser(userId.get(i));			
		}
	}

	//2. groups
	public List<GroupsVo> selectGroupList()
	{
		return userMgtMapper.selectGroupList();
	}
	
	public GroupsVo selectGroup(String groupId)
	{
		return userMgtMapper.selectGroup(groupId);
	}
	
	@Transactional
	public void insertGroups(List<GroupsVo> groupsVo){
		for(int i=0 ;  i<groupsVo.size(); i++)
		{
			userMgtMapper.insertGroup(groupsVo.get(i));
			
			List<GroupRolesVo> roles = groupsVo.get(i).getRole();
			for(int j=0; j<roles.size(); j++)
			{
				GroupRoleLnk grl = new GroupRoleLnk();
				grl.setCondition(roles.get(j).getCondition());
				grl.setRoleId(roles.get(j).getRoleId());
				grl.setGroupId(groupsVo.get(i).getGroupId());				
				userMgtMapper.insertGroupRoleLnk(grl);
			}
		}
	}
	
	@Transactional
	public void updateGroup(GroupsVo groupsVo)
	{
		userMgtMapper.updateGroup(groupsVo);
		userMgtMapper.deleteGroupRoleLnk(groupsVo.getGroupId());		
		List<GroupRolesVo> roles = groupsVo.getRole();
		for(int i=0; i<roles.size(); i++)
		{
			GroupRoleLnk grl = new GroupRoleLnk();
			grl.setCondition(roles.get(i).getCondition());
			grl.setRoleId(roles.get(i).getRoleId());
			grl.setGroupId(groupsVo.getGroupId());				
			userMgtMapper.insertGroupRoleLnk(grl);
		}
	} 
	
	@Transactional
	public List<ResultMessageVo> deleteGroups(List<String> groupId)
	{
		List<ResultMessageVo> resultMessageVoList = new ArrayList<ResultMessageVo>();
		
		for(int i=0; i< groupId.size(); i++)
		{
			ResultMessageVo resultMessageVo = new ResultMessageVo();
			List<String> assignedUsers= userMgtMapper.selectUsersByGroupId(groupId.get(i));
			if(assignedUsers.size()>0)
			{
				String users = "";
				for(int j=0;j<assignedUsers.size();j++)
				{
					users = users + assignedUsers.get(j) + ", ";
				}
				resultMessageVo.setFunction("delete");
				resultMessageVo.setType("group");
				resultMessageVo.setId(groupId.get(i));
				resultMessageVo.setResultFlag(false);
				String resultMessage = groupId.get(i) + " is assigned "+ users +" so it is not able to delete.";
				resultMessageVo.setResultMessage(resultMessage);
			}
			else
			{
				userMgtMapper.deleteGroupRoleLnk(groupId.get(i));
				userMgtMapper.deleteGroup(groupId.get(i));				
				resultMessageVo.setFunction("delete");
				resultMessageVo.setType("group");
				resultMessageVo.setId(groupId.get(i));
				resultMessageVo.setResultFlag(true);
				String resultMessage = groupId.get(i) + " is deleted.";
				resultMessageVo.setResultMessage(resultMessage);
				
			}
			resultMessageVoList.add(resultMessageVo);
		}
		
		return resultMessageVoList;
	}
	
	//3. roles
	public List<RolesVo> selectRolesList()
	{
		return userMgtMapper.selectRolesList();
	}
	
	public List<RoleVo> selectRoles(String roleId)
	{
		return userMgtMapper.selectRoles(roleId);
	}
		
	@Transactional
	public void insertRoles(List<RoleVo> roleVo) throws Exception
	{
		for(int i=0; i<roleVo.size(); i++)
		{
			userMgtMapper.insertRole(roleVo.get(i));
			List<String> childRole = roleVo.get(i).getChildRole();
			
			RoleTreePaths roleTreePaths;
			roleTreePaths = new RoleTreePaths();
			roleTreePaths.setAncestor(roleVo.get(i).getRoleId());
			roleTreePaths.setDescendant(roleVo.get(i).getRoleId());
			userMgtMapper.insertRoleTreePaths(roleTreePaths);
			
			for(int j=0; j<childRole.size();j++) 
			{	
				roleTreePaths = new RoleTreePaths();
				roleTreePaths.setAncestor(roleVo.get(i).getRoleId());
				roleTreePaths.setDescendant(childRole.get(j).toString());
				if(Integer.parseInt(userMgtMapper.checkCirculaReference(roleTreePaths))>0)
				{
					throw new Exception(roleTreePaths.getDescendant() + "is able to include circula reference value(s).");
				}
				userMgtMapper.insertRoleTreePaths(roleTreePaths);
			}
			
			List<String> permission = roleVo.get(i).getPermission();
			for(int j=0; j<permission.size();j++) 
			{	
				RoleObjectOperationLnk roleObjectOperationLnk = new RoleObjectOperationLnk();
				roleObjectOperationLnk.setRoleId(roleVo.get(i).getRoleId());
				roleObjectOperationLnk.setObjectOperationId(permission.get(j).toString());
				userMgtMapper.insertPermission(roleObjectOperationLnk);
			}
		}
	}
	
	@Transactional
	public void updateRole(RoleVo roleVo) throws Exception
	{
		userMgtMapper.updateRole(roleVo);		
		userMgtMapper.deleteRoleTreePath(roleVo.getRoleId());
		userMgtMapper.deletePermission(roleVo.getRoleId());

		List<String> childRole = roleVo.getChildRole();
		
		RoleTreePaths roleTreePaths;
		roleTreePaths = new RoleTreePaths();
		roleTreePaths.setAncestor(roleVo.getRoleId());
		roleTreePaths.setDescendant(roleVo.getRoleId());
		userMgtMapper.insertRoleTreePaths(roleTreePaths);
		for(int i=0;i<childRole.size(); i++)
		{
			roleTreePaths = new RoleTreePaths();
			roleTreePaths.setAncestor(roleVo.getRoleId());
			roleTreePaths.setDescendant(childRole.get(i).toString());
			if(Integer.parseInt(userMgtMapper.checkCirculaReference(roleTreePaths))>0)
			{
				throw new Exception(roleTreePaths.getDescendant() + " is able to include circula reference value(s).");
			}
			userMgtMapper.insertRoleTreePaths(roleTreePaths); //반복적으로 하위 노드 생성 			
		}
		
		List<String> permission = roleVo.getPermission();
		for(int i=0; i<permission.size();i++) 
		{	
			RoleObjectOperationLnk roleObjectOperationLnk = new RoleObjectOperationLnk();
			roleObjectOperationLnk.setRoleId(roleVo.getRoleId());
			roleObjectOperationLnk.setObjectOperationId(permission.get(i).toString());
			userMgtMapper.insertPermission(roleObjectOperationLnk);
		}
		
	}
	
	@Transactional
	public List<ResultMessageVo> deleteRoles(List<String> roleId)
	{	
		List<ResultMessageVo> resultMessageVoList = new ArrayList<ResultMessageVo>();
		for(int i=0; i<roleId.size(); i++)
		{
			ResultMessageVo resultMessageVo = new ResultMessageVo();
			
			//role이 할당되어 있다면, role을 지울 수 없도록 해야함.
			List<String> assignedGroups= userMgtMapper.selectGroupsByRoleId(roleId.get(i));
			if(assignedGroups.size()>0)
			{
				String groups = "";
				for(int j=0;j<assignedGroups.size();j++)
				{
					groups = groups + assignedGroups.get(j) + ", ";
				}
				resultMessageVo.setFunction("delete");
				resultMessageVo.setType("role");
				resultMessageVo.setId(roleId.get(i));
				resultMessageVo.setResultFlag(false);
				String resultMessage = roleId.get(i) + " is assigned "+ groups +" so it is not able to delete.";
				resultMessageVo.setResultMessage(resultMessage);
			}
			else
			{				
				userMgtMapper.deletePermission(roleId.get(i));
				userMgtMapper.deleteRoleTreePath(roleId.get(i));			
				userMgtMapper.deleteRole(roleId.get(i));				
				resultMessageVo.setFunction("delete");
				resultMessageVo.setType("role");
				resultMessageVo.setId(roleId.get(i));
				resultMessageVo.setResultFlag(true);
				String resultMessage = roleId.get(i) + " is deleted.";
				resultMessageVo.setResultMessage(resultMessage);				
			}
			resultMessageVoList.add(resultMessageVo);
		}

		return resultMessageVoList;
	}

	@Transactional
	public RoleObjectVo selectRoleObjectList(String roleId)
	{
		RoleObjectVo roleObjectVo = new RoleObjectVo();
		roleObjectVo = userMgtMapper.selectRoleObjectList(roleId);
		List<ObjectVo> baseObjectVo = roleObjectVo.getObject();

		for(int i=0; i<baseObjectVo.size(); i++)
		{
			String objectId = baseObjectVo.get(i).getId();
			String objectOperationId = baseObjectVo.get(i).getObjectOperationId();
			List<String> operationId = userMgtMapper.selectOperationNameListByObjectId(objectOperationId);
			OperationVo operationVo = new OperationVo();
			operationVo.setActionAll(operationId.toString().toUpperCase().contains("ACTION_ALL"));
			operationVo.setFunctionAll(operationId.toString().toUpperCase().contains("FUNCTION_ALL"));
			operationVo.setView(operationId.toString().toUpperCase().contains("VIEW"));
			operationVo.setCreate(operationId.toString().toUpperCase().contains("CREATE"));
			operationVo.setModify(operationId.toString().toUpperCase().contains("MODIFY"));
			operationVo.setDelete(operationId.toString().toUpperCase().contains("DELETE"));

			List<ActionExtVo> actionExtVo = userMgtMapper.selectActionExtListByObjectId(objectId);
			operationVo.setActionExt(actionExtVo);
			baseObjectVo.get(i).setOperation(operationVo);
		}
		roleObjectVo.setObject(baseObjectVo);
				
		return roleObjectVo;
	}
	
	@Transactional
	public RoleObjectVo selectRoleObjectListIncludeChild(String roleId)
	{
		RoleObjectVo roleObjectVo = new RoleObjectVo();
		roleObjectVo = userMgtMapper.selectRoleObjectListIncludeChild(roleId);
		List<ObjectVo> baseObjectVo = roleObjectVo.getObject();

		for(int i=0; i<baseObjectVo.size(); i++)
		{
			String objectId = baseObjectVo.get(i).getId();
			String objectOperationId = baseObjectVo.get(i).getObjectOperationId();
			List<String> operationId = userMgtMapper.selectOperationNameListByObjectId(objectOperationId);
			OperationVo operationVo = new OperationVo();
			operationVo.setActionAll(operationId.toString().toUpperCase().contains("ACTION_ALL"));
			operationVo.setFunctionAll(operationId.toString().toUpperCase().contains("FUNCTION_ALL"));
			operationVo.setView(operationId.toString().toUpperCase().contains("VIEW"));
			operationVo.setCreate(operationId.toString().toUpperCase().contains("CREATE"));
			operationVo.setModify(operationId.toString().toUpperCase().contains("MODIFY"));
			operationVo.setDelete(operationId.toString().toUpperCase().contains("DELETE"));

			List<ActionExtVo> actionExtVo = userMgtMapper.selectActionExtListByObjectId(objectId);
			operationVo.setActionExt(actionExtVo);
			baseObjectVo.get(i).setOperation(operationVo);
		}
		roleObjectVo.setObject(baseObjectVo);
				
		return roleObjectVo;
	}
	
	
	//4. permissions
	@Transactional
	public List<PermissionVo> selectPermissionList()
	{
		List<PermissionVo> permissionVos = userMgtMapper.selectPermissionList();
		for(int i=0; i<permissionVos.size(); i++)
		{
			String objectId = permissionVos.get(i).getObjectId();
			List<ObjectOperationVo> operations = userMgtMapper.selectOperationList(objectId);
			permissionVos.get(i).setOperations(operations);
		}
				
		return permissionVos;
	}
	
	@Transactional
	public void insertObjectList(List<PermissionVo> permissionVos) throws Exception 
	{
		for(int i=0; i<permissionVos.size();i++)
		{
			List<String> exsistedObjects = userMgtMapper.selectObjectName();
			if(exsistedObjects.contains(permissionVos.get(i).getObjectName())) //중복되는 object가 있는가? 
			{
				throw new Exception(permissionVos.get(i).getObjectName() +" object is duplicated");
			}
			
			userMgtMapper.insertObject(permissionVos.get(i));			
			String objectId = userMgtMapper.selectCurrObjectId();
			
			//기본 operations 
			for(int j=1;j<=6;j++)
			{
				String operationId = String.valueOf(j); //1~6은 고정
				ObjectOperationLnk objectOperationLnk = new ObjectOperationLnk();
				objectOperationLnk.setObjectId(objectId);
				objectOperationLnk.setOperationId(operationId);	
				userMgtMapper.insertObjectOperationLnk(objectOperationLnk);
			}
			
			//추가 operations
			List<ObjectOperationVo> operations = permissionVos.get(i).getOperations();
			List<String> exsistedOperations = userMgtMapper.selectOperationName();

			//operation 값 검사 로직 추가
			for(int j=0;j<operations.size();j++)
			{
				ObjectOperationVo objectOperationVo = operations.get(j);
				
				if(exsistedOperations.contains(objectOperationVo.getOperationName())) //중복되는 operation 있는가? 
				{
					throw new Exception(objectOperationVo.getOperationName() +" operation is duplicated");
				}
				
				userMgtMapper.insertObjectOperation(objectOperationVo);				
				String objectOperationId = userMgtMapper.selectCurrObjectOperationId();
				ObjectOperationLnk objectOperationLnk = new ObjectOperationLnk();
				objectOperationLnk.setObjectId(objectId);
				objectOperationLnk.setOperationId(objectOperationId);
				userMgtMapper.insertObjectOperationLnk(objectOperationLnk);				
			}
			
		}		
	}
	
	@Transactional
	public void updateObject(PermissionVo permissionVo) throws Exception {
		String objectName = permissionVo.getObjectName();
		String objectId = permissionVo.getObjectId();
		
		List<String> exsistedObjects = userMgtMapper.selectObjectName();
		exsistedObjects.remove(objectName);
		if(exsistedObjects.contains(objectName)) //중복되는 object가 있는가? 
		{
			throw new Exception(permissionVo.getObjectName() +" object is duplicated");
		}
		
		List<String> operationIds =  userMgtMapper.selectExtOperationIdsByObjectId(objectId);
		
		for(int i=0;i<operationIds.size();i++)//delete lnk
		{
			ObjectOperationLnk objectOperationLnk = new ObjectOperationLnk();
			objectOperationLnk.setObjectId(objectId);
			objectOperationLnk.setOperationId(operationIds.get(i));
			userMgtMapper.deleteObjectOperationLnk(objectOperationLnk);			
		}
		for(int i=0;i<operationIds.size();i++)//delete operation
		{
			userMgtMapper.deleteExtOperationById(operationIds.get(i));
		}
		//update setArea
		userMgtMapper.updateObject(permissionVo);
		
		List<ObjectOperationVo> operations = permissionVo.getOperations();
		List<String> exsistedOperations = userMgtMapper.selectOperationName();
		
		//operation 값 검사 로직 추가
		for(int i=0;i<operations.size();i++)
		{
			ObjectOperationVo objectOperationVo = operations.get(i);
			
			if(exsistedOperations.contains(objectOperationVo.getOperationName())) //중복되는 operation 있는가? 
			{
				throw new Exception(objectOperationVo.getOperationName() +" operation is duplicated");
			}
			
			userMgtMapper.insertObjectOperation(objectOperationVo);
			String objectOperationId = userMgtMapper.selectCurrObjectOperationId();
			ObjectOperationLnk objectOperationLnk = new ObjectOperationLnk();
			objectOperationLnk.setObjectId(objectId);
			objectOperationLnk.setOperationId(objectOperationId);
			userMgtMapper.insertObjectOperationLnk(objectOperationLnk);				
		}		
	}
	
	@Transactional
	public void deleteObjectById(String objectId){
		
		List<String> operationIds =  userMgtMapper.selectExtOperationIdsByObjectId(objectId);
		
		//operation
		//ext
		for(int i=0;i<operationIds.size();i++)
		{
			ObjectOperationLnk objectOperationLnk = new ObjectOperationLnk();
			objectOperationLnk.setObjectId(objectId);
			objectOperationLnk.setOperationId(operationIds.get(i));
			userMgtMapper.deleteObjectOperationLnk(objectOperationLnk);			
		}
		//org
		for(int i=1;i<=6;i++)
		{
			ObjectOperationLnk objectOperationLnk = new ObjectOperationLnk();
			objectOperationLnk.setObjectId(objectId);
			objectOperationLnk.setOperationId(String.valueOf(i));
			userMgtMapper.deleteObjectOperationLnk(objectOperationLnk);			
		}		
		//operation
		for(int i=0;i<operationIds.size();i++)
		{
			userMgtMapper.deleteExtOperationById(operationIds.get(i));
		}
		
		userMgtMapper.deleteObjectById(objectId);
	}
	
	public void uploadImage(String userId, MultipartFile uploadFile, HttpServletRequest request) throws IllegalStateException, IOException {
		
		String originalFileName = null;
		String originFileNameExtension = null;
		String storedFileName = null;
		String storedFilePath = null;
		long fileSize = 0;
		UserImage userImage = new UserImage();
		
    	HttpSession session = request.getSession();
        String root_path = session.getServletContext().getRealPath(""); // 웹서비스 root 경로
        String storedFolderPath = root_path + File.separator + "image";  //일단 고정.
		File saveFile = new File(storedFolderPath);
		
		if(saveFile.exists() == false){
			saveFile.mkdirs();
		}
		
		if (uploadFile != null) {
			originalFileName = uploadFile.getOriginalFilename();
			originFileNameExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
			storedFileName = UUID.randomUUID().toString().replaceAll("-", "") + originFileNameExtension;
			storedFilePath = storedFolderPath + File.separator + storedFileName;
			fileSize = uploadFile.getSize();
			
			File file = new File(storedFilePath);
			uploadFile.transferTo(file);

			userImage.setUserId(userId);
			userImage.setOriginalFileName(originalFileName);
			userImage.setStoredFileName(storedFileName);
			userImage.setStoredPath(storedFilePath);
			userImage.setFileSize(fileSize);
			
			UserImage storedUserImage = userMgtMapper.selectImageByUser(userId);
			if (storedUserImage == null){
				userMgtMapper.insertImage(userImage);
			}else{
				//update image table
				userMgtMapper.updateStoredImageUrl(userImage);
			}
		}
		//update user table.
		userMgtMapper.updateProfileImageUrl(userId, storedFilePath);
	}
	
	public void downloadImage(String userId, HttpServletResponse response) throws IOException{
		UserImage userImage = userMgtMapper.selectImageByUser(userId);
	
		String storedFilePath = userImage.getStoredPath();
		String originalFileName = userImage.getOriginalFileName();
		
		byte fileByte[] = FileUtils.readFileToByteArray(new File(storedFilePath));
		
		response.setContentType("application/octet-stream");
		response.setContentLength(fileByte.length);
		response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(originalFileName, "UTF-8") + "\";");
		response.setHeader("Content-Transfer-Encoding", "binary");
		
		OutputStream out = response.getOutputStream();
		FileInputStream fis = null;
		
		fis = new FileInputStream(storedFilePath);
		FileCopyUtils.copy(fis, out);
		out.flush();
		fis.close();
	}
	
	public UserImage selectImageByUser(String userId){
		return userMgtMapper.selectImageByUser(userId);
	}
	
	public String selectGroupIdByUserId(String userId) {
		return userMgtMapper.selectGroupIdByUserId(userId);
	}
}