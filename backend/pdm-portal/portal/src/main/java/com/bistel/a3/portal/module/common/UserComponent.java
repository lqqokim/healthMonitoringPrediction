package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.UserMapper;
import com.bistel.a3.portal.domain.common.Dashboard;
import com.bistel.a3.portal.domain.common.User;
import com.bistel.a3.portal.domain.common.UserWithPass;
import com.bistel.a3.portal.domain.common.Workspace;
import com.bistel.a3.portal.service.impl.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Base64Utils;

import java.security.Principal;
import java.util.List;

/**
 * 2016.11.xx 기존 common service의 비구조화를 개선하기 위해, 구조적으로 변경하기 위해 생성 
 * (기존 mapper -> controller)
 * (수정 mapper -> component -> service -> controller)
 * dashboardController, workspaceController 변경에 따라 검증 해 봐야함. (값이 올바르게 오고 있는지?)
 * @author AlanMinjaePark
 */
@Component
public class UserComponent {

	@Autowired
    private UserMapper userMapper;

    @Autowired
    private DashboardComponent dashboardComponent; //tobe

    @Autowired
    private WorkspaceService workspaceService;

    public Object gets(){
        return userMapper.selectAll();
    }

    public void sets(List<UserWithPass> users) {
        for(UserWithPass user : users) {
            user.setPassword(Base64Utils.encodeToString(user.getPassword().getBytes()));
            userMapper.insert(user);
        }
    }

    public void set(UserWithPass user, String userId) {
        user.setPassword(Base64Utils.encodeToString(user.getPassword().getBytes()));
        userMapper.update(user);
    }

    public void removes(List<String> userIds, Principal user) {
        for(String userId : userIds) {
            remove(userId,user);
        }
    }

    public void remove(String userId, Principal user) {
        List<Dashboard> dashboards = dashboardComponent.getDashboards(userId);
        for(Dashboard dashboard : dashboards) {
        	dashboardComponent.remove(dashboard.getDashboardId(), user);
        }

        List<Workspace> workspaces = workspaceService.gets(userId, "true");
        for(Workspace workspace : workspaces) {
        	workspaceService.remove(workspace.getWorkspaceId(), userId);
        }
        userMapper.delete(userId);
    }
    
    public User get(String userId) {
    	return userMapper.selectById(userId);
    }
}
