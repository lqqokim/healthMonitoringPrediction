package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.UserWithPass;
import com.bistel.a3.portal.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * Modified by alan on 2016.11.16
 * Created by yohan on 12/14/15.
 */
@RestController
@RequestMapping("/users")
@Transactional
public class UserController {
    @Autowired
    private UserService userService;


    @RequestMapping(method = RequestMethod.GET)
    public Object gets(){
        return userService.gets();
    }

    @RequestMapping(method = RequestMethod.PUT)
    public void sets(@RequestBody List<UserWithPass> users) {
    	userService.sets(users);
    }

    @RequestMapping(method = RequestMethod.PUT, value = "/{userId}")
    public void set(@RequestBody UserWithPass user, @PathVariable String userId) {
    	userService.set(user, userId);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public void removes(@RequestBody List<String> userIds, Principal user) {
    	userService.removes(userIds, user);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/{userId}")
    public void remove(@PathVariable String userId, Principal user) {
    	userService.remove(userId, user);
    }
}
