package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.domain.common.App;
import com.bistel.a3.portal.service.impl.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Modified by alan on 2016.11.16
 * Created by yohan on 15. 11. 17.
 */
@RestController
@RequestMapping("/apps")
public class AppController {
	
	@Autowired
	private AppService appService;

    @RequestMapping
    public List<App> gets() {
        return appService.gets();
    }

    @RequestMapping("/{appName}")
    public App get(@PathVariable String appName) {
        return appService.get(appName);
    }    

}
