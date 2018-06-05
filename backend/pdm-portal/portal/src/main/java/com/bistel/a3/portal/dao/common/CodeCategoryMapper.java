package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.CodeCategory;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by yohan on 15. 11. 17.
 */
public interface CodeCategoryMapper {
    List<CodeCategory> selectByAppName(@Param("appName") String appName);
    CodeCategory selectByName(@Param("appName") String appName, @Param("categoryName") String categoryName);
    void insert(@Param("appName") String appName, @Param("codeCategory") CodeCategory codeCategory);
    void update(CodeCategory codeCategory);
    void delete(CodeCategory codeCategory);
}
