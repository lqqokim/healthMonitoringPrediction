package com.bistel.a3.portal.domain.common;

import java.util.List;

/**
 * Created by yohan on 15. 11. 2.
 */
public class UserWithRole extends UserWithPass {
    private List<Role> roles;

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }
}
