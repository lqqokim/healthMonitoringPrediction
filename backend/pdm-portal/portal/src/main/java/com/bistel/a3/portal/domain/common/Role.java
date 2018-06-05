package com.bistel.a3.portal.domain.common;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by yohan on 9/14/15.
 */
public class Role {
    private String id;
    private String name;

    private Set<User> users = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}
