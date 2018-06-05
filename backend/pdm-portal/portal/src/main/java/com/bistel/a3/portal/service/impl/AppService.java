package com.bistel.a3.portal.service.impl;

import com.bistel.a3.portal.domain.common.App;
import com.bistel.a3.portal.module.common.AppComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 
 * common
 * @author AlanMinjaePark
 *
 */

@Service
public class AppService {
	
	@Autowired
	private AppComponent appComponent;
	
    public List<App> gets() {
        return appComponent.get();
    }
    
    public App get(String appName) {
        return appComponent.get(appName);
    }
}
