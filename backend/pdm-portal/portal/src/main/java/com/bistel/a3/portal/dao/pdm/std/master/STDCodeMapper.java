package com.bistel.a3.portal.dao.pdm.std.master;

import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.pdm.std.master.STDCode;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by yohan on 15. 11. 17.
 */
public interface STDCodeMapper {
    List<Code> selectByCategory( @Param("category") String category, @Param("used_yn") Boolean used);
    @MapKey("code")
    Map<String, Code> selectCodeMapByCategory(@Param("category") String category, @Param("used_yn") Boolean used);
    void deleteByCategory(@Param("category") String category);
//    void insert(Code code);
    void delete(Code code);
    void deleteByCodeId(Long codeId);

    List<Code> selectCodeList();
//    Code selectCodeByCategory(@Param("category") String category);
    void updateCode(Code code);

    void updateCode(String name, Integer codeOrder, Boolean defaultCode, Boolean used, String description);

    List<String> selectCategories();

    //Allen 2018-04-13
    void insertSTDCode(STDCode code);

    void updateSTDCode(STDCode code);

    void updateSTDCodeOrdering(@Param("rawId")Long rawId,@Param("ordering") Integer ordering,@Param("update_by") String update_by);

    Integer selectMaxOrdering();

    }
