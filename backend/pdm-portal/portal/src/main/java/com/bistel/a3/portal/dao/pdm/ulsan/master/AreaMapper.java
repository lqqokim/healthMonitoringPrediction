package com.bistel.a3.portal.dao.pdm.ulsan.master;

import com.bistel.a3.portal.domain.pdm.db.Area;
import com.bistel.a3.portal.domain.pdm.master.AreaWithChildren;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AreaMapper {
    List<AreaWithChildren> selectList(@Param("parentId") Long parentId);

    Area selectOne(@Param("areaId") Long areaId);

    void insertOne(Area area);

    void deleteOne(@Param("areaId") Long areaId);

    void updateOne(Area area);
}
