package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.User;
import com.bistel.a3.portal.domain.common.UserWithPass;
import com.bistel.a3.portal.module.common.UserComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class UserService {
	
	@Autowired
	private UserComponent userComponent;
	
	public Object gets(){
        return userComponent.gets();
    }

    public void sets(List<UserWithPass> users) {
    	userComponent.sets(users);
    }

    public void set(UserWithPass user, String userId) {
    	userComponent.set(user, userId);
    }

    public void removes(List<String> userIds, Principal user) {
    	userComponent.removes(userIds, user);
    }

    public void remove(String userId, Principal user) {
    	userComponent.remove(userId, user);
    }
    
    public User get(String userId) {
    	return userComponent.get(userId);
    }
}
