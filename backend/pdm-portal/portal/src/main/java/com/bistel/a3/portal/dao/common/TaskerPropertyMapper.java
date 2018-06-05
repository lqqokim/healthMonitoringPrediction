package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.Property;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 10. 29.
 */
public interface TaskerPropertyMapper {
    List<Property> selectByTaskerId(@Param("column") String column, @Param("taskerId") Long taskerId);
    JsonNode select(@Param("column") String column, @Param("taskerId") Long taskerId, @Param("key") String key);
    void insert(@Param("column") String column, @Param("taskerId") Long taskerId, @Param("property") Property property);
    void update(@Param("column") String column, @Param("taskerId") Long taskerId, @Param("key") String key, @Param("value") JsonNode value);
    void delete(@Param("column") String column, @Param("taskerId") Long taskerId, @Param("key") String key);
}
