package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.Role;
import com.bistel.a3.portal.domain.common.UserWithRole;
import com.bistel.a3.portal.oauth.UserWithRolesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.Base64Utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by yohan on 15. 11. 20.
 */
public class AcubedUserDetailsService implements UserDetailsService {
    @Autowired
    private UserWithRolesMapper userWithRolesMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserWithRole userWithRole = userWithRolesMapper.selectUserWithRoles(username);
        String password = new String(Base64Utils.decode(userWithRole.getPassword().getBytes()));
        return new User(userWithRole.getUserId(), password, grantedAuthorities(userWithRole.getRoles()));
    }

    private Collection<? extends GrantedAuthority> grantedAuthorities(List<Role> roles) {
        Collection<GrantedAuthority> list = new ArrayList<>();
        for(Role role : roles) {
            list.add(new SimpleGrantedAuthority(role.getName()));
        }
        return list;
    }
}
