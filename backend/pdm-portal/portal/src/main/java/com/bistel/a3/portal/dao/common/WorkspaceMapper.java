package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.*;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 11. 3.
 * Modified by alan on 16. 12. 8.
 * Modified by david lee on 17. 3. 8.
 */
public interface WorkspaceMapper {
	
    List<Workspace> selectByUserWithShare(@Param("userId") String userId);
    List<Workspace> selectByUser(@Param("userId") String userId);	
    List<String> selectSharingUsersByWorkspaceId(@Param("workspaceId") Long workspaceId, @Param("userId") String userId);
    List<String> selectShareGroupsByWorkspaceId(@Param("workspaceId") Long workspaceId);
    List<String> selectSharedUsersByOworkspaceIdIncludeOwner(@Param("workspaceId") Long workspaceId);
    List<String> selectSharingGroupsByWorkspaceId(@Param("workspaceId") Long workspaceId);
    List<String> selectWorkspaceSharingGroupUserListWithoutMyId(@Param("workspaceId") Long workspaceId, @Param("userId") String userId, @Param("groupId") String groupId);
    List<MyWorkspace> selectMyWorkspaces(@Param("userId") String userId);
    List<WorkspaceShareMemberInfo> selectWorspaceShareMemberInfo(@Param("workspaceId")long workspaceId, @Param("userId") String userId);
    List<WorkspaceShareMember> selectShareWorkspaceMember(@Param("workspaceId")long workspaceId, @Param("userId") String userId);
    List<WorkspaceShareMemberGroupUser> selectUserImgByGroup(@Param("userId") String userId, @Param("groupId") String groupId);
    List<User> selectWorkspaceSharedUser(@Param("userId") String userId);
    List<User> selectWorkspaceSharingUser(@Param("userId") String userId);
    List<WorkspaceOwner> selectWorkspaceIdsWithOwnerId(@Param("userId") String userId,  @Param("sharedIncludeYN") Boolean sharedIncludeYN, @Param("workspacesCount") Long workspacesCount);
    List<WorkspaceMapNode> selectWorkspaceNodes(@Param("userId") String userId, @Param("workspaceIdList") List<Long> workspaceIdList);
    List<WorkspaceMapNode> selectTaskerMapByWorkspaceIdList(@Param("userId") String userId, @Param("workspaceIdList") List<Long> workspaceIdList);
    List<Long> selectSharedWorkspaceIds(@Param("sharedUserId") String sharedUserId,  @Param("ownerUserId") String userId, @Param("workspacesCount") Long workspacesCount);
    List<Long> selectSharingWorkspaceIds(@Param("userId") String ownerUserId,  @Param("sharingUserId") String sharingUserId, @Param("workspacesCount") Long workspacesCount);
    List<ShareUser> selectSharedWorkspaceUsers(@Param("userId") String userId);
    List<ShareUser> selectSharingWorkspaceUsers(@Param("userId") String userId);
    
    Workspace selectById(@Param("userId") String userId, @Param("workspaceId") Long workspaceId);
    MyWorkspace selectMyWorkspace(@Param("userId") String userId, @Param("workspaceId") Long workspaceId);
    Integer selectWorkspaceCountByWorkspaceId(@Param("workspaceId") long workspaceId);
    String selectWorkspaceTitle(@Param("workspaceId") Long workspaceId);
    String selectUserIdByWorkspaceId(@Param("workspaceId") Long workspaceId);
    String selectGroupIdByUserId(@Param("userId") String userId, @Param("workspaceId") Long workspaceId);
    User selectUserByWorkspaceId(@Param("workspaceId") Long workspaceId);
    
    void insert(Workspace workspace);
    void insertUserWorkspaceLnk(Workspace workspace);    
    void update(Workspace workspace);
    void updateWorkspaceFavorite(Workspace workspace);
    void deleteWorkspaceLinkById(@Param("workspaceId") long workspaceId, @Param("userId") String userId);
    void delete(@Param("workspaceId") Long workspaceId, @Param("userId") String userId);
    void deleteGroupShareById(@Param("workspaceId") long workspaceId, @Param("groupId") String groupId);
    void insertWorkspaceShareMembersGroup(@Param("workspaceId") long workspaceId, @Param("groupId") String id);
    void insertWorkspaceShareMembersUser(@Param("workspaceId") long workspaceId, @Param("userId") String id, @Param("favorite") Boolean favorite);
    
}
