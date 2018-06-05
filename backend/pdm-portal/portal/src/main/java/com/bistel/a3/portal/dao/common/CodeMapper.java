package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by yohan on 15. 11. 17.
 */
public interface CodeMapper {
    List<Code> selectByCategoryName(@Param("appName") String appName, @Param("categoryName") String categoryName, @Param("used") Boolean used);
    @MapKey("code")
    Map<String, Code> selectCodeMapByCategoryName(@Param("appName") String appName, @Param("categoryName") String categoryName, @Param("used") Boolean used);
    void deleteByCategoryId(@Param("codeCategoryId") Long codeCategoryId);
    void insert(Code code);
    void delete(Code code);
    void deleteByCodeId(Long codeId);

    List<Code> selectCodeList();
    Code selectCodeByCategoryId(@Param("codeCategoryId") Long codeCategoryId);
    void updateCode(Code code);

    void updateCode(String name, Integer codeOrder, Boolean defaultCode, Boolean used, String description);
}
