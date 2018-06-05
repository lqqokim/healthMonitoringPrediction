package com.bistel.a3.portal.module.pdm;

import com.bistel.a3.portal.dao.pdm.ulsan.PartDataMapper;
import com.bistel.a3.portal.domain.pdm.db.ManualRpm;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class RpmDataComponent {
    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    private Map<String, Map<Long, ManualRpm>> map = new HashMap<>();

    public Double getSpeed(String fabId, Long speedParamId) {
        if(!map.containsKey(fabId)) {
            PartDataMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, PartDataMapper.class);
            Map<Long, ManualRpm> rpm = mapper.selectManualRpm();
            map.put(fabId, rpm);
        }

        Map<Long, ManualRpm> speedMap = map.get(fabId);
        if(!speedMap.containsKey(speedParamId)) {
            return 0d;
        }

        return speedMap.get(speedParamId).getRpm();
    }
}
