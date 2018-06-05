package com.bistel.a3.portal.module.common;

import com.bistel.a3.portal.dao.common.CodeMapper;
import com.bistel.a3.portal.domain.common.Code;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CodeComponent {
    private Map<String, Map<String, Map<String, Code>>> codeMap = new HashMap<>();

    @Autowired
    private CodeMapper mapper;

    public Map<String, Code> getCodeMap(String appName, String codeCategory) {
        if(!codeMap.containsKey(appName)) {
            codeMap.put(appName, new HashMap<>());
        }
        Map<String, Map<String, Code>> categoryMap = codeMap.get(appName);
        if(!categoryMap.containsKey(codeCategory)) {
            categoryMap.put(codeCategory, mapper.selectCodeMapByCategoryName(appName, codeCategory, true));
        }

        return categoryMap.get(categoryMap);
    }

    public Code getCodeById(String appName, String category, String code) {
        Map<String, Code> codeMap = getCodeMap(appName, category);
        return codeMap.get(code);
    }
}
