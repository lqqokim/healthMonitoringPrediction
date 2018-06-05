package com.bistel.a3.portal.domain.common;

/**
 * Created by yohan on 15. 11. 2.
 */
public class UserWithPass extends User {
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
