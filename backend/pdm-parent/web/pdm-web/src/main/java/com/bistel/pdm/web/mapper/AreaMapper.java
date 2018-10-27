package com.bistel.pdm.web.mapper;

import com.bistel.pdm.web.domain.Area;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AreaMapper {

    //@Select("select * from area_mst_pdm where name = #{name}")
    //Area findByName(@Param("name") String name);

    Area findByName(String name);
}
