package com.bistel.a3.portal.rest.usermgt;

import com.bistel.a3.portal.domain.common.Dashboard;
import com.bistel.a3.portal.domain.usermgt.*;
import com.bistel.a3.portal.service.impl.DashboardService;
import com.bistel.a3.portal.service.impl.UserMgtService;
import com.bistel.a3.portal.service.impl.WidgetService;
import com.bistel.a3.portal.util.usermgt.UserMgtExceptionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/usermgt")
public class UserMgtController extends UserMgtExceptionHandler{

	@Autowired
	private UserMgtService userMgtService;
	@Autowired
    private DashboardService dashboardService;
    @Autowired
    private WidgetService widgetService;
	
    @RequestMapping(method = RequestMethod.GET, value="/users")
    public List<UsersVo> selectUserList(){
        return userMgtService.selectUserList();
    }
    
    @RequestMapping(method = RequestMethod.GET, value="/authorities")
    public List<String> selectUserAuthorityList(Authentication authentication){
        return userMgtService.selectUserAuthorityList(authentication.getName());
    }
    
    @RequestMapping(method = RequestMethod.GET, value="/users/{userId}")
    public UsersVo selectUser(@PathVariable("userId") String userId){
        return userMgtService.selectUser(userId);
    }

    @RequestMapping(method = RequestMethod.GET, value="/groupusers/{groupId}")
    public List<UsersVo> selectGroupUsers(@PathVariable("groupId") String groupId){
        return userMgtService.selectGroupUsers(groupId);
    }
    
    @RequestMapping(method = RequestMethod.POST, value="/users")
    public void insertUsers(@RequestBody List<UsersVo> usersVo,Principal user)
    {
    	userMgtService.insertUsers(usersVo);

        List<Long> dashboardIds = dashboardService.createDefaultDashboard(usersVo);
        List<Dashboard> dashboards = dashboardService.getDashboards("DEFAULTDASHBOARD");
        List<Long> defaultDashboardIds = new ArrayList<>();
        for (int i = 0; i < dashboardIds.size(); i++) {
            defaultDashboardIds.add(dashboards.get(i).getDashboardId());
        }
        widgetService.createDefaultWidget(defaultDashboardIds, dashboardIds);
    }
    
    @RequestMapping(method = RequestMethod.PUT, value="/users/{userId}")
    public void updateUser(@PathVariable("userId") String userId, @RequestBody UsersVo usersVo)
    {
    	userMgtService.updateUser(usersVo);
    }

    @RequestMapping(method = RequestMethod.PUT, value="/userprofile/{userId}")
    public void updateUserProfile(@PathVariable("userId") String userId, @RequestBody UsersVo usersVo)
    {
    	userMgtService.updateUserProfile(usersVo);
    }

    
    @RequestMapping(method = RequestMethod.DELETE, value="/users")
    @Transactional
    public void deleteUsers(@RequestBody List<String> userIds) {
    	for(String userId : userIds) {
            Principal user = new UsernamePasswordAuthenticationToken(userId, null);
    	    List<Dashboard> dashboards = dashboardService.getDashboards(userId);
    	    for(Dashboard dashboard : dashboards) {
                dashboardService.remove(dashboard.getDashboardId(), user);
            }
        }
        userMgtService.deleteUsers(userIds);
    }
    
    @RequestMapping(method = RequestMethod.GET, value="/groups")
    public List<GroupsVo> selectGroupList(){
        return userMgtService.selectGroupList();
    }
    
    @RequestMapping(method = RequestMethod.GET, value="/groups/{groupId}")
    public GroupsVo selectGroup(@PathVariable("groupId") String groupId){
        return userMgtService.selectGroup(groupId);
    }
    
    @RequestMapping(method = RequestMethod.POST, value="/groups")
    public void insertGroups(@RequestBody List<GroupsVo> groupsVo)
    {
    	userMgtService.insertGroups(groupsVo);
    }
    
    @RequestMapping(method = RequestMethod.PUT, value="/groups/{groupId}")
    public void updateGroup(@PathVariable("groupId") String groupId, @RequestBody GroupsVo groupsVo)
    {
    	userMgtService.updateGroup(groupsVo);
    }
    
    @RequestMapping(method = RequestMethod.DELETE, value="/groups")
    public List<ResultMessageVo> deleteGroup(@RequestBody List<String> groupId)
    {
    	return userMgtService.deleteGroups(groupId);    	
    }
    
    @RequestMapping(method = RequestMethod.GET, value="/roles")
    public List<RolesVo> selectRolesList(){
        return userMgtService.selectRolesList();
    }

    @RequestMapping(method = RequestMethod.GET, value="/roles/{roleId}")
    public RoleObjectVo selectRoles(@PathVariable("roleId") String roleId){
    	return userMgtService.selectRoleObjectList(roleId);
    }
    
    @RequestMapping(method = RequestMethod.GET, value="/rolesic/{roleId}")
    public RoleObjectVo selectRolesIc(@PathVariable("roleId") String roleId){
    	return userMgtService.selectRoleObjectListIncludeChild(roleId);
    }
    
    
//    @RequestMapping(method = RequestMethod.GET, value="/roles/{roleId}")
//    public List<RoleVo> selectRoles(@PathVariable("roleId") String roleId){
//    	return userMgtService.selectRoles(roleId);
//    }
    
    @RequestMapping(method = RequestMethod.POST, value="/roles")
    public void insertRoles(@RequestBody List<RoleVo> roleVo) throws Exception
    {
    	userMgtService.insertRoles(roleVo);
    }
    
    @RequestMapping(method = RequestMethod.PUT, value="/roles/{roleId}")
    public void updateRole(@PathVariable("roleId") String roleId, @RequestBody RoleVo roleVo) throws Exception
    {
    	userMgtService.updateRole(roleVo);
    }
    
    @RequestMapping(method = RequestMethod.DELETE, value="/roles")
    public List<ResultMessageVo> deleteRoles(@RequestBody List<String> roleId)
    {
    	return userMgtService.deleteRoles(roleId);
    }
    
    @RequestMapping(method = RequestMethod.GET, value="/permissions")
    public List<PermissionVo> selectPermissionList()
    {
    	return userMgtService.selectPermissionList();
    }
    
    @RequestMapping(method = RequestMethod.POST, value="/permissions")
    public void insertObjectList(@RequestBody List<PermissionVo> permissionVos) throws Exception
    {
    	userMgtService.insertObjectList(permissionVos);
    }

    @RequestMapping(method = RequestMethod.PUT, value="/permissions/{objectId}")
	public void updateObject(@RequestBody PermissionVo permissionVo) throws Exception
	{
    	userMgtService.updateObject(permissionVo);
	}
    
    @RequestMapping(method = RequestMethod.DELETE, value="/permissions/{objectId}")    
    public void deleteObjectById(@PathVariable("objectId") String objectId)
	{
    	userMgtService.deleteObjectById(objectId);
	}
    
    @RequestMapping(method = RequestMethod.POST, value = "/profile/image/upload")
    public void uploadImage(Principal user, @RequestParam("file") MultipartFile uploadFile, HttpServletRequest request) throws IllegalStateException, IOException{
    	userMgtService.uploadImage(user.getName(), uploadFile, request);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/profile/image/download/{userId}")
    public void downloadImage(@PathVariable("userId") String userId, HttpServletResponse response) throws IOException{
    	userMgtService.downloadImage(userId, response);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/profile/image/{userId}")
    public UserImage selectImageByUser(@PathVariable("userId") String userId){
    	return userMgtService.selectImageByUser(userId);
    }
}
