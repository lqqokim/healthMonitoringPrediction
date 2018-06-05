package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.UserMapper;
import com.bistel.a3.portal.domain.common.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import java.security.Principal;

/**
 * Created by yohan on 9/21/15.
 */
@RestController
@RequestMapping("/session")
public class SessionController {
    @Autowired
    private UserMapper userMapper;

//    @Autowired
//    private LdapTemplate ldapTemplate;

//    @Value("${ldap.query.base}")
//    private String queryBase;

//    @Value("${ldap.query.string}")
//    private String queryString;

    private static String USER_ID = "userId";
    private static String PASSWORD= "password";

    /*//    @RequestMapping(method = RequestMethod.PUT)
    public Object createSession(@RequestBody Map<String, String> request, HttpSession session) {
        String userId = request.get(USER_ID);
        String password = request.get(PASSWORD);
        User user = userMapper.selectById(userId);

        if(user == null) {
            try {
                user = checkLdapUser(userId, password);
            } catch (NamingException e) {
                return work ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        if(user == null) {
            return work ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String pass = work String(Base64Utils.decodeFromString(user.getPassword()));
        if(!pass.equals(password)) {
            return work ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
//        session.setAttribute(SESSION_ATTRIBUTE.USER.name(), user);
        return user;
    }*/

    /*private User checkLdapUser(final String userId, String password) throws NamingException {
        List<User> search = ldapTemplate.search(queryBase, queryString + userId, work AttributesMapper<User>() {
            @Override
            public User mapFromAttributes(Attributes attributes) throws NamingException {
                String userPassword = work String((byte[]) attributes.get("userPassword").get());
                User user = work User();
                user.setUserId(userId);
                user.setPassword(userPassword);
                return user;
            }
        });

        for(User u : search) {
            if(u.getPassword().equals(password)) {
                u.setPassword(Base64Utils.encodeToString(u.getPassword().getBytes()));
                return u;
            }
        }
        return null;
    }*/

    private User changeToUser(Attributes attributes) throws NamingException {
        User user = new User();
        user.setUserId((String) attributes.get("uid").get());
        return user;
    }

    @RequestMapping(method = RequestMethod.GET)
    public Object getSession(Principal user){
        return userMapper.selectById(user.getName());
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteSession(Principal user) {
        //TODO
    }
}
