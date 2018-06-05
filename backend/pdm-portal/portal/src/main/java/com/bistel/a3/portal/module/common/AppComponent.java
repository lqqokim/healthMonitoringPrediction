package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.AppMapper;
import com.bistel.a3.portal.domain.common.App;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 2016.11.xx 기존 common service의 비구조화를 개선하기 위해, 구조적으로 변경하기 위해 생성 
 * (기존 mapper -> controller)
 * (수정 mapper -> component -> service -> controller)
 * @author AlanMinjaePark
 */
@Component
public class AppComponent {

	@Autowired
    private AppMapper appMapper;
    
    public List<App> get()
    {
    	return appMapper.selectAll();
    }
    
    public App get(String appName) {
        return appMapper.selectByName(appName);
    }
}
